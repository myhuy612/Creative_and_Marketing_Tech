from sqlalchemy import Column, DateTime, Integer, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.models.base import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id"), primary_key=True)
    result_schema_version = Column(Integer, nullable=False, default=1)

    sentiment_summary = Column(JSONB, nullable=True)
    insights = Column(JSONB, nullable=True)
    objections = Column(JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
