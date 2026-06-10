import logging
from datetime import datetime, timedelta
from typing import List, Dict
from app.models.production import Certification, LearningPath, StudyPlan, AgentLog, LogStatus
from app.core.websocket import manager

logger = logging.getLogger(__name__)

class LearningAgent:
    def __init__(self):
        self.name = "Learning Agent"

    async def initialize_session(self, user_id: str, certification_id: str):
        """
        Orchestrates the creation of a learning session and study roadmap.
        """
        logger.info(f"Initializing learning session for user {user_id} and cert {certification_id}")
        
        # 1. Log Start
        await self._log(user_id, "INITIALIZING_SESSION", LogStatus.ACTION, f"Starting cycle for cert {certification_id}")
        
        # 2. Fetch Cert Data
        cert = await Certification.get(certification_id)
        if not cert:
            await self._log(user_id, "SESSION_FAILED", LogStatus.ERROR, "Certification protocol not found.")
            return None

        # 3. Generate Roadmap (Deterministic logic for production stability)
        roadmap = [
            {"phase": "Foundational Discovery", "topics": ["Core Concepts", "History", "Registry Setup"], "duration": "1 week"},
            {"phase": "Neural Blueprinting", "topics": ["Domain Architecture", "Skill Mapping"], "duration": "2 weeks"},
            {"phase": "Cognitive Stress Test", "topics": ["Mock Exams", "Edge Case Analysis"], "duration": "1 week"}
        ]
        
        # 4. Generate Weekly Goals
        weekly_goals = [
            {"week": 1, "goal": "Complete all foundational modules", "status": "pending"},
            {"week": 2, "goal": "Map 80% of core skills", "status": "pending"},
            {"week": 3, "goal": "Achieve 75% in initial assessment", "status": "pending"},
            {"week": 4, "goal": "Complete final registry sync", "status": "pending"}
        ]
        
        # 5. Create Learning Timeline
        now = datetime.utcnow()
        timeline = [
            {"event": "Cycle Initiated", "date": now.isoformat()},
            {"event": "Milestone Alpha Expected", "date": (now + timedelta(days=7)).isoformat()},
            {"event": "Milestone Beta Expected", "date": (now + timedelta(days=21)).isoformat()},
            {"event": "Final Validation Expected", "date": (now + timedelta(days=30)).isoformat()}
        ]

        # 6. Save Study Plan
        plan = StudyPlan(
            user_id=user_id,
            certification_id=certification_id,
            roadmap=roadmap,
            weekly_goals=weekly_goals,
            timeline=timeline
        )
        await plan.insert()

        # 7. Update Learning Path
        path = await LearningPath.find_one(
            LearningPath.user_id == user_id,
            LearningPath.certification_id == certification_id
        )
        if path:
            path.status = "active"
            path.progress = 5 # Initial kickstart progress
            await path.save()

        # 8. Log Success
        await self._log(user_id, "SESSION_READY", LogStatus.SUCCESS, f"Study plan generated for {cert.name}")

        # 9. WebSocket Event
        await manager.send_personal_message({
            "type": "learning_started",
            "data": {
                "certification_name": cert.name,
                "plan_id": str(plan.id)
            }
        }, user_id)

        await manager.send_personal_message({
            "type": "agent_completed",
            "data": {"agent": self.name}
        }, user_id)

        await manager.broadcast({
            "type": "dashboard_updated",
            "data": {"module": "learning_path"}
        })

        return {
            "study_plan": roadmap,
            "weekly_goals": weekly_goals,
            "timeline": timeline
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

learning_agent = LearningAgent()
