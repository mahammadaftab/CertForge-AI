from typing import Any
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.user import UserRole
from app.models.certification import Certification

router = APIRouter()

@router.get("/semantic-graph")
async def get_semantic_graph(current_user: Any = Depends(deps.RoleChecker([UserRole.ADMIN, UserRole.MANAGER]))):
    """
    Returns the semantic relationship between skills, certifications, and readiness models.
    """
    certs = await Certification.find_all().to_list()
    
    nodes = []
    links = []
    
    # Core Ontology Node
    nodes.append({"id": "core", "name": "Fabric Ontology", "type": "root", "val": 30})
    
    # Mock Skill Nodes (since we don't have a direct Skill model, we infer from certs)
    skills = ["Python", "Azure", "Security", "Machine Learning", "DevOps"]
    for skill in skills:
        nodes.append({"id": f"skill_{skill}", "name": skill, "type": "skill", "val": 15})
        links.append({"source": "core", "target": f"skill_{skill}", "value": 2})
        
    for cert in certs:
        nodes.append({"id": str(cert.id), "name": cert.code, "type": "cert", "val": 20})
        # Link cert to a random skill for semantic mapping
        if skills:
            links.append({"source": f"skill_{skills[hash(cert.code) % len(skills)]}", "target": str(cert.id), "value": 5})

    return {"nodes": nodes, "links": links}
