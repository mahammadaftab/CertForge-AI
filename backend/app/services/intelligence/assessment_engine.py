from typing import List, Dict, Any, Optional
import logging
import json
from pydantic import BaseModel
from app.services.ai.config import llm
from langchain_core.messages import SystemMessage, HumanMessage

logger = logging.getLogger(__name__)

class Question(BaseModel):
    id: str
    type: str # "mcq" or "scenario"
    text: str
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    metadata: Dict[str, Any]

class AssessmentResult(BaseModel):
    score: float
    feedback: str
    strengths: List[str]
    gaps: List[str]

class AssessmentEngine:
    """
    AI-powered Assessment Engine for generating and evaluating certification exams.
    """
    
    async def generate_mcqs(self, certification: str, difficulty: str, count: int = 5) -> List[Dict[str, Any]]:
        """
        Generates adaptive MCQs for a specific certification.
        """
        system_prompt = f"""You are an expert Certification Examiner for {certification}.
Generate {count} high-quality Multiple Choice Questions at {difficulty} difficulty.
Format the output as a JSON list of objects with: 
"id", "text", "options" (list of 4), "correct_answer", "explanation"."""

        try:
            response = await llm.ainvoke([HumanMessage(content=system_prompt)])
            # Basic cleaning of LLM output for potential markdown blocks
            content = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            logger.error(f"Error generating MCQs: {e}")
            return []

    async def generate_scenario(self, certification: str) -> Dict[str, Any]:
        """
        Generates complex, multi-stage workplace scenarios.
        """
        system_prompt = f"""Create a complex workplace scenario for a {certification} professional.
The scenario should involve a technical challenge with multiple dependencies.
Include: "context", "challenge", "options" (4 strategic approaches), "correct_approach", and "logic"."""

        try:
            response = await llm.ainvoke([HumanMessage(content=system_prompt)])
            content = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            logger.error(f"Error generating scenario: {e}")
            return {}

    async def evaluate_performance(self, certification: str, submissions: List[Dict[str, Any]]) -> AssessmentResult:
        """
        Evaluates a user's assessment and provides detailed AI feedback.
        """
        system_prompt = f"""Analyze the following certification assessment results for {certification}.
Provide a score (0-100), overall feedback, top strengths, and critical knowledge gaps."""
        
        human_prompt = f"Results: {json.dumps(submissions)}"

        try:
            response = await llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=human_prompt)
            ])
            # Assuming the LLM returns a structured summary
            # In production, we'd use a more rigorous parser
            return AssessmentResult(
                score=85.0, # Mocked
                feedback=response.content,
                strengths=["Identity Management", "Network Security"],
                gaps=["Governance Controls"]
            )
        except Exception as e:
            logger.error(f"Error evaluating assessment: {e}")
            return AssessmentResult(score=0, feedback="Evaluation failed", strengths=[], gaps=[])

assessment_engine = AssessmentEngine()
