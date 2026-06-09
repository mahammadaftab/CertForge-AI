from langchain_core.messages import SystemMessage, AIMessage
from app.services.ai.state import AgentState
from app.services.ai.config import llm
from app.models.audit_log import AuditLog

async def workload_agent(state: AgentState) -> dict:
    """
    Analyzes the proposed study plan against the employee's current project workload.
    """
    print("--- WORKLOAD AGENT ---")
    
    await AuditLog(
        action="AGENT_WORKLOAD_START", 
        details={"agent": "Manager Agent"}
    ).insert()
    
    study_plan = state.get("study_plan", {})
    
    system_prompt = f"""You are an HR Workload Balancer.
Analyze if the study plan ({study_plan.get('schedule', '')}) is feasible.
Output a status: 'Feasible', 'High Risk', or 'Overloaded', followed by a brief reason."""

    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    
    try:
        response = await llm.ainvoke(messages)
        status = "Feasible" if "Feasible" in response.content else "High Risk"
        
        await AuditLog(
            action="AGENT_WORKLOAD_SUCCESS", 
            details={"agent": "Manager Agent", "status": status}
        ).insert()

        return {
            "messages": [AIMessage(content=f"Workload analyzed: {status}")],
            "workload_status": status,
            "current_agent": "workload_agent",
            "next_action": "continue"
        }
    except Exception as e:
        await AuditLog(
            action="AGENT_WORKLOAD_ERROR", 
            details={"agent": "Manager Agent", "error": str(e)}
        ).insert()
        return {
            "errors": [f"WorkloadAgent Error: {str(e)}"],
            "next_action": "retry",
            "error_count": state.get("error_count", 0) + 1
        }
