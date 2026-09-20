from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.config import APP_TITLE, APP_DESCRIPTION, APP_VERSION, CORS_ORIGINS
from app.database import init_db
from app.routers import health_router, lectures_router
from app.services.lecture_service import LectureService

# Initialize database tables on load
init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed initial lecture if needed
    init_db()
    LectureService.seed_initial_lecture_if_needed()
    yield
    # Shutdown: clean up if required

app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(lectures_router)

@app.get("/", include_in_schema=False)
def root():
    """Redirect root to OpenAPI docs."""
    return RedirectResponse(url="/docs")
