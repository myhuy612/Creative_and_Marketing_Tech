from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from uuid import UUID

from app.core.config import settings
from app.db.session import get_db, SessionLocal
from app.schemas.analysis import (
    AnalysisCreateRequest,
    AnalysisCreateResponse,
    AnalysisDetailResponse,
    RerunRequest,
    RerunResponse,
)

from app.services.analysis_service import create_analysis, run_sentiment_job, run_sentiment_job_memory
from app.services.memory_store import STORE

from app.models.analysis import Analysis
from app.models.review_item import ReviewItem
from app.models.module_run import AnalysisModuleRun
from app.models.analysis_result import AnalysisResult

router = APIRouter()


def _run_sentiment_bg_postgres(analysis_id: UUID):
    db = SessionLocal()
    try:
        run_sentiment_job(db, analysis_id)
    finally:
        db.close()


def _run_sentiment_bg_memory(analysis_id: UUID):
    run_sentiment_job_memory(analysis_id)


@router.post("/analyses", response_model=AnalysisCreateResponse)
def post_analyses(payload: AnalysisCreateRequest, bg: BackgroundTasks, db: Session = Depends(get_db)):
    if len(payload.reviews) == 0:
        raise HTTPException(status_code=400, detail="Empty reviews.")
    if len(payload.reviews) > 100:
        raise HTTPException(status_code=400, detail="Too many reviews (max 100).")
    if sum(len(x) for x in payload.reviews) > 20000:
        raise HTTPException(status_code=400, detail="Too many characters (max 20,000).")

    if settings.db_mode == "memory":
        analysis_id = STORE.create_analysis(
            session_id=payload.session_id,
            language=payload.language,
            reviews=payload.reviews,
            modules=payload.modules,
            model_name=settings.model_name,
        )
        if "sentiment" in payload.modules:
            bg.add_task(_run_sentiment_bg_memory, analysis_id)
        return {"analysis_id": analysis_id, "status": "queued"}

    # postgres mode
    assert db is not None
    analysis_id = create_analysis(db, payload.session_id, payload.language, payload.reviews, payload.modules)
    if "sentiment" in payload.modules:
        bg.add_task(_run_sentiment_bg_postgres, analysis_id)

    return {"analysis_id": analysis_id, "status": "queued"}


@router.get("/analyses/{analysis_id}", response_model=AnalysisDetailResponse)
def get_analysis(analysis_id: UUID, session_id: UUID, db: Session = Depends(get_db)):
    if settings.db_mode == "memory":
        a = STORE.analyses.get(analysis_id)
        if not a or a.session_id != session_id:
            raise HTTPException(status_code=404, detail="Not found.")

        runs = STORE.module_runs.get(analysis_id, [])
        modules_status = {r.module: r.status for r in runs}

        res = STORE.results.get(analysis_id)
        items = STORE.review_items.get(analysis_id, [])

        return {
            "analysis_id": analysis_id,
            "status": a.status,
            "error_message": a.error_message,
            "modules_status": modules_status,
            "sentiment_summary": res.sentiment_summary if res else None,
            "review_items": [
                {
                    "id": it.id,
                    "text": it.text_original,
                    "sentiment_label": it.sentiment_label,
                    "sentiment_score": it.sentiment_score,
                }
                for it in items
            ],
        }

    # postgres mode
    assert db is not None
    a = db.get(Analysis, analysis_id)
    if not a or a.session_id != session_id:
        raise HTTPException(status_code=404, detail="Not found.")

    runs = db.execute(select(AnalysisModuleRun).where(AnalysisModuleRun.analysis_id == analysis_id)).scalars().all()
    modules_status = {r.module: r.status for r in runs}

    res = db.get(AnalysisResult, analysis_id)
    items = db.execute(select(ReviewItem).where(ReviewItem.analysis_id == analysis_id)).scalars().all()

    return {
        "analysis_id": analysis_id,
        "status": a.status,
        "error_message": a.error_message,
        "modules_status": modules_status,
        "sentiment_summary": res.sentiment_summary if res else None,
        "review_items": [
            {
                "id": it.id,
                "text": it.text_original,
                "sentiment_label": it.sentiment_label,
                "sentiment_score": it.sentiment_score,
            }
            for it in items
        ],
    }


@router.post("/analyses/{analysis_id}/rerun", response_model=RerunResponse)
def rerun(analysis_id: UUID, payload: RerunRequest, bg: BackgroundTasks, db: Session = Depends(get_db)):
    if settings.db_mode == "memory":
        a0 = STORE.analyses.get(analysis_id)
        if not a0 or a0.session_id != payload.session_id:
            raise HTTPException(status_code=404, detail="Not found.")

        items = STORE.review_items.get(analysis_id, [])
        reviews = [it.text_original for it in items]

        new_id = STORE.create_analysis(
            session_id=payload.session_id,
            language=a0.language,
            reviews=reviews,
            modules=payload.modules,
            model_name=settings.model_name,
        )

        if "sentiment" in payload.modules:
            bg.add_task(_run_sentiment_bg_memory, new_id)

        return {"analysis_id": new_id, "status": "queued"}

    # postgres mode
    assert db is not None
    a0 = db.get(Analysis, analysis_id)
    if not a0 or a0.session_id != payload.session_id:
        raise HTTPException(status_code=404, detail="Not found.")

    items = db.execute(select(ReviewItem).where(ReviewItem.analysis_id == analysis_id)).scalars().all()
    reviews = [it.text_original for it in items]

    new_id = create_analysis(db, payload.session_id, a0.language, reviews, payload.modules)
    if "sentiment" in payload.modules:
        bg.add_task(_run_sentiment_bg_postgres, new_id)

    return {"analysis_id": new_id, "status": "queued"}
