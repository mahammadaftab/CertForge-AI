from typing import Any, List, Dict
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.employee import Employee
from app.models.team import Team
from app.models.certification import Certification
from app.models.readiness_score import ReadinessScore
from app.models.assessment import Assessment
from app.models.audit_log import AuditLog
from app.models.user import UserRole

router = APIRouter()

@router.get("/graph-data")
async def get_graph_data(
    current_user: Any = Depends(deps.get_current_active_user),
    _: None = Depends(deps.require_db)
):
    """
    Returns nodes and links for the D3 Knowledge Graph (Enterprise AI OS Mapping).
    """
    # Fetch real data from database
    employees = await Employee.find_all(fetch_links=True).to_list()
    teams = await Team.find_all().to_list()
    certs = await Certification.find_all().to_list()
    assessments = await Assessment.find_all(fetch_links=True).to_list()
    readiness_scores = await ReadinessScore.find_all(fetch_links=True).to_list()
    
    nodes = []
    links = []
    seen_nodes = set()

    def add_node(id, name, type, val=10, details=None):
        if id not in seen_nodes:
            nodes.append({"id": id, "name": name, "type": type, "val": val, "details": details or {}})
            seen_nodes.add(id)

    # 1. Teams
    for team in teams:
        team_id = f"team_{team.id}"
        add_node(team_id, team.name, "team", 25, {"department": team.department})

    # 2. Employees & Skills
    for emp in employees:
        emp_id = f"emp_{emp.id}"
        full_name = emp.user.full_name if emp.user else "Unknown"
        add_node(emp_id, full_name, "employee", 15, {"title": emp.job_title, "team": emp.team_id})
        
        # Skill as a node (derived from job title)
        skill_id = f"skill_{emp.job_title.lower().replace(' ', '_')}"
        add_node(skill_id, emp.job_title, "skill", 12)
        links.append({"source": emp_id, "target": skill_id, "relation": "possesses"})

    # 3. Skills to Certifications
    # Heuristic: link skills to certs based on keywords
    for cert in certs:
        cert_id = f"cert_{cert.id}"
        add_node(cert_id, cert.code, "cert", 20, {"provider": cert.provider, "level": cert.level, "name": cert.name})
        
        # Link skills to certs
        for emp in employees:
            skill_id = f"skill_{emp.job_title.lower().replace(' ', '_')}"
            if cert.provider.lower() in emp.job_title.lower() or cert.name.split()[0].lower() in emp.job_title.lower():
                links.append({"source": skill_id, "target": cert_id, "relation": "required_for"})

    # 4. Certifications to Assessments
    for ass in assessments:
        ass_id = f"ass_{ass.id}"
        cert_id = f"cert_{ass.certification.id}" if ass.certification else None
        add_node(ass_id, ass.title, "assessment", 10)
        if cert_id:
            links.append({"source": cert_id, "target": ass_id, "relation": "evaluated_by"})

    # 5. Assessments to Readiness Scores, Readiness to Teams
    for score in readiness_scores:
        score_id = f"score_{score.id}"
        emp_id = f"emp_{score.employee.id}" if score.employee else None
        
        # Find the team for this employee to link Readiness -> Team
        team_id = None
        if score.employee and score.employee.team_id:
            # Map employee's team_id to the team node
            for t in teams:
                if t.name == score.employee.team_id or str(t.id) == score.employee.team_id:
                    team_id = f"team_{t.id}"
                    break
        elif teams:
             team_id = f"team_{teams[0].id}" # Fallback
             
        add_node(score_id, f"{score.score}% Readiness", "readiness", 8, {"score": score.score})
        
        # Finding assessment for this cert to link (Assessment -> Readiness)
        for ass in assessments:
            if ass.certification and score.certification and ass.certification.id == score.certification.id:
                links.append({"source": f"ass_{ass.id}", "target": score_id, "relation": "yields"})
                break
                
        # Link Readiness -> Team
        if team_id:
            links.append({"source": score_id, "target": team_id, "relation": "impacts_team"})

    return {"nodes": nodes, "links": links}

@router.get("/risk-heatmap")
async def get_risk_heatmap(
    current_user: Any = Depends(deps.get_current_active_user),
    _: None = Depends(deps.require_db)
):
    """
    Returns data for the Team Risk Heatmap.
    """
    return [
        {"team": "Cloud Ops", "domain": "Compute", "risk": 12},
        {"team": "Cloud Ops", "domain": "Security", "risk": 45},
        {"team": "AI/ML Core", "domain": "Data", "risk": 8},
        {"team": "AI/ML Core", "domain": "Logic", "risk": 22},
        {"team": "Infrastructure", "domain": "Network", "risk": 90},
    ]

@router.get("/live-feed")
async def get_live_feed(_: None = Depends(deps.require_db)):
    """
    Returns the most recent system activity logs.
    """
    logs = await AuditLog.find_all(fetch_links=True).sort("-created_at").limit(10).to_list()
    return [{
        "id": str(log.id),
        "user": getattr(log.user, "full_name", "Unknown User") if log.user else "System",
        "action": log.action,
        "details": log.details,
        "time": log.created_at
    } for log in logs]

@router.get("/readiness-radar")
async def get_readiness_radar(
    current_user: Any = Depends(deps.get_current_active_user),
    _: None = Depends(deps.require_db)
):
    """
    Aggregates readiness across multiple dimensions.
    """
    return [
        {"subject": "Architecture", "A": 85, "fullMark": 100},
        {"subject": "Governance", "A": 60, "fullMark": 100},
        {"subject": "Security", "A": 92, "fullMark": 100},
        {"subject": "Operations", "A": 78, "fullMark": 100},
        {"subject": "Optimization", "A": 45, "fullMark": 100},
    ]
