from typing import Dict, Any, List
import logging
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class WorkloadMetrics(BaseModel):
    meeting_hours: float
    focus_hours: float
    workload_percent: float # 0-100
    team_capacity_percent: float # 0-100

class WorkIQService:
    """
    Analyzes workforce productivity data to detect burnout and optimize study windows.
    """
    def analyze_capacity(self, metrics: WorkloadMetrics) -> Dict[str, Any]:
        """
        Calculates burnout risk and capacity analysis.
        """
        # Logic: Burnout risk increases if meetings > 5 and focus < 2 or workload > 85%
        burnout_risk = "Low"
        if metrics.workload_percent > 85 or (metrics.meeting_hours > 6 and metrics.focus_hours < 2):
            burnout_risk = "High"
        elif metrics.workload_percent > 70 or metrics.meeting_hours > 4:
            burnout_risk = "Medium"

        # Capacity Analysis
        available_bandwidth = 100 - metrics.workload_percent
        
        return {
            "burnout_risk": burnout_risk,
            "available_bandwidth_percent": available_bandwidth,
            "status": "Healthy" if burnout_risk == "Low" else "At Risk",
            "is_overloaded": metrics.workload_percent > 90
        }

    def predict_best_study_time(self, metrics: WorkloadMetrics) -> Dict[str, Any]:
        """
        Predicts optimal study slots based on focus hours and meeting load.
        """
        # Simulating AI logic for time-slot recommendation
        if metrics.meeting_hours < 3:
            recommendation = "Morning Deep Work (09:00 - 11:00)"
        elif metrics.focus_hours > 4:
            recommendation = "Afternoon Flow (14:00 - 16:00)"
        else:
            recommendation = "Micro-learning Slots (15min bursts)"

        return {
            "recommended_slot": recommendation,
            "optimal_duration_mins": 60 if metrics.workload_percent < 70 else 30,
            "focus_score": (metrics.focus_hours / 8) * 100
        }

work_iq = WorkIQService()
