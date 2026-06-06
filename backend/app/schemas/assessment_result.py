from typing import Optional, Any
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class AssessmentResultBase(BaseModel):
    employee_id: Optional[UUID] = None
    assessment_id: Optional[UUID] = None
    score: Optional[float] = None
    answers: Optional[Any] = None

class AssessmentResultCreate(AssessmentResultBase):
    employee_id: UUID
    assessment_id: UUID
    score: float

class AssessmentResultUpdate(AssessmentResultBase):
    pass

class AssessmentResultInDBBase(AssessmentResultBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AssessmentResult(AssessmentResultInDBBase):
    pass
