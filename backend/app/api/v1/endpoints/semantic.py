from typing import Any, List, Dict
from fastapi import APIRouter, Depends
from app.api import deps
from app.services.intelligence.fabric_iq import fabric_iq, EntityType, RelationType

router = APIRouter()

@router.get("/team-readiness/{team_id}")
def get_team_readiness(team_id: str, current_user: Any = Depends(deps.get_current_active_user)):
    """
    Exposes semantic readiness metrics for a specific team.
    """
    return fabric_iq.get_team_readiness(team_id)

@router.get("/workforce-risks")
def get_workforce_risks(current_user: Any = Depends(deps.get_current_active_user)):
    """
    Detects organizational risks based on the knowledge graph.
    """
    return fabric_iq.identify_workforce_risks()

@router.post("/sync-ontology")
def sync_ontology(entities: List[Dict], relationships: List[Dict], current_user: Any = Depends(deps.get_current_active_user)):
    """
    Admin endpoint to batch-sync the semantic graph.
    """
    for ent in entities:
        fabric_iq.add_entity(ent["id"], ent["type"], ent.get("props"))
    for rel in relationships:
        fabric_iq.add_relationship(rel["source"], rel["target"], rel["relation"])
    return {"status": "success", "graph_nodes": len(fabric_iq.graph.nodes)}
