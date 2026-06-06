from typing import Optional
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class StudyPlanBase(BaseModel):
    employee_id: Optional[UUID] = None
    learning_path_id: Optional[UUID] = None
    start_date: Optional[datetime] = None
    target_date: Optional[datetime] = None
    status: Optional[str] = "in_progress"

class StudyPlanCreate(StudyPlanBase):
    employee_id: UUID
    learning_path_id: UUID

class StudyPlanUpdate(StudyPlanBase):
    pass

class StudyPlanInDBBase(StudyPlanBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class StudyPlan(StudyPlanInDBBase):
    pass
