from fastapi import FastAPI

from app.core.config import settings
from app.core.cors import add_cors

from app.api.routes.sessions import router as sessions_router
from app.api.routes.analyses import router as analyses_router
from app.api.routes.history import router as history_router

app = FastAPI(title="Review Analytics API")
add_cors(app, settings.cors_origins)

app.include_router(sessions_router, tags=["sessions"])
app.include_router(analyses_router, tags=["analyses"])
app.include_router(history_router, tags=["history"])


@app.get("/health")
def health():
    return {
        "ok": True,
        "db_mode": settings.db_mode,
        "db_connected": settings.db_mode != "memory",
        "model_name": settings.model_name,
    }
