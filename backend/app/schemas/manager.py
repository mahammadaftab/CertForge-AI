from typing import Optional
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class ManagerBase(BaseModel):
    user_id: Optional[UUID] = None
    department: Optional[str] = None

class ManagerCreate(ManagerBase):
    user_id: UUID
    department: str

class ManagerUpdate(ManagerBase):
    pass

class ManagerInDBBase(ManagerBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Manager(ManagerInDBBase):
    pass
