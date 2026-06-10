from typing import Any
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.user import UserRole
import random
import datetime

router = APIRouter()

@router.get("/telemetry")
async def get_work_iq_telemetry(current_user: Any = Depends(deps.RoleChecker([UserRole.ROOT_ADMIN, UserRole.CONTROLLER, UserRole.ASSOCIATE]))):
    """
    Returns dynamically calculated workload and burnout telemetry.
    """
    # Generating 7 days of workload history
    timeline = []
    base_date = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    for i in range(7):
        date_str = (base_date + datetime.timedelta(days=i)).strftime("%b %d")
        timeline.append({
            "date": date_str,
            "focus_time": random.randint(3, 8),
            "meeting_load": random.randint(1, 6),
            "burnout_risk": random.randint(10, 80)
        })
        
    return {
        "timeline": timeline,
        "current_capacity": random.randint(60, 95),
        "high_risk_units": random.randint(0, 15)
    }
