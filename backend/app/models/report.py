from typing import Dict, Any, Optional
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.user import User

class Report(BaseDocument):
    title: str
    type: str # e.g., "READINESS", "RISK", "WORKLOAD"
    generated_by: Link[User]
    data: Dict[str, Any]
    summary: str
    
    class Settings:
        name = "reports"
