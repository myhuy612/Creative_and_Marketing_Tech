from pydantic import BaseModel
from uuid import UUID

class SessionCreateResponse(BaseModel):
    session_id: UUID
