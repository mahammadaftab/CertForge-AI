from typing import Optional
from beanie import Link
from app.db.base_class import BaseDocument
from app.models.user import User

class Manager(BaseDocument):
    user: Link[User]
    department: str

    class Settings:
        name = "managers"
