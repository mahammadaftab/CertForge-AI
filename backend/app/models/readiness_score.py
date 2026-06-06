from typing import Optional
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.employee import Employee
from app.models.certification import Certification

class ReadinessScore(BaseDocument):
    employee: Link[Employee]
    certification: Link[Certification]
    score: float
    ai_feedback: Optional[str] = None

    class Settings:
        name = "readiness_scores"
