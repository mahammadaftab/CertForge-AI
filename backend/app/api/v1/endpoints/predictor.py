from typing import Any, Optional
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from app.api import deps
from app.services.ai.agents.prediction_agent import prediction_agent
from app.models.production import Prediction

router = APIRouter()

class PredictionRequest(BaseModel):
    certification_id: str

@router.post("/execute")
async def execute_prediction(
    req: PredictionRequest,
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Triggers the Prediction Agent to generate a high-fidelity success forecast.
    """
    return await prediction_agent.execute_forecast(str(current_user.id), req.certification_id)

@router.get("/latest")
async def get_latest_prediction(
    certification_id: str = Query(...),
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Retrieves the most recent success forecast for a specific user and certification.
    """
    prediction = await Prediction.find(
        Prediction.user_id == str(current_user.id),
        Prediction.certification_target == certification_id
    ).sort("-created_at").limit(1).to_list()
    
    return prediction[0] if prediction else None

@router.post("/predict")
async def predict_legacy(
    data: dict,
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Legacy endpoint redirecting to the high-fidelity agent.
    """
    return await prediction_agent.execute_forecast(str(current_user.id), data.get("certification_id", "demo-az-900"))
