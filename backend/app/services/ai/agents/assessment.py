from langchain_core.messages import SystemMessage, AIMessage
from app.services.ai.state import AgentState
from app.services.ai.config import llm

def assessment_agent(state: AgentState) -> dict:
    """
    Generates dynamic assessment questions based on the learning path.
    """
    print("--- ASSESSMENT AGENT ---")
    
    system_prompt = f"""You are a Certification Examiner for {state.get('certification_target')}.
Generate 3 multiple-choice questions to test the candidate's current knowledge baseline."""

    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    
    try:
        response = llm.invoke(messages)
        assessment_data = [{"q": "Sample Q1"}, {"q": "Sample Q2"}] # Mocked parser
        
        return {
            "messages": [AIMessage(content="Assessment generated.")],
            "assessment_results": assessment_data,
            "current_agent": "assessment_agent",
            "next_action": "continue"
        }
    except Exception as e:
        return {
            "errors": [f"AssessmentAgent Error: {str(e)}"],
            "next_action": "retry",
            "error_count": state.get("error_count", 0) + 1
        }
