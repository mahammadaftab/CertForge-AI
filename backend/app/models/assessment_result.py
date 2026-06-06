from typing import Any
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.employee import Employee
from app.models.assessment import Assessment

class AssessmentResult(BaseDocument):
    employee: Link[Employee]
    assessment: Link[Assessment]
    score: float
    answers: Any

    class Settings:
        name = "assessment_results"
