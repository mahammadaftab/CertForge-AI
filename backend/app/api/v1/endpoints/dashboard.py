from typing import Any
from fastapi import APIRouter, Depends
from app.api import deps
from app.services.intelligence.analytics import analytics_service

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(
    current_user: Any = Depends(deps.get_current_active_user),
    _: None = Depends(deps.require_db)
):
    """
    Returns real aggregate metrics for the Mission Control dashboard.
    """
    return await analytics_service.get_dashboard_stats()

@router.get("/telemetry")
async def get_telemetry(
    current_user: Any = Depends(deps.get_current_active_user),
    _: None = Depends(deps.require_db)
):
    """
    Returns real workload telemetry data.
    """
    return await analytics_service.get_workload_telemetry()

@router.get("/progression")
async def get_progression(
    current_user: Any = Depends(deps.get_current_active_user),
    _: None = Depends(deps.require_db)
):
    """
    Returns unit progression metrics.
    """
    return await analytics_service.get_unit_progression()
