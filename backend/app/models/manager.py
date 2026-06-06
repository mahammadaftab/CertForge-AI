from sqlalchemy import Column, String, ForeignKey, UUID
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class Manager(BaseModel):
    __tablename__ = "manager"

    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), unique=True)
    department = Column(String)

    user = relationship("User", back_populates="manager")
    teams = relationship("Team", back_populates="manager")
