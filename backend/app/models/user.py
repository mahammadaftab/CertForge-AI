from typing import Optional
from pydantic import EmailStr
from app.db.base_class import BaseDocument
import enum
import pymongo
from pymongo import IndexModel

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
        indexes = [
            pymongo.IndexModel([("email", pymongo.ASCENDING)], unique=True, name="unique_email_idx")
        ]
