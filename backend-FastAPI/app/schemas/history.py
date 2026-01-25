from pydantic import BaseModel
from typing import List, Literal
from uuid import UUID

AnalysisStatus = Literal["queued", "running", "done", "error"]

class HistoryItem(BaseModel):
    analysis_id: UUID
    status: AnalysisStatus
    created_at: str
    review_count: int

class HistoryResponse(BaseModel):
    items: List[HistoryItem]
