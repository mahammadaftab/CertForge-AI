from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class EmployeeBase(BaseModel):
    user_id: Optional[UUID] = None
    team_id: Optional[UUID] = None
    job_title: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    user_id: UUID
    job_title: str

class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeInDBBase(EmployeeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Employee(EmployeeInDBBase):
    pass
