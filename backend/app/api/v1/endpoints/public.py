from typing import Any
from fastapi import APIRouter
from app.services.intelligence.analytics import analytics_service

router = APIRouter()

@router.get("/landing-stats")
async def get_landing_stats() -> Any:
    """
    Public endpoint for the landing page to display live system metrics.
    """
    stats = await analytics_service.get_dashboard_stats()
    return stats
