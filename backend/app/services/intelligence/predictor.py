import pandas as pd
import numpy as np
import logging
import joblib
import os
from typing import Dict, Any, List
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class PredictionInput(BaseModel):
    study_hours: float
    avg_assessment_score: float # 0-100
    skill_coverage_percent: float # 0-100
    team_readiness_avg: float # 0-100

class SuccessPredictor:
    """
    Advanced ML-based Certification Success Predictor with Model Persistence.
    """
    def __init__(self, model_dir: str = "app/ml_models"):
        self.model_dir = model_dir
        self.model_path = os.path.join(model_dir, "success_model.joblib")
        self.scaler_path = os.path.join(model_dir, "scaler.joblib")
        
        self.model = LogisticRegression()
        self.scaler = StandardScaler()
        self._is_trained = False
        
        self._load_or_train()

    def _load_or_train(self):
        """
        Attempts to load a persisted model, otherwise trains a fresh one.
        """
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            try:
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                self._is_trained = True
                logger.info("Loaded persisted ML model from disk.")
                return
            except Exception as e:
                logger.warning(f"Failed to load model: {e}. Retraining...")

        self._initialize_synthetic_model()

    def _initialize_synthetic_model(self):
        """
        Trains model using synthetic workforce data.
        """
        data = {
            'study_hours': [10, 50, 20, 80, 5, 100, 30, 60, 15, 70, 45, 90, 12, 55],
            'assessment_score': [60, 85, 55, 90, 40, 95, 70, 80, 50, 88, 78, 92, 45, 82],
            'skill_coverage': [50, 80, 40, 95, 20, 100, 60, 85, 35, 90, 75, 98, 30, 80],
            'team_metrics': [70, 75, 65, 80, 60, 90, 70, 78, 62, 85, 72, 88, 58, 80],
            'result': [0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1]
        }
        df = pd.DataFrame(data)
        X = df[['study_hours', 'assessment_score', 'skill_coverage', 'team_metrics']]
        y = df['result']
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self._is_trained = True
        
        # Persist
        os.makedirs(self.model_dir, exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        logger.info("Success Predictor ML model initialized and persisted.")

    def predict(self, input_data: PredictionInput) -> Dict[str, Any]:
        """
        Generates success prediction with pass probability and risk analysis.
        """
        if not self._is_trained:
            return {"error": "Model not available"}

        features = np.array([[
            input_data.study_hours,
            input_data.avg_assessment_score,
            input_data.skill_coverage_percent,
            input_data.team_readiness_avg
        ]])
        
        features_scaled = self.scaler.transform(features)
        pass_prob = self.model.predict_proba(features_scaled)[0][1]
        
        # Heuristic calculations for detailed metrics
        readiness = (
            (input_data.avg_assessment_score * 0.4) + 
            (input_data.skill_coverage_percent * 0.4) + 
            (min(input_data.study_hours / 50, 1.0) * 20)
        )
        
        risk = max(0, 100 - (pass_prob * 100))
        
        return {
            "readiness_score": round(readiness, 2),
            "pass_probability": round(pass_prob * 100, 2),
            "risk_score": round(risk, 2),
            "dimensions": {
                "Knowledge": input_data.avg_assessment_score,
                "Skills": input_data.skill_coverage_percent,
                "Dedication": min(input_data.study_hours * 2, 100),
                "Support": input_data.team_readiness_avg
            },
            "recommendation": self._get_recommendation(pass_prob, input_data)
        }

    def _get_recommendation(self, prob: float, data: PredictionInput) -> str:
        if prob > 0.90: return "Optimal Readiness: Schedule exam immediately."
        if prob > 0.75: return "High Readiness: Review niche edge cases."
        if prob > 0.50: return "Moderate Risk: Increase simulation practice."
        return "Critical Risk: Intensive learning path required."

# Singleton instance
predictor = SuccessPredictor()
