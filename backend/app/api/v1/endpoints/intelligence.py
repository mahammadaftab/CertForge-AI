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
        final_state = orchestrator.invoke(initial_state)
        
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
