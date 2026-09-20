import os
from pathlib import Path

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Database configuration
# When running on Vercel, use writable temporary location (/tmp/hearnote.db) while preserving local development
IS_VERCEL = bool(os.getenv("VERCEL") or os.getenv("VERCEL_ENV"))
DEFAULT_DB_FILE = "/tmp/hearnote.db" if IS_VERCEL else str(BASE_DIR / "hearnote.db")
DATABASE_FILE = os.getenv("DATABASE_FILE", DEFAULT_DB_FILE)

# Application configuration
APP_TITLE = "HearNote API"
APP_DESCRIPTION = "Accessible Lecture Transcription & AI Note Generator Backend"
APP_VERSION = "0.1.0"

# CORS configuration - allow local frontend development origins
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:8001",
    "http://127.0.0.1:8001",
]
