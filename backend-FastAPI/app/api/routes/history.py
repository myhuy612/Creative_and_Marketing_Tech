from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from uuid import UUID

from app.core.config import settings
from app.db.session import get_db
from app.models.analysis import Analysis
from app.schemas.history import HistoryResponse

from app.services.memory_store import STORE

router = APIRouter()


@router.get("/history", response_model=HistoryResponse)
def history(session_id: UUID, limit: int = 10, db: Session = Depends(get_db)):
    if settings.db_mode == "memory":
        items = [a for a in STORE.analyses.values() if a.session_id == session_id]
        items.sort(key=lambda x: x.created_at, reverse=True)
        items = items[: min(limit, 50)]
        return {
            "items": [
                {
                    "analysis_id": it.id,
                    "status": it.status,
                    "created_at": it.created_at.isoformat(),
                    "review_count": it.review_count,
                }
                for it in items
            ]
        }

    assert db is not None
    q = (
        select(Analysis)
        .where(Analysis.session_id == session_id)
        .order_by(desc(Analysis.created_at))
        .limit(min(limit, 50))
    )
    rows = db.execute(q).scalars().all()

    return {
        "items": [
            {
                "analysis_id": r.id,
                "status": r.status,
                "created_at": r.created_at.isoformat() if r.created_at else "",
                "review_count": r.review_count,
            }
            for r in rows
        ]
    }
