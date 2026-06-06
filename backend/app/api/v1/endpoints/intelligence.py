from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.services.intelligence.foundry_iq import foundry_iq
from app.services.intelligence.work_iq import work_iq, WorkloadMetrics

router = APIRouter()

@router.post("/query-knowledge")
def query_foundry(query: str, current_user: Any = Depends(deps.get_current_active_user)):
    """
    Endpoint for Microsoft Foundry IQ grounded retrieval.
    """
    return foundry_iq.retrieve_grounded_answer(query)

@router.post("/analyze-work-iq")
def analyze_workload(metrics: WorkloadMetrics, current_user: Any = Depends(deps.get_current_active_user)):
    """
    Endpoint for Work IQ capacity and burnout analysis.
    """
    analysis = work_iq.analyze_capacity(metrics)
    study_time = work_iq.predict_best_study_time(metrics)
    
    return {
        "workforce_intelligence": analysis,
        "study_optimization": study_time
    }

@router.post("/ingest-docs")
def ingest_docs(docs: list, current_user: Any = Depends(deps.get_current_active_user)):
    """
    Admin endpoint to ingest certification documents.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can ingest documents")
    foundry_iq.index_documents(docs)
    return {"status": "success", "indexed_count": len(docs)}
