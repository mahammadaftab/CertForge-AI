from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class AssessmentBase(BaseModel):
    title: Optional[str] = None
    certification_id: Optional[UUID] = None
    questions: Optional[List[Any]] = None

class AssessmentCreate(AssessmentBase):
    title: str
    certification_id: UUID

class AssessmentUpdate(AssessmentBase):
    pass

class AssessmentInDBBase(AssessmentBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Assessment(AssessmentInDBBase):
    pass
