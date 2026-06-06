from sqlalchemy import Column, String, ForeignKey, UUID, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class LearningPath(BaseModel):
    __tablename__ = "learning_path"

    name = Column(String, nullable=False)
    description = Column(String)
    certification_id = Column(UUID(as_uuid=True), ForeignKey("certification.id"))
    modules = Column(JSON) # List of modules/steps

    certification = relationship("Certification", back_populates="learning_paths")
    study_plans = relationship("StudyPlan", back_populates="learning_path")
