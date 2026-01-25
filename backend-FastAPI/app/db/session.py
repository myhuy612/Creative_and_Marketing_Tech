from typing import Generator, Optional

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

engine = None
SessionLocal = None

if settings.db_mode != "memory":
    if not settings.database_url:
        raise RuntimeError("DATABASE_URL is required when DB_MODE is postgres.")
    engine = create_engine(settings.database_url, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Optional[Session], None, None]:
    # memory mode: no DB session
    if settings.db_mode == "memory":
        yield None
        return

    assert SessionLocal is not None
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
