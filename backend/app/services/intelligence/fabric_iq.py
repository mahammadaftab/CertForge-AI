from typing import List, Dict, Any, Optional
import networkx as nx
import logging
from enum import Enum

logger = logging.getLogger(__name__)

class EntityType(str, Enum):
    EMPLOYEE = "employee"
    TEAM = "team"
    CERTIFICATION = "certification"
    SKILL = "skill"

class RelationType(str, Enum):
    MEMBER_OF = "member_of"
    HAS_SKILL = "has_skill"
    REQUIRES_SKILL = "requires_skill"
    TARGETS_CERT = "targets_cert"
    CERTIFIED_IN = "certified_in"

class FabricIQService:
    """
    Fabric IQ Semantic Layer: Orchestrates relationships between workforce entities
    using a directed knowledge graph.
    """
    def __init__(self):
        self.graph = nx.DiGraph()
        
    def add_entity(self, entity_id: str, entity_type: EntityType, properties: Dict[str, Any] = None):
        self.graph.add_node(entity_id, type=entity_type, **(properties or {}))

    def add_relationship(self, source_id: str, target_id: str, relation: RelationType):
        self.graph.add_edge(source_id, target_id, relation=relation)

    def get_team_readiness(self, team_id: str) -> Dict[str, Any]:
        """
        Calculates team readiness by analyzing the delta between required skills 
        for target certifications and actual member skills.
        """
        if team_id not in self.graph:
            return {"error": "Team not found in Fabric IQ"}

        members = [n for n, d in self.graph.out_edges(team_id) if self.graph.edges[n, d].get('relation') == RelationType.MEMBER_OF]
        # Inverting search for members since relation is usually Employee -> Team
        members = [u for u, v, d in self.graph.edges(data=True) if v == team_id and d.get('relation') == RelationType.MEMBER_OF]
        
        team_skills = set()
        for member in members:
            member_skills = [v for u, v, d in self.graph.edges(member, data=True) if d.get('relation') == RelationType.HAS_SKILL]
            team_skills.update(member_skills)

        # Find team targets
        target_certs = [v for u, v, d in self.graph.edges(team_id, data=True) if d.get('relation') == RelationType.TARGETS_CERT]
        
        readiness_report = []
        for cert in target_certs:
            required_skills = set([v for u, v, d in self.graph.edges(cert, data=True) if d.get('relation') == RelationType.REQUIRES_SKILL])
            missing_skills = required_skills - team_skills
            
            score = 100 if not required_skills else (1 - len(missing_skills)/len(required_skills)) * 100
            readiness_report.append({
                "certification": cert,
                "readiness_score": round(score, 2),
                "missing_skills": list(missing_skills)
            })

        return {
            "team_id": team_id,
            "members_count": len(members),
            "certifications": readiness_report
        }

    def identify_workforce_risks(self) -> List[Dict[str, Any]]:
        """
        Detects risks such as 'Single Point of Failure' (only one person has a critical skill)
        or 'Skill Gaps' for mission-critical certifications.
        """
        risks = []
        
        # 1. Single Point of Failure Analysis
        skills = [n for n, d in self.graph.nodes(data=True) if d.get('type') == EntityType.SKILL]
        for skill in skills:
            holders = [u for u, v, d in self.graph.in_edges(skill, data=True) if d.get('relation') == RelationType.HAS_SKILL]
            if len(holders) == 1:
                risks.append({
                    "type": "Single Point of Failure",
                    "entity": skill,
                    "severity": "High",
                    "description": f"Only {holders[0]} possesses the {skill} skill."
                })

        return risks

fabric_iq = FabricIQService()
