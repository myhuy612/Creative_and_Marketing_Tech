import uuid
from sqlalchemy import Column, DateTime, Integer, Text, func, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"), index=True, nullable=False)

    status = Column(String, nullable=False, default="queued")  # queued|running|done|error
    language = Column(String, nullable=False, default="auto")

    review_count = Column(Integer, nullable=False, default=0)
    input_char_count = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    duration_ms = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=True)
