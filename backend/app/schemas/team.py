from typing import Optional
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class TeamBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    manager_id: Optional[UUID] = None

class TeamCreate(TeamBase):
    name: str

class TeamUpdate(TeamBase):
    pass

class TeamInDBBase(TeamBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Team(TeamInDBBase):
    pass
