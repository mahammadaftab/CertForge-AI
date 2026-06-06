from typing import Any
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.user import User

class AuditLog(BaseDocument):
    user: Link[User]
    action: str
    details: Any

    class Settings:
        name = "audit_logs"
