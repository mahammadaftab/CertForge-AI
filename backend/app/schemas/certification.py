from typing import Optional
from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class CertificationBase(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = None

class CertificationCreate(CertificationBase):
    name: str
    code: str

class CertificationUpdate(CertificationBase):
    pass

class CertificationInDBBase(CertificationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Certification(CertificationInDBBase):
    pass
