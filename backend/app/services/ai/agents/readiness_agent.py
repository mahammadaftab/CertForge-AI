import logging
from datetime import datetime
from typing import List, Dict, Any
from app.models.production import (
    ReadinessScore, 
    AssessmentResult, 
    LearningPath, 
    Certification, 
    AgentLog, 
    LogStatus
)

logger = logging.getLogger(__name__)

class ReadinessAgent:
    def __init__(self):
        self.name = "Readiness Agent"

    async def calculate_readiness(self, user_id: str, certification_id: str):
        """
        Synthesizes multi-dimensional signals to calculate a 0-100 Readiness Score
        and generate strategic qualitative insights.
        """
        logger.info(f"Initializing readiness synthesis for user {user_id} and cert {certification_id}")
        
        await self._log(user_id, "STARTING_CALCULATION", LogStatus.INFO, f"Syncing signals for cert {certification_id}")

        # 1. Fetch Inputs
        cert = await Certification.get(certification_id)
        if not cert:
            await self._log(user_id, "CALCULATION_FAILED", LogStatus.ERROR, "Certification protocol not found.")
            return None

        # Fetch latest assessment
        assessment_res = await AssessmentResult.find(
            AssessmentResult.user_id == user_id,
            AssessmentResult.certification_id == certification_id
        ).sort("-created_at").limit(1).to_list()
        
        # Fetch learning path progress
        path = await LearningPath.find_one(
            LearningPath.user_id == user_id,
            LearningPath.certification_id == certification_id
        )

        # 2. Extract Values
        assessment_score = assessment_res[0].score if assessment_res else 0
        study_progress = path.progress if path else 0
        
        # Skill coverage (Benchmarked against cert requirements)
        # In production, this would be an intersection of user skill graph and cert blueprint
        # For this implementation, we derive it from study progress and assessment success
        skill_coverage = (study_progress * 0.6) + (assessment_score * 0.4)

        # 3. Calculate Weighted Readiness Score
        # Weighting: 50% Assessment, 30% Skill Coverage, 20% Study Progress
        readiness_score = (assessment_score * 0.5) + (skill_coverage * 0.3) + (study_progress * 0.2)
        readiness_score = round(min(100, readiness_score), 2)

        # 4. Generate Insights (Strengths, Weaknesses, Recommendations)
        insights = self._generate_insights(assessment_score, study_progress, skill_coverage, cert)

        # 5. Persist Results
        score_doc = await ReadinessScore.find_one(
            ReadinessScore.user_id == user_id,
            ReadinessScore.certification_id == certification_id
        )
        
        if score_doc:
            score_doc.score = readiness_score
            score_doc.dimensions = {
                "Knowledge": assessment_score,
                "Skills": skill_coverage,
                "Trajectory": study_progress
            }
            score_doc.strengths = insights["strengths"]
            score_doc.weaknesses = insights["weaknesses"]
            score_doc.recommendations = insights["recommendations"]
            score_doc.updated_at = datetime.utcnow()
            score_doc.verification_status = "Verified" if readiness_score >= 85 else "Partial"
            await score_doc.save()
        else:
            score_doc = ReadinessScore(
                user_id=user_id,
                certification_id=certification_id,
                score=readiness_score,
                dimensions={
                    "Knowledge": assessment_score,
                    "Skills": skill_coverage,
                    "Trajectory": study_progress
                },
                strengths=insights["strengths"],
                weaknesses=insights["weaknesses"],
                recommendations=insights["recommendations"],
                verification_status="Verified" if readiness_score >= 85 else "Partial"
            )
            await score_doc.insert()

        await self._log(user_id, "READINESS_CALCULATED", LogStatus.SUCCESS, f"Final Score: {readiness_score}%")
        
        # WebSocket Events
        from app.core.websocket import manager
        await manager.send_personal_message({
            "type": "readiness_updated",
            "data": {"score": readiness_score, "status": score_doc.verification_status}
        }, user_id)

        await manager.send_personal_message({
            "type": "agent_completed",
            "data": {"agent": self.name}
        }, user_id)

        await manager.broadcast({
            "type": "dashboard_updated",
            "data": {"module": "readiness"}
        })

        return score_doc

    def _generate_insights(self, assessment: float, progress: float, skills: float, cert: Certification) -> Dict[str, List[str]]:
        strengths = []
        weaknesses = []
        recommendations = []

        # Logic for Strengths
        if assessment > 80: strengths.append(f"Superior cognitive alignment with {cert.name} theoretical frameworks.")
        if progress > 70: strengths.append("Consistent neural study velocity maintained over 30 days.")
        if skills > 75: strengths.append("High practical mastery across core compute domains.")

        # Logic for Weaknesses
        if assessment < 60: weaknesses.append("Theoretical latency detected in complex governance scopes.")
        if progress < 40: weaknesses.append("Insufficient study volume to ensure registry validation.")
        if skills < 50: weaknesses.append("Practical implementation gaps identified in region-failover logic.")

        # Logic for Recommendations
        if assessment < 70: recommendations.append("Execute 2 specialized Focus Cycles in 'Security & Identity'.")
        if progress < 90: recommendations.append("Complete remaining 3 modules in the current trajectory.")
        if readiness_score := (assessment * 0.5 + skills * 0.3 + progress * 0.2) < 85:
            recommendations.append("Target a baseline readiness of 85% before committing to the final registry sync.")
        else:
            recommendations.append("Clearance granted for final certification attempt.")

        # Fallbacks for empty states
        if not strengths: strengths.append("Baseline foundational knowledge established.")
        if not weaknesses: weaknesses.append("No critical failures detected in current telemetry.")
        if not recommendations: recommendations.append("Maintain current learning velocity.")

        return {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations
        }

    async def _log(self, user_id: str, action: str, status: LogStatus, details: str):
        log = AgentLog(
            agent_name=self.name,
            action=action,
            status=status,
            details=details,
            created_at=datetime.utcnow()
        )
        await log.insert()

readiness_agent = ReadinessAgent()
