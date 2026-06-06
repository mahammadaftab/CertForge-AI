from typing import Optional
from pydantic import EmailStr
from app.db.base_class import BaseDocument
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"

class User(BaseDocument):
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.EMPLOYEE
    is_active: bool = True

    class Settings:
        name = "users"
        indexes = ["email"]
