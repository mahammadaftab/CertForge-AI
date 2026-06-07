from typing import Any, List
from fastapi import APIRouter, Depends
from app.api import deps
from app.models.report import Report

router = APIRouter()

@router.get("/")
async def list_reports(current_user: Any = Depends(deps.get_current_active_user)):
    """
    Retrieves all reports.
    """
    reports = await Report.find_all(fetch_links=True).to_list()
    return reports

@router.post("/")
async def generate_report(title: str, r_type: str, current_user: Any = Depends(deps.get_current_active_user)):
    """
    Generates a new intelligence report.
    """
    report = Report(
        title=title,
        type=r_type,
        generated_by=current_user,
        data={"metrics": "real-time-sync"},
        summary="Automated intelligence cycle completed."
    )
    await report.insert()
    return report
