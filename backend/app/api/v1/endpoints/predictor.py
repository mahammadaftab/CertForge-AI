from typing import Any
from fastapi import APIRouter, Depends
from app.api import deps
from app.services.intelligence.predictor import predictor, PredictionInput

router = APIRouter()

@router.post("/predict")
def predict_success(
    data: PredictionInput,
    current_user: Any = Depends(deps.get_current_active_user)
):
    """
    Predicts certification success using ML models.
    """
    return predictor.predict(data)
