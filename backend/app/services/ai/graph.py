from langgraph.graph import StateGraph, END
from app.services.ai.state import AgentState

# Import Agents
from app.services.ai.agents.learning import learning_path_agent
from app.services.ai.agents.study import study_plan_agent
from app.services.ai.agents.workload import workload_agent
from app.services.ai.agents.assessment import assessment_agent
from app.services.ai.agents.readiness import readiness_agent
from app.services.ai.agents.insights import insights_agent
from app.services.ai.agents.verification import verification_agent

# Define Retry & Error Handling Router
def route_after_agent(state: AgentState) -> str:
    """
    Dynamic routing based on agent's reported next_action or error thresholds.
    """
    if state.get("error_count", 0) >= 3:
        print("--- MAX RETRIES REACHED. ENDING GRAPH. ---")
        return "end"
    
    if state.get("next_action") == "retry":
        print(f"--- RETRYING {state.get('current_agent')} ---")
        return state.get("current_agent")
    
    # Normal flow progression
    current = state.get("current_agent")
    flow_map = {
        "learning_path_agent": "study_plan_agent",
        "study_plan_agent": "workload_agent",
        "workload_agent": "assessment_agent",
        "assessment_agent": "readiness_agent",
        "readiness_agent": "insights_agent",
        "insights_agent": "verification_agent",
        "verification_agent": "end"
    }
    
    return flow_map.get(current, "end")

def create_orchestrator():
    """
    Compiles the Multi-Agent StateGraph.
    """
    workflow = StateGraph(AgentState)

    # Add Nodes (Agents)
    workflow.add_node("learning_path_agent", learning_path_agent)
    workflow.add_node("study_plan_agent", study_plan_agent)
    workflow.add_node("workload_agent", workload_agent)
    workflow.add_node("assessment_agent", assessment_agent)
    workflow.add_node("readiness_agent", readiness_agent)
    workflow.add_node("insights_agent", insights_agent)
    workflow.add_node("verification_agent", verification_agent)

    # Entry Point
    workflow.set_entry_point("learning_path_agent")

    # Conditional Edges for Dynamic Routing & Retry Logic
    workflow.add_conditional_edges("learning_path_agent", route_after_agent, {
        "study_plan_agent": "study_plan_agent",
        "learning_path_agent": "learning_path_agent",
        "end": END
    })
    
    workflow.add_conditional_edges("study_plan_agent", route_after_agent, {
        "workload_agent": "workload_agent",
        "study_plan_agent": "study_plan_agent",
        "end": END
    })
    
    workflow.add_conditional_edges("workload_agent", route_after_agent, {
        "assessment_agent": "assessment_agent",
        "workload_agent": "workload_agent",
        "end": END
    })
    
    workflow.add_conditional_edges("assessment_agent", route_after_agent, {
        "readiness_agent": "readiness_agent",
        "assessment_agent": "assessment_agent",
        "end": END
    })
    
    workflow.add_conditional_edges("readiness_agent", route_after_agent, {
        "insights_agent": "insights_agent",
        "readiness_agent": "readiness_agent",
        "end": END
    })
    
    workflow.add_conditional_edges("insights_agent", route_after_agent, {
        "verification_agent": "verification_agent",
        "insights_agent": "insights_agent",
        "end": END
    })
    
    workflow.add_conditional_edges("verification_agent", route_after_agent, {
        "verification_agent": "verification_agent",
        "end": END
    })

    # Compile the graph
    app = workflow.compile()
    return app

# Singleton instance
orchestrator = create_orchestrator()
