from typing import Any, Optional
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.user import User

class AuditLog(BaseDocument):
    user: Optional[Link[User]] = None
    action: str
    details: Any

    class Settings:
        name = "audit_logs"
