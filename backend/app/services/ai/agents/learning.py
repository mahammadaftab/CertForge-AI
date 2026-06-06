from langchain_core.messages import SystemMessage, AIMessage
from app.services.ai.state import AgentState
from app.services.ai.config import llm

def learning_path_agent(state: AgentState) -> dict:
    """
    Generates a personalized learning path based on the employee's current skills and the target certification.
    """
    print("--- LEARNING PATH AGENT ---")
    
    system_prompt = f"""You are an expert Learning & Development Architect.
Your task is to create a modular learning path for an employee targeting {state.get('certification_target')}.
Employee current skills: {', '.join(state.get('employee_skills', []))}
Identify the gaps and create a step-by-step module path."""

    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    
    try:
        response = llm.invoke(messages)
        # In a real scenario, use structured output parsing (e.g., PydanticOutputParser)
        learning_path_data = {"modules": ["Module 1", "Module 2"], "summary": response.content}
        
        return {
            "messages": [AIMessage(content="Learning path generated.")],
            "learning_path": learning_path_data,
            "current_agent": "learning_path_agent",
            "next_action": "continue"
        }
    except Exception as e:
        return {
            "errors": [f"LearningPathAgent Error: {str(e)}"],
            "next_action": "retry",
            "error_count": state.get("error_count", 0) + 1
        }
