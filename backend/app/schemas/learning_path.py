from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class LearningPathBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    certification_id: Optional[UUID] = None
    modules: Optional[List[Any]] = None

class LearningPathCreate(LearningPathBase):
    name: str
    certification_id: UUID

class LearningPathUpdate(LearningPathBase):
    pass

class LearningPathInDBBase(LearningPathBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class LearningPath(LearningPathInDBBase):
    pass
