from typing import Any, List, Dict
from fastapi import APIRouter, Depends, Query, HTTPException
from pydantic import BaseModel
from app.api import deps
from app.services.ai.agents.assessment_agent import assessment_agent
from app.models.production import Assessment, AssessmentResult

router = APIRouter()

class SubmissionIn(BaseModel):
    assessment_id: str
    submissions: List[dict]

@router.post("/start")
async def start_assessment(
    certification_id: str = Query(..., examples=["AZ-900"]),
    difficulty: str = Query("Adaptive", examples=["Adaptive"]),
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Initializes a new AI-generated assessment session.
    """
    return await assessment_agent.generate_assessment(certification_id, difficulty)

@router.post("/submit")
async def submit_assessment(
    submission: SubmissionIn,
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Submits assessment responses for evaluation and triggers the Readiness Agent.
    """
    return await assessment_agent.evaluate_submission(
        str(current_user.id), 
        submission.assessment_id, 
        submission.submissions
    )

@router.get("/generate")
async def generate_legacy(
    certification: str = Query(..., examples=["AZ-900"]),
    difficulty: str = Query("Intermediate", examples=["Intermediate"]),
    count: int = Query(5, ge=1, le=10),
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Legacy generation endpoint.
    """
    return await assessment_agent.generate_assessment(certification, difficulty)
