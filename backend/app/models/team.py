from typing import Optional, List
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.manager import Manager

class Team(BaseDocument):
    name: str
    description: Optional[str] = None
    manager: Link[Manager]

    class Settings:
        name = "teams"
        indexes = ["name"]
