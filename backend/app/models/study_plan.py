from datetime import datetime
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.employee import Employee
from app.models.learning_path import LearningPath

class StudyPlan(BaseDocument):
    employee: Link[Employee]
    learning_path: Link[LearningPath]
    start_date: datetime
    target_date: datetime
    status: str = "in_progress"

    class Settings:
        name = "study_plans"
