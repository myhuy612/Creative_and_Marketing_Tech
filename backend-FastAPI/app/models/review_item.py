import uuid
from sqlalchemy import Column, Text, Float, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class ReviewItem(Base):
    __tablename__ = "review_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id"), index=True, nullable=False)

    text_original = Column(Text, nullable=False)
    text_sanitized = Column(Text, nullable=False)

    sentiment_label = Column(String, nullable=True)  # pos|neu|neg
    sentiment_score = Column(Float, nullable=True)
