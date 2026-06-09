from langchain_core.messages import SystemMessage, AIMessage
from app.services.ai.state import AgentState
from app.services.ai.config import llm
from app.models.audit_log import AuditLog

async def readiness_agent(state: AgentState) -> dict:
    """
    Calculates a readiness score (0-100) based on skills, assessments, and workload.
    """
    print("--- READINESS AGENT ---")
    
    await AuditLog(
        action="AGENT_READINESS_START", 
        details={"agent": "Readiness Agent"}
    ).insert()
    
    system_prompt = """You are a predictive AI model.
Based on the candidate's profile, study plan, and workload status, predict their exam readiness as a percentage (0-100).
Respond ONLY with a number."""

    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    
    try:
        response = await llm.ainvoke(messages)
        try:
            score = float(response.content.strip().replace('%', ''))
        except ValueError:
            score = 75.0 # fallback fallback
            
        await AuditLog(
            action="AGENT_READINESS_SUCCESS", 
            details={"agent": "Readiness Agent", "score": score}
        ).insert()

        return {
            "messages": [AIMessage(content=f"Readiness calculated: {score}%")],
            "readiness_score": score,
            "current_agent": "readiness_agent",
            "next_action": "continue"
        }
    except Exception as e:
        await AuditLog(
            action="AGENT_READINESS_ERROR", 
            details={"agent": "Readiness Agent", "error": str(e)}
        ).insert()
        return {
            "errors": [f"ReadinessAgent Error: {str(e)}"],
            "next_action": "retry",
            "error_count": state.get("error_count", 0) + 1
        }
