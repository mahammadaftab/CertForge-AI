from typing import Optional
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class NotificationBase(BaseModel):
    user_id: Optional[UUID] = None
    title: Optional[str] = None
    message: Optional[str] = None
    is_read: Optional[bool] = False

class NotificationCreate(NotificationBase):
    user_id: UUID
    title: str
    message: str

class NotificationUpdate(NotificationBase):
    pass

class NotificationInDBBase(NotificationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Notification(NotificationInDBBase):
    pass
