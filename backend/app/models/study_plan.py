from sqlalchemy import Column, String, ForeignKey, UUID, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import BaseModel

class StudyPlan(BaseModel):
    __tablename__ = "study_plan"

    employee_id = Column(UUID(as_uuid=True), ForeignKey("employee.id"))
    learning_path_id = Column(UUID(as_uuid=True), ForeignKey("learning_path.id"))
    start_date = Column(DateTime)
    target_date = Column(DateTime)
    status = Column(String, default="in_progress") # e.g., in_progress, completed, overdue

    employee = relationship("Employee", back_populates="study_plans")
    learning_path = relationship("LearningPath", back_populates="study_plans")
