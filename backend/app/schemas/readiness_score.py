from typing import Optional
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class ReadinessScoreBase(BaseModel):
    employee_id: Optional[UUID] = None
    certification_id: Optional[UUID] = None
    score: Optional[float] = None
    ai_feedback: Optional[str] = None

class ReadinessScoreCreate(ReadinessScoreBase):
    employee_id: UUID
    certification_id: UUID
    score: float

class ReadinessScoreUpdate(ReadinessScoreBase):
    pass

class ReadinessScoreInDBBase(ReadinessScoreBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ReadinessScore(ReadinessScoreInDBBase):
    pass
