import sqlite3
import os
import shutil
from contextlib import contextmanager
from app.config import DATABASE_FILE, BASE_DIR, IS_VERCEL

def get_db_connection():
    """Get a SQLite connection configured to return rows as dictionaries."""
    conn = sqlite3.connect(DATABASE_FILE, timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

@contextmanager
def get_db():
    """Context manager for safe database access with commit and rollback."""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Initialize database tables."""
    db_dir = os.path.dirname(DATABASE_FILE)
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)

    # When on Vercel, copy the bundled seed database to /tmp if it doesn't exist yet
    if IS_VERCEL and not os.path.exists(DATABASE_FILE):
        seed_db = BASE_DIR / "hearnote.db"
        if seed_db.exists():
            try:
                shutil.copyfile(str(seed_db), DATABASE_FILE)
                os.chmod(DATABASE_FILE, 0o666)
            except Exception as e:
                print(f"Notice: Could not copy seed db to {DATABASE_FILE}: {e}")

    with get_db() as conn:
        cursor = conn.cursor()
        
        # Lectures table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lectures (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                course_name TEXT,
                description TEXT,
                duration TEXT,
                status TEXT DEFAULT 'completed',
                created_at TEXT NOT NULL
            )
        """)

        # Transcripts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transcripts (
                id TEXT PRIMARY KEY,
                lecture_id TEXT NOT NULL UNIQUE,
                full_text TEXT NOT NULL,
                segments_json TEXT NOT NULL,
                FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE
            )
        """)

        # Notes table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                lecture_id TEXT NOT NULL UNIQUE,
                summary TEXT NOT NULL,
                key_points_json TEXT NOT NULL,
                action_items_json TEXT NOT NULL,
                topics_json TEXT NOT NULL,
                FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE
            )
        """)
