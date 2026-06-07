from typing import Any, List
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.employee import Employee
from app.models.readiness_score import ReadinessScore
from app.models.user import UserRole

router = APIRouter()

@router.get("/")
async def list_employees(current_user: Any = Depends(deps.RoleChecker([UserRole.ADMIN, UserRole.MANAGER]))):
    """
    Retrieves all employees from MongoDB, including linked user data and real scores.
    """
    employees = await Employee.find_all(fetch_links=True).to_list()
    
    # Pre-fetch all readiness scores to avoid N+1 queries in a real app
    # For the hackathon, we'll fetch them individually or use a simple join
    
    formatted = []
    for emp in employees:
        # Fetch the most recent readiness score
        score_doc = await ReadinessScore.find_one(ReadinessScore.employee.id == emp.id)
        score = score_doc.score if score_doc else 0
        
        # Determine status based on score
        status = "Ready" if score > 85 else "Learning" if score > 60 else "Assessment"
        
        formatted.append({
            "id": str(emp.id),
            "name": emp.user.full_name if emp.user else "Unknown",
            "role": emp.job_title,
            "team": emp.team_id or "Unassigned",
            "status": status,
            "score": score,
            "tags": ["Verified", "Synched"]
        })
    return formatted
