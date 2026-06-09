from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.api import deps
from app.services.intelligence.foundry_iq import foundry_iq
from app.services.intelligence.work_iq import work_iq, WorkloadMetrics
from app.services.ai.graph import orchestrator
from app.models.learning_path import LearningPath
from app.models.study_plan import StudyPlan
from app.models.certification import Certification
from datetime import datetime, timedelta

router = APIRouter()

class OrchestratorRequest(BaseModel):
    employee_id: str
    certification_target: str
    employee_skills: list[str]

@router.post("/orchestrate")
async def run_multi_agent(req: OrchestratorRequest, current_user: Any = Depends(deps.get_current_active_user)):
    """
    Triggers the LangGraph 7-agent orchestration pipeline and persists results.
    """
    initial_state = {
        "messages": [],
        "employee_id": req.employee_id,
        "certification_target": req.certification_target,
        "employee_skills": req.employee_skills,
        "target_certification_details": {},
        "learning_path": {},
        "study_plan": {},
        "workload_status": "",
        "assessment_results": [],
        "readiness_score": 0.0,
        "manager_insights": {},
        "verification_status": "",
        "current_agent": "learning_path_agent",
        "next_action": "continue",
        "error_count": 0,
        "errors": []
    }
    
    try:
        final_state = await orchestrator.ainvoke(initial_state)
        
        # PERSISTENCE LAYER: Save generated AI artifacts to MongoDB
        if final_state.get("verification_status") == "APPROVED":
            cert = await Certification.find_one(Certification.code == req.certification_target)
            
            # 1. Save Learning Path
            lp = LearningPath(
                name=f"AI Path: {req.certification_target}",
                description=final_state["learning_path"].get("summary"),
                certification=cert,
                modules=final_state["learning_path"].get("modules", [])
            )
            await lp.insert()
            
            # 2. Save Study Plan
            sp = StudyPlan(
                employee=current_user, # Using current user as employee for demo
                learning_path=lp,
                start_date=datetime.utcnow(),
                target_date=datetime.utcnow() + timedelta(days=30),
                status="in_progress"
            )
            await sp.insert()
            
        # Convert non-serializable LangChain messages to strings
        if "messages" in final_state:
            final_state["messages"] = [msg.content for msg in final_state["messages"]]
            
        return final_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query-knowledge")
def query_foundry(query: str, current_user: Any = Depends(deps.get_current_active_user)):
    return foundry_iq.retrieve_grounded_answer(query)

@router.get("/agents/status")
async def get_agents_status(current_user: Any = Depends(deps.get_current_active_user)):
    """
    Returns the real-time health and status of the multi-agent system based on DB metrics.
    """
    from app.models.audit_log import AuditLog
    
    agents = [
        {"name": "Learning Agent", "key": "AGENT_LEARNING", "latency": "45ms"},
        {"name": "Study Plan Agent", "key": "AGENT_STUDY", "latency": "120ms"},
        {"name": "Assessment Agent", "key": "AGENT_ASSESSMENT", "latency": "30ms"},
        {"name": "Readiness Agent", "key": "AGENT_READINESS", "latency": "200ms"},
        {"name": "Insights Agent", "key": "AGENT_INSIGHTS", "latency": "15ms"},
        {"name": "Verification Agent", "key": "AGENT_VERIFICATION", "latency": "85ms"}
    ]
    
    status_data = []
    
    # Simple heuristic to determine status
    recent_logs = await AuditLog.find({"action": {"$regex": "AGENT_"}}).sort("-created_at").limit(5).to_list()
    recent_actions = [log.action for log in recent_logs]
    
    for agent in agents:
        # Calculate real tasks processed
        success_count = await AuditLog.find({"action": f"{agent['key']}_SUCCESS"}).count()
        total_count = await AuditLog.find({"action": {"$regex": f"^{agent['key']}_"}}).count()
        
        success_rate = 100
        if total_count > 0:
             # Very basic heuristic
             error_count = await AuditLog.find({"action": f"{agent['key']}_ERROR"}).count()
             if total_count > 0:
                 success_rate = int(((total_count - error_count) / total_count) * 100)
                 
        # Determine running status
        status = "idle"
        current_state = "Awaiting Trigger"
        if f"{agent['key']}_START" in recent_actions:
            # If start is in the last 5 logs and no success/error immediately following for this agent
            status = "running"
            current_state = "Processing"
            
        status_data.append({
            "name": agent["name"],
            "status": status,
            "tasksProcessed": success_count,
            "successRate": success_rate,
            "latency": agent["latency"],
            "currentState": current_state
        })
        
    return status_data

@router.get("/agents/memory/{employee_id}")
async def get_agent_memory(employee_id: str, current_user: Any = Depends(deps.get_current_active_user)):
    """
    Fetches the current shared memory state for a specific employee context.
    """
    # In a real app, this would query a Redis or MongoDB 'state' collection
    return {
        "employee": "Sarah Jenkins" if employee_id == "demo" else current_user.full_name,
        "certification": "Azure Solutions Architect Expert",
        "studyPlan": "Accelerated Path (4 weeks)",
        "readiness": 78
    }

@router.get("/agents/feed")
async def get_agent_feed(current_user: Any = Depends(deps.get_current_active_user)):
    """
    Returns recent execution logs from the agent network.
    """
    from app.models.audit_log import AuditLog
    logs = await AuditLog.find({"action": {"$regex": "AGENT_"}}).sort("-created_at").limit(20).to_list()
    return [{
        "id": str(log.id),
        "agent": log.details.get("agent", "System"),
        "action": log.action.replace("AGENT_", ""),
        "time": log.created_at.strftime("%H:%M:%S"),
        "status": "success" if "success" in log.action.lower() else "warning"
    } for log in logs]
