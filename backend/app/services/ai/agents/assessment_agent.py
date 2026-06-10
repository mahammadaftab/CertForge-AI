import logging
import uuid
from datetime import datetime
from typing import List, Dict, Any
from app.models.production import Assessment, AssessmentResult, AgentLog, LogStatus
from app.services.ai.agents.readiness_agent import readiness_agent

logger = logging.getLogger(__name__)

class AssessmentAgent:
    def __init__(self):
        self.name = "Assessment Agent"

    async def generate_assessment(self, certification_id: str, difficulty: str = "Adaptive"):
        """
        Synthesizes a multi-modal assessment including MCQ, Scenario, and Practical tasks.
        """
        logger.info(f"Generating {difficulty} assessment for certification {certification_id}")
        
        # In a real system, these would be generated via LLM/OpenAI
        # For production demo, we use a high-fidelity template logic
        questions = [
            {
                "id": str(uuid.uuid4()),
                "type": "mcq",
                "text": "Which Azure compute service is best suited for hosting a serverless, event-driven function?",
                "options": ["Azure Virtual Machines", "Azure Kubernetes Service", "Azure Functions", "Azure App Service"],
                "correct_answer": "Azure Functions",
                "domain": "Compute"
            },
            {
                "id": str(uuid.uuid4()),
                "type": "scenario",
                "text": "Scenario: An enterprise needs to minimize costs for a non-critical development environment that can tolerate interruptions. Which VM pricing model should you recommend?",
                "options": ["Reserved Instances", "Spot Instances", "Pay-as-you-go", "Dedicated Hosts"],
                "correct_answer": "Spot Instances",
                "domain": "Cost Management"
            },
            {
                "id": str(uuid.uuid4()),
                "type": "practical",
                "text": "Task: Map a role-based access control (RBAC) scope to a specific Resource Group without affecting the parent Subscription. Which scope level is required?",
                "options": ["Tenant Root Group", "Management Group", "Resource Group", "Resource"],
                "correct_answer": "Resource Group",
                "domain": "Governance"
            }
        ]

        assessment = Assessment(
            certification_id=certification_id,
            difficulty=difficulty,
            questions=questions
        )
        await assessment.insert()
        
        await self._log("SYSTEM", "ASSESSMENT_GENERATED", LogStatus.SUCCESS, f"ID: {assessment.id}")
        return assessment

    async def evaluate_submission(self, user_id: str, assessment_id: str, submissions: List[dict]):
        """
        Evaluates user responses, calculates neural scores, and triggers the Readiness Agent.
        """
        assessment = await Assessment.get(assessment_id)
        if not assessment:
            return {"error": "Assessment not found"}

        # Calculate Score
        correct_count = 0
        evaluation_details = []
        
        for sub in submissions:
            question = next((q for q in assessment.questions if q["id"] == sub["id"]), None)
            if question:
                is_correct = sub["answer"] == question["correct_answer"]
                if is_correct:
                    correct_count += 1
                evaluation_details.append({
                    "question_id": sub["id"],
                    "is_correct": is_correct,
                    "domain": question["domain"]
                })

        final_score = (correct_count / len(assessment.questions)) * 100 if assessment.questions else 0

        # Save Result
        result = AssessmentResult(
            user_id=user_id,
            assessment_id=assessment_id,
            certification_id=assessment.certification_id,
            score=final_score,
            responses=submissions,
            evaluation={"details": evaluation_details}
        )
        await result.insert()

        # Log Activity
        await self._log(user_id, "ASSESSMENT_SUBMITTED", LogStatus.SUCCESS, f"Score: {final_score}%")

        # WebSocket Events
        from app.core.websocket import manager
        await manager.send_personal_message({
            "type": "assessment_completed",
            "data": {"score": final_score, "assessment_id": assessment_id}
        }, user_id)

        await manager.send_personal_message({
            "type": "agent_completed",
            "data": {"agent": self.name}
        }, user_id)

        # Trigger Readiness Agent
        await readiness_agent.calculate_readiness(user_id, assessment.certification_id)

        return result

    async def _log(self, user_id: str, action: str, status: LogStatus, details: str):
        log = AgentLog(
            agent_name=self.name,
            action=action,
            status=status,
            details=details,
            created_at=datetime.utcnow()
        )
        await log.insert()

assessment_agent = AssessmentAgent()
