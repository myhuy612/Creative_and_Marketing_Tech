import uuid
from sqlalchemy import Column, DateTime, Integer, Text, func, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class AnalysisModuleRun(Base):
    __tablename__ = "analysis_module_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id"), index=True, nullable=False)

    module = Column(String, nullable=False)  # sentiment|insights|objections
    status = Column(String, nullable=False, default="queued")
    model_version = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_ms = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=True)
