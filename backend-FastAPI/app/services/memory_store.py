import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Optional

AnalysisStatus = str  # "queued" | "running" | "done" | "error"


@dataclass
class MemorySession:
    id: uuid.UUID
    created_at: datetime


@dataclass
class MemoryAnalysis:
    id: uuid.UUID
    session_id: uuid.UUID
    status: AnalysisStatus
    language: str
    review_count: int
    input_char_count: int
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None
    error_message: Optional[str] = None


@dataclass
class MemoryReviewItem:
    id: uuid.UUID
    analysis_id: uuid.UUID
    text_original: str
    text_sanitized: str
    sentiment_label: Optional[str] = None
    sentiment_score: Optional[float] = None


@dataclass
class MemoryModuleRun:
    id: uuid.UUID
    analysis_id: uuid.UUID
    module: str
    status: AnalysisStatus
    model_version: Optional[str] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None
    error_message: Optional[str] = None


@dataclass
class MemoryResult:
    analysis_id: uuid.UUID
    result_schema_version: int = 1
    sentiment_summary: Optional[dict] = None
    insights: Optional[dict] = None
    objections: Optional[dict] = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


class MemoryStore:
    def __init__(self):
        self.sessions: Dict[uuid.UUID, MemorySession] = {}
        self.analyses: Dict[uuid.UUID, MemoryAnalysis] = {}
        self.review_items: Dict[uuid.UUID, List[MemoryReviewItem]] = {}
        self.module_runs: Dict[uuid.UUID, List[MemoryModuleRun]] = {}
        self.results: Dict[uuid.UUID, MemoryResult] = {}

    def create_session(self) -> uuid.UUID:
        sid = uuid.uuid4()
        self.sessions[sid] = MemorySession(id=sid, created_at=datetime.now(timezone.utc))
        return sid

    def create_analysis(self, session_id: uuid.UUID, language: str, reviews: List[str], modules: List[str], model_name: str) -> uuid.UUID:
        aid = uuid.uuid4()
        reviews = reviews[:100]
        total_chars = sum(len(x) for x in reviews)

        self.analyses[aid] = MemoryAnalysis(
            id=aid,
            session_id=session_id,
            status="queued",
            language=language,
            review_count=len(reviews),
            input_char_count=total_chars,
            created_at=datetime.now(timezone.utc),
        )

        items: List[MemoryReviewItem] = []
        for txt in reviews:
            rid = uuid.uuid4()
            items.append(
                MemoryReviewItem(
                    id=rid,
                    analysis_id=aid,
                    text_original=txt,
                    text_sanitized=txt,  # masked before inference
                )
            )
        self.review_items[aid] = items

        runs: List[MemoryModuleRun] = []
        for m in modules:
            runs.append(
                MemoryModuleRun(
                    id=uuid.uuid4(),
                    analysis_id=aid,
                    module=m,
                    status="queued",
                    model_version=model_name if m == "sentiment" else None,
                )
            )
        self.module_runs[aid] = runs

        self.results[aid] = MemoryResult(analysis_id=aid)
        return aid


STORE = MemoryStore()
