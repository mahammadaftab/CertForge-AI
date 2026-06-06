from langchain_core.messages import SystemMessage, AIMessage
from app.services.ai.state import AgentState
from app.services.ai.config import llm

def insights_agent(state: AgentState) -> dict:
    """
    Compiles data into actionable insights for the Manager.
    """
    print("--- MANAGER INSIGHTS AGENT ---")
    
    score = state.get("readiness_score", 0)
    workload = state.get("workload_status", "Unknown")
    
    system_prompt = f"""You are a Leadership Advisor.
Summarize the candidate's situation for their manager.
Readiness: {score}% | Workload: {workload}
Provide 2 bullet points of advice for the manager."""

    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    
    try:
        response = llm.invoke(messages)
        
        return {
            "messages": [AIMessage(content="Manager insights generated.")],
            "manager_insights": {"summary": response.content, "action_required": score < 60},
            "current_agent": "insights_agent",
            "next_action": "continue"
        }
    except Exception as e:
        return {
            "errors": [f"InsightsAgent Error: {str(e)}"],
            "next_action": "retry",
            "error_count": state.get("error_count", 0) + 1
        }
