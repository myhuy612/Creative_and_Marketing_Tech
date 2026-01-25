import time
from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import settings
from app.models.analysis import Analysis
from app.models.review_item import ReviewItem
from app.models.module_run import AnalysisModuleRun
from app.models.analysis_result import AnalysisResult

from app.services.pii_masking import mask_pii
from app.services.sentiment import get_sentiment_pipe, normalize_label

from app.services.memory_store import STORE


# -------------------------
# Postgres mode (existing)
# -------------------------
def create_analysis(db: Session, session_id: UUID, language: str, reviews: list[str], modules: list[str]) -> UUID:
    reviews = reviews[:100]
    total_chars = sum(len(x) for x in reviews)

    a = Analysis(
        session_id=session_id,
        status="queued",
        language=language,
        review_count=len(reviews),
        input_char_count=total_chars,
    )
    db.add(a)
    db.flush()

    for txt in reviews:
        db.add(
            ReviewItem(
                analysis_id=a.id,
                text_original=txt,
                text_sanitized=mask_pii(txt),
            )
        )

    for m in modules:
        db.add(
            AnalysisModuleRun(
                analysis_id=a.id,
                module=m,
                status="queued",
                model_version=settings.model_name if m == "sentiment" else None,
            )
        )

    db.add(AnalysisResult(analysis_id=a.id, result_schema_version=1))
    db.commit()
    return a.id


def run_sentiment_job(db: Session, analysis_id: UUID):
    start = time.time()

    a = db.get(Analysis, analysis_id)
    if not a:
        return

    a.status = "running"
    a.started_at = datetime.now(timezone.utc)
    db.commit()

    mr = db.execute(
        select(AnalysisModuleRun).where(
            AnalysisModuleRun.analysis_id == analysis_id,
            AnalysisModuleRun.module == "sentiment",
        )
    ).scalar_one_or_none()

    if mr:
        mr.status = "running"
        mr.started_at = datetime.now(timezone.utc)
        db.commit()

    try:
        pipe = get_sentiment_pipe()
        items = db.execute(select(ReviewItem).where(ReviewItem.analysis_id == analysis_id)).scalars().all()

        outputs = pipe([it.text_sanitized for it in items])

        for it, out in zip(items, outputs):
            it.sentiment_label = normalize_label(out["label"])
            it.sentiment_score = float(out["score"])

        counts = {"pos": 0, "neu": 0, "neg": 0}
        for it in items:
            if it.sentiment_label in counts:
                counts[it.sentiment_label] += 1

        total = max(1, len(items))
        ratios = {k: counts[k] / total for k in counts}

        sortable = [it for it in items if it.sentiment_score is not None]
        top_pos = sorted(sortable, key=lambda x: x.sentiment_score, reverse=True)[:3]
        top_neg = sorted(sortable, key=lambda x: x.sentiment_score)[:3]

        summary = {
            "counts": counts,
            "ratios": ratios,
            "top_positive": [
                {"id": str(it.id), "text": it.text_original, "sentiment_label": it.sentiment_label, "sentiment_score": it.sentiment_score}
                for it in top_pos
            ],
            "top_negative": [
                {"id": str(it.id), "text": it.text_original, "sentiment_label": it.sentiment_label, "sentiment_score": it.sentiment_score}
                for it in top_neg
            ],
        }

        res = db.get(AnalysisResult, analysis_id)
        if res:
            res.sentiment_summary = summary

        end = time.time()

        if mr:
            mr.status = "done"
            mr.completed_at = datetime.now(timezone.utc)
            mr.duration_ms = int((end - start) * 1000)

        a.status = "done"
        a.completed_at = datetime.now(timezone.utc)
        a.duration_ms = int((end - start) * 1000)

        db.commit()

    except Exception as e:
        msg = str(e)

        a.status = "error"
        a.error_message = msg
        a.completed_at = datetime.now(timezone.utc)

        if mr:
            mr.status = "error"
            mr.error_message = msg
            mr.completed_at = datetime.now(timezone.utc)

        db.commit()


# -------------------------
# Memory mode (new)
# -------------------------
def run_sentiment_job_memory(analysis_id: UUID):
    start = time.time()

    a = STORE.analyses.get(analysis_id)
    if not a:
        return

    a.status = "running"
    a.started_at = datetime.now(timezone.utc)

    runs = STORE.module_runs.get(analysis_id, [])
    mr = next((r for r in runs if r.module == "sentiment"), None)
    if mr:
        mr.status = "running"
        mr.started_at = datetime.now(timezone.utc)

    try:
        pipe = get_sentiment_pipe()
        items = STORE.review_items.get(analysis_id, [])

        # Mask before inference
        for it in items:
            it.text_sanitized = mask_pii(it.text_original)

        outputs = pipe([it.text_sanitized for it in items])

        for it, out in zip(items, outputs):
            it.sentiment_label = normalize_label(out["label"])
            it.sentiment_score = float(out["score"])

        counts = {"pos": 0, "neu": 0, "neg": 0}
        for it in items:
            if it.sentiment_label in counts:
                counts[it.sentiment_label] += 1

        total = max(1, len(items))
        ratios = {k: counts[k] / total for k in counts}

        sortable = [it for it in items if it.sentiment_score is not None]
        top_pos = sorted(sortable, key=lambda x: x.sentiment_score, reverse=True)[:3]
        top_neg = sorted(sortable, key=lambda x: x.sentiment_score)[:3]

        summary = {
            "counts": counts,
            "ratios": ratios,
            "top_positive": [
                {"id": str(it.id), "text": it.text_original, "sentiment_label": it.sentiment_label, "sentiment_score": it.sentiment_score}
                for it in top_pos
            ],
            "top_negative": [
                {"id": str(it.id), "text": it.text_original, "sentiment_label": it.sentiment_label, "sentiment_score": it.sentiment_score}
                for it in top_neg
            ],
        }

        res = STORE.results.get(analysis_id)
        if res:
            res.sentiment_summary = summary

        end = time.time()

        if mr:
            mr.status = "done"
            mr.completed_at = datetime.now(timezone.utc)
            mr.duration_ms = int((end - start) * 1000)

        a.status = "done"
        a.completed_at = datetime.now(timezone.utc)
        a.duration_ms = int((end - start) * 1000)

    except Exception as e:
        msg = str(e)
        a.status = "error"
        a.error_message = msg
        a.completed_at = datetime.now(timezone.utc)
        if mr:
            mr.status = "error"
            mr.error_message = msg
            mr.completed_at = datetime.now(timezone.utc)
