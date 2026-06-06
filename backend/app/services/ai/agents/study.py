from langchain_core.messages import SystemMessage, AIMessage
from app.services.ai.state import AgentState
from app.services.ai.config import llm

def study_plan_agent(state: AgentState) -> dict:
    """
    Translates the Learning Path into a concrete timeframe and study plan.
    """
    print("--- STUDY PLAN AGENT ---")
    
    learning_path = state.get("learning_path", {})
    
    system_prompt = f"""You are a Productivity Coach.
Based on this learning path: {learning_path.get('summary', '')}
Create a realistic weekly study plan. Consider standard enterprise working hours."""

    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    
    try:
        response = llm.invoke(messages)
        study_plan_data = {"schedule": "2 hours/day", "duration_weeks": 4, "details": response.content}
        
        return {
            "messages": [AIMessage(content="Study plan formulated.")],
            "study_plan": study_plan_data,
            "current_agent": "study_plan_agent",
            "next_action": "continue"
        }
    except Exception as e:
        return {
            "errors": [f"StudyPlanAgent Error: {str(e)}"],
            "next_action": "retry",
            "error_count": state.get("error_count", 0) + 1
        }
