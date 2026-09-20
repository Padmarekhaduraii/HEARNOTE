from datetime import datetime, timezone
from fastapi import APIRouter
from app.config import APP_TITLE, APP_VERSION
from app.models.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health", response_model=HealthResponse, summary="Health Check")
def health_check() -> HealthResponse:
    """
    Returns server operational status and current UTC timestamp.
    """
    return HealthResponse(
        status="healthy",
        service=APP_TITLE,
        version=APP_VERSION,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
