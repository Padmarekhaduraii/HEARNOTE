import os
from pathlib import Path

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Database configuration
DATABASE_FILE = os.getenv("DATABASE_FILE", str(BASE_DIR / "hearnote.db"))

# Application configuration
APP_TITLE = "HearNote API"
APP_DESCRIPTION = "Accessible Lecture Transcription & AI Note Generator Backend"
APP_VERSION = "0.1.0"

# CORS configuration - allow all for hackathon / local frontend development
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "*"
]
