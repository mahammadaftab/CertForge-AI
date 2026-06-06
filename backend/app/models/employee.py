from sqlalchemy import Column, String, ForeignKey, UUID
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class Employee(BaseModel):
    __tablename__ = "employee"

    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), unique=True)
    team_id = Column(UUID(as_uuid=True), ForeignKey("team.id"))
    job_title = Column(String)

    user = relationship("User", back_populates="employee")
    team = relationship("Team", back_populates="employees")
    study_plans = relationship("StudyPlan", back_populates="employee")
    assessment_results = relationship("AssessmentResult", back_populates="employee")
    readiness_scores = relationship("ReadinessScore", back_populates="employee")
