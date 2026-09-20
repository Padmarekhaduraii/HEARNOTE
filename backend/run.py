import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "127.0.0.1")
    reload = os.getenv("RELOAD", "True").lower() in ("true", "1", "yes")

    print(f"🚀 Starting HearNote Backend on http://{host}:{port}")
    print(f"📖 Interactive API Docs available at http://{host}:{port}/docs")
    
    uvicorn.run("app.main:app", host=host, port=port, reload=reload)
