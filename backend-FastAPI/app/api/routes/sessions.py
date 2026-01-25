from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.schemas.session import SessionCreateResponse

from app.services.memory_store import STORE

router = APIRouter()


@router.post("/sessions", response_model=SessionCreateResponse)
def create_session(db: Session = Depends(get_db)):
    if settings.db_mode == "memory":
        sid = STORE.create_session()
        return {"session_id": sid}

    # postgres mode
    from app.models.session import Session as SessionModel
    import uuid

    assert db is not None
    s = SessionModel(id=uuid.uuid4())
    db.add(s)
    db.commit()
    return {"session_id": s.id}
