from langchain_core.messages import SystemMessage, AIMessage
from app.services.ai.state import AgentState
from app.services.ai.config import llm
from app.models.audit_log import AuditLog

async def learning_path_agent(state: AgentState) -> dict:
    """
    Generates a personalized learning path based on the employee's current skills and the target certification.
    """
    print("--- LEARNING PATH AGENT ---")
    
    await AuditLog(
        action="AGENT_LEARNING_START", 
        details={"agent": "Learning Agent", "target": state.get('certification_target')}
    ).insert()
    
    system_prompt = f"""You are an expert Learning & Development Architect.
Your task is to create a modular learning path for an employee targeting {state.get('certification_target')}.
Employee current skills: {', '.join(state.get('employee_skills', []))}
Identify the gaps and create a step-by-step module path. Output a summary and a list of modules."""

    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    
    try:
        response = await llm.ainvoke(messages)
        # In a real scenario, use structured output parsing
        learning_path_data = {"modules": ["Core Fundamentals", "Advanced Implementation"], "summary": response.content}
        
        await AuditLog(
            action="AGENT_LEARNING_SUCCESS", 
            details={"agent": "Learning Agent", "summary": "Learning path mapped successfully."}
        ).insert()

        return {
            "messages": [AIMessage(content="Learning path generated.")],
            "learning_path": learning_path_data,
            "current_agent": "learning_path_agent",
            "next_action": "continue"
        }
    except Exception as e:
        await AuditLog(
            action="AGENT_LEARNING_ERROR", 
            details={"agent": "Learning Agent", "error": str(e)}
        ).insert()
        return {
            "errors": [f"LearningPathAgent Error: {str(e)}"],
            "next_action": "retry",
            "error_count": state.get("error_count", 0) + 1
        }
