from typing import Optional
from pydantic import EmailStr
from app.db.base_class import BaseDocument
import enum

class UserRole(str, enum.Enum):
    ROOT_ADMIN = "root_admin"
    CONTROLLER = "controller"
    ASSOCIATE = "associate"
    EMPLOYEE = "employee"  # Legacy support

class User(BaseDocument):
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.ASSOCIATE
    is_active: bool = True

    class Settings:
        name = "users"
        indexes = ["email"]
