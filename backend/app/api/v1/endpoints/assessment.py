from typing import Any, List, Dict
from fastapi import APIRouter, Depends, Query
from app.api import deps
from app.services.intelligence.assessment_engine import assessment_engine

router = APIRouter()

@router.get("/generate")
async def generate_assessment(
    certification: str = Query(..., example="AZ-900"),
    difficulty: str = Query("Intermediate", example="Intermediate"),
    count: int = Query(5, ge=1, le=10),
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Generates a mixed assessment (MCQs + Scenarios) using AI.
    """
    mcqs = await assessment_engine.generate_mcqs(certification, difficulty, count)
    scenario = await assessment_engine.generate_scenario(certification)
    
    return {
        "certification": certification,
        "difficulty": difficulty,
        "questions": mcqs,
        "capstone_scenario": scenario
    }

@router.post("/evaluate")
async def evaluate_assessment(
    certification: str,
    submissions: List[Dict[str, Any]],
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Evaluates submitted answers and returns a grounded readiness report.
    """
    return await assessment_engine.evaluate_performance(certification, submissions)
