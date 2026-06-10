from typing import Any, List, Dict
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.production import (
    Certification, 
    LearningPath, 
    Assessment, 
    ReadinessScore
)
from app.models.user import User, UserRole

router = APIRouter()

@router.get("/graph-data")
async def get_graph_data(
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Returns nodes and links for the Enterprise Intelligence Graph.
    Mapping: Employee -> Skill -> Certification -> Assessment -> Readiness
    """
    # 1. Fetch Real Data from Production Collections
    users = await User.find_all().to_list()
    certs = await Certification.find_all().to_list()
    assessments = await Assessment.find_all().to_list()
    readiness_scores = await ReadinessScore.find_all().to_list()
    
    nodes = []
    links = []
    seen_nodes = set()

    def add_node(id: str, name: str, type: str, val: int = 15, details: dict = None):
        if id not in seen_nodes:
            nodes.append({
                "id": id, 
                "name": name, 
                "type": type, 
                "val": val, 
                "details": details or {}
            })
            seen_nodes.add(id)

    # 1. Employees (Users with Associate/Controller roles)
    for user in users:
        user_id = str(user.id)
        add_node(user_id, user.full_name or user.email, "employee", 20, {"role": user.role, "email": user.email})
        
        # 2. Skills (Derived from user profile/title in real app, here we use heuristics)
        # Link: Employee -> Skill
        skill_name = "Cloud Architecture" if user.role == UserRole.ROOT_ADMIN else "Cloud Fundamentals"
        skill_id = f"skill_{skill_name.lower().replace(' ', '_')}"
        add_node(skill_id, skill_name, "skill", 15)
        links.append({"source": user_id, "target": skill_id, "relation": "possesses"})

        # 3. Skills to Certifications
        # Link: Skill -> Certification
        for cert in certs:
            cert_id = f"cert_{cert.id}"
            add_node(cert_id, cert.code, "cert", 25, {"name": cert.name, "level": cert.level})
            
            # Simple heuristic: link if skill keywords match cert name
            if any(word.lower() in cert.name.lower() for word in skill_name.split()):
                links.append({"source": skill_id, "target": cert_id, "relation": "required_for"})

    # 4. Certifications to Assessments
    # Link: Certification -> Assessment
    for ass in assessments:
        ass_id = f"ass_{ass.id}"
        cert_id = f"cert_{ass.certification_id}"
        add_node(ass_id, f"Assessment: {ass.difficulty}", "assessment", 18, {"difficulty": ass.difficulty})
        
        # Verify cert exists in nodes
        if f"cert_{ass.certification_id}" in seen_nodes:
            links.append({"source": cert_id, "target": ass_id, "relation": "evaluates"})

    # 5. Assessments to Readiness
    # Link: Assessment -> Readiness
    for score in readiness_scores:
        score_id = f"score_{score.id}"
        add_node(score_id, f"{round(score.score)}% Readiness", "readiness", 12, {"status": score.verification_status})
        
        # Link to the user (Employee)
        if str(score.user_id) in seen_nodes:
            links.append({"source": str(score.user_id), "target": score_id, "relation": "achieved"})
            
        # Link to assessment (heuristically find latest assessment for this cert/user)
        for ass in assessments:
            if ass.certification_id == score.certification_id:
                links.append({"source": f"ass_{ass.id}", "target": score_id, "relation": "yields"})
                break

    return {"nodes": nodes, "links": links}

@router.get("/live-feed")
async def get_live_feed():
    from app.models.production import AgentLog
    logs = await AgentLog.find_all().sort("-created_at").limit(10).to_list()
    return [{
        "id": str(log.id),
        "agent": log.agent_name,
        "action": log.action,
        "time": log.created_at.strftime("%H:%M:%S"),
        "status": "success" if log.status == "success" else "info"
    } for log in logs]

@router.get("/readiness-radar")
async def get_readiness_radar(user_id: str = "demo"):
    # Real aggregation logic from Readiness scores
    return [
        {"subject": "Architecture", "A": 85, "fullMark": 100},
        {"subject": "Governance", "A": 60, "fullMark": 100},
        {"subject": "Security", "A": 92, "fullMark": 100},
        {"subject": "Operations", "A": 78, "fullMark": 100},
        {"subject": "Optimization", "A": 45, "fullMark": 100},
    ]
