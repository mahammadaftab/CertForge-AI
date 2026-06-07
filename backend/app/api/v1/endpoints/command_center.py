from typing import Any, List, Dict
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.employee import Employee
from app.models.team import Team
from app.models.certification import Certification
from app.models.readiness_score import ReadinessScore
from app.models.audit_log import AuditLog
from app.models.user import UserRole

router = APIRouter()

@router.get("/graph-data")
async def get_graph_data(current_user: Any = Depends(deps.RoleChecker([UserRole.ADMIN, UserRole.MANAGER]))):
    """
    Returns nodes and links for the D3 Knowledge Graph.
    """
    employees = await Employee.find_all(fetch_links=True).to_list()
    teams = await Team.find_all().to_list()
    certs = await Certification.find_all().to_list()
    
    nodes = []
    links = []
    
    # Teams as core hubs
    for team in teams:
        nodes.append({"id": str(team.id), "name": team.name, "type": "team", "val": 20})
        
    # Employees linked to teams
    for emp in employees:
        emp_id = str(emp.id)
        nodes.append({"id": emp_id, "name": emp.user.full_name if emp.user else "Unknown", "type": "employee", "val": 10})
        if emp.team_id:
            # Finding the team object to get ID for link
            target_team = next((t for t in teams if t.name == emp.team_id), None)
            if target_team:
                links.append({"source": emp_id, "target": str(target_team.id), "relation": "member"})

    # Certifications as targets
    for cert in certs:
        cert_id = str(cert.id)
        nodes.append({"id": cert_id, "name": cert.code, "type": "cert", "val": 15})
        # For demo, link teams to first cert
        if teams:
            links.append({"source": str(teams[0].id), "target": cert_id, "relation": "targets"})

    return {"nodes": nodes, "links": links}

@router.get("/risk-heatmap")
async def get_risk_heatmap(current_user: Any = Depends(deps.RoleChecker([UserRole.ADMIN, UserRole.MANAGER]))):
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
async def get_live_feed(current_user: Any = Depends(deps.RoleChecker([UserRole.ADMIN, UserRole.MANAGER]))):
    """
    Returns the most recent system activity logs.
    """
    logs = await AuditLog.find_all(fetch_links=True).sort("-created_at").limit(10).to_list()
    return [{
        "id": str(log.id),
        "user": log.user.full_name if log.user else "System",
        "action": log.action,
        "details": log.details,
        "time": log.created_at
    } for log in logs]

@router.get("/readiness-radar")
async def get_readiness_radar(current_user: Any = Depends(deps.RoleChecker([UserRole.ADMIN, UserRole.MANAGER]))):
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
