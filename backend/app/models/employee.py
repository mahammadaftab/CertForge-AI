from typing import Optional, List
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.user import User

class Employee(BaseDocument):
    user: Link[User]
    team_id: Optional[str] = None # Reference to Team
    job_title: str

    class Settings:
        name = "employees"
