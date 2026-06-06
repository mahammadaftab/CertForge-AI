from typing import Optional, Any
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class AuditLogBase(BaseModel):
    user_id: Optional[UUID] = None
    action: Optional[str] = None
    details: Optional[Any] = None

class AuditLogCreate(AuditLogBase):
    user_id: UUID
    action: str

class AuditLogInDBBase(AuditLogBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AuditLog(AuditLogInDBBase):
    pass
