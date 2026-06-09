from langchain_core.messages import SystemMessage, AIMessage
from app.services.ai.state import AgentState
from app.services.ai.config import llm
from app.models.audit_log import AuditLog
import json

async def assessment_agent(state: AgentState) -> dict:
    """
    Generates dynamic assessment questions based on the learning path.
    """
    print("--- ASSESSMENT AGENT ---")
    
    await AuditLog(
        action="AGENT_ASSESSMENT_START", 
        details={"agent": "Assessment Agent"}
    ).insert()
    
    system_prompt = f"""You are a Certification Examiner for {state.get('certification_target')}.
Generate 3 multiple-choice questions to test the candidate's current knowledge baseline.
Return ONLY a JSON array of objects with keys 'q' (question), 'options' (array), and 'a' (answer)."""

    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    
    try:
        response = await llm.ainvoke(messages)
        # Parse JSON
        try:
            content = response.content.strip().strip('```json').strip('```')
            assessment_data = json.loads(content)
        except Exception:
            assessment_data = [{"q": "Fallback Question", "options": ["A", "B"], "a": "A"}]
        
        await AuditLog(
            action="AGENT_ASSESSMENT_SUCCESS", 
            details={"agent": "Assessment Agent", "questions_generated": len(assessment_data)}
        ).insert()

        return {
            "messages": [AIMessage(content="Assessment generated.")],
            "assessment_results": assessment_data,
            "current_agent": "assessment_agent",
            "next_action": "continue"
        }
    except Exception as e:
        await AuditLog(
            action="AGENT_ASSESSMENT_ERROR", 
            details={"agent": "Assessment Agent", "error": str(e)}
        ).insert()
        return {
            "errors": [f"AssessmentAgent Error: {str(e)}"],
            "next_action": "retry",
            "error_count": state.get("error_count", 0) + 1
        }
