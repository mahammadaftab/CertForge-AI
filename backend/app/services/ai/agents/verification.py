from langchain_core.messages import SystemMessage, AIMessage
from app.services.ai.state import AgentState
from app.services.ai.config import llm
from app.models.audit_log import AuditLog

async def verification_agent(state: AgentState) -> dict:
    """
    Final check to ensure all data is logically consistent before returning to the user/DB.
    """
    print("--- VERIFICATION AGENT ---")
    
    await AuditLog(
        action="AGENT_VERIFICATION_START", 
        details={"agent": "Verification Agent"}
    ).insert()
    
    if len(state.get("errors", [])) > 0:
        await AuditLog(
            action="AGENT_VERIFICATION_FAILED", 
            details={"agent": "Verification Agent", "reason": "Previous errors detected"}
        ).insert()
        return {
            "messages": [AIMessage(content="Verification failed due to previous errors.")],
            "verification_status": "FAILED",
            "current_agent": "verification_agent",
            "next_action": "end"
        }
        
    system_prompt = """You are a Quality Assurance bot.
Review the provided plan and readiness score. Output 'APPROVED' if logical, else 'REJECTED'."""

    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    
    try:
        response = await llm.ainvoke(messages)
        status = "APPROVED" if "APPROVED" in response.content.upper() else "REJECTED"
        
        await AuditLog(
            action="AGENT_VERIFICATION_SUCCESS", 
            details={"agent": "Verification Agent", "status": status}
        ).insert()

        return {
            "messages": [AIMessage(content=f"Verification complete: {status}")],
            "verification_status": status,
            "current_agent": "verification_agent",
            "next_action": "end"
        }
    except Exception as e:
        await AuditLog(
            action="AGENT_VERIFICATION_ERROR", 
            details={"agent": "Verification Agent", "error": str(e)}
        ).insert()
        return {
            "errors": [f"VerificationAgent Error: {str(e)}"],
            "next_action": "retry",
            "error_count": state.get("error_count", 0) + 1
        }
