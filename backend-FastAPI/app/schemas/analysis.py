from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal
from uuid import UUID

AnalysisStatus = Literal["queued", "running", "done", "error"]
SentimentLabel = Literal["pos", "neu", "neg"]

class AnalysisCreateRequest(BaseModel):
    session_id: UUID
    language: Literal["auto", "ja", "en"] = "auto"
    reviews: List[str] = Field(min_length=1)
    modules: List[str] = Field(default_factory=lambda: ["sentiment"])

class AnalysisCreateResponse(BaseModel):
    analysis_id: UUID
    status: AnalysisStatus

class ReviewItemOut(BaseModel):
    id: UUID
    text: str
    sentiment_label: Optional[SentimentLabel] = None
    sentiment_score: Optional[float] = None

class AnalysisDetailResponse(BaseModel):
    analysis_id: UUID
    status: AnalysisStatus
    error_message: Optional[str] = None
    modules_status: Dict[str, AnalysisStatus] = {}
    sentiment_summary: Optional[dict] = None
    review_items: Optional[List[ReviewItemOut]] = None

class RerunRequest(BaseModel):
    session_id: UUID
    modules: List[str] = Field(default_factory=lambda: ["sentiment"])

class RerunResponse(BaseModel):
    analysis_id: UUID
    status: AnalysisStatus
