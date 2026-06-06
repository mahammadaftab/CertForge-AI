from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class Certification(BaseModel):
    __tablename__ = "certification"

    name = Column(String, nullable=False)
    provider = Column(String) # e.g., Microsoft, AWS
    code = Column(String, unique=True) # e.g., AZ-900
    description = Column(String)
    level = Column(String) # e.g., Beginner, Intermediate, Expert

    learning_paths = relationship("LearningPath", back_populates="certification")
    assessments = relationship("Assessment", back_populates="certification")
    readiness_scores = relationship("ReadinessScore", back_populates="certification")
