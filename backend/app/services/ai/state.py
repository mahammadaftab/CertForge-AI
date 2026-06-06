from typing import TypedDict, Annotated, Sequence, Any, Dict, List
import operator
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    """
    Represents the state of the LangGraph Multi-Agent system.
    Using Annotated with operator.add for messages ensures we append to the list rather than overwrite.
    """
    messages: Annotated[Sequence[BaseMessage], operator.add]
    employee_id: str
    certification_target: str
    
    # Context Data
    employee_skills: List[str]
    target_certification_details: Dict[str, Any]
    
    # Generated Outputs
    learning_path: Dict[str, Any]
    study_plan: Dict[str, Any]
    workload_status: str
    assessment_results: List[Dict[str, Any]]
    readiness_score: float
    manager_insights: Dict[str, Any]
    verification_status: str
    
    # Orchestration routing
    current_agent: str
    next_action: str
    error_count: int
    errors: Annotated[List[str], operator.add]
