from sqlalchemy import Column, String, Enum, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"

class User(BaseModel):
    __tablename__ = "user"

    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE)
    is_active = Column(Boolean, default=True)

    employee = relationship("Employee", back_populates="user", uselist=False)
    manager = relationship("Manager", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
