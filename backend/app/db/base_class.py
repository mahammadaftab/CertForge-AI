from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field
import uuid

class BaseDocument(Document):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_deleted: bool = False

    class Settings:
        use_revision = True
