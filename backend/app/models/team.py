from sqlalchemy import Column, String, ForeignKey, UUID
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class Team(BaseModel):
    __tablename__ = "team"

    name = Column(String, nullable=False)
    description = Column(String)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("manager.id"))

    manager = relationship("Manager", back_populates="teams")
    employees = relationship("Employee", back_populates="team")
