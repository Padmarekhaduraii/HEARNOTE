import sys
from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    with TestClient(app) as client:
        print("Testing HearNote FastAPI Backend Endpoints...")
    
    # 1. GET /api/health
    resp = client.get("/api/health")
    assert resp.status_code == 200, f"Health check failed: {resp.text}"
    health_data = resp.json()
    assert health_data["status"] == "healthy"
    print("  [PASS] 1. GET /api/health ->", health_data)

    # 2. POST /api/lectures
    new_lec = {
        "title": "Deep Learning for Audio Signals",
        "course_name": "CS680",
        "description": "Exploration of CNNs and Transformers for acoustic feature extraction.",
        "duration": "50 mins"
    }
    resp = client.post("/api/lectures", json=new_lec)
    assert resp.status_code == 201, f"Create lecture failed: {resp.text}"
    lec_data = resp.json()
    lec_id = lec_data["id"]
    assert lec_data["title"] == new_lec["title"]
    print(f"  [PASS] 2. POST /api/lectures -> created ID {lec_id}")

    # 3. GET /api/lectures
    resp = client.get("/api/lectures")
    assert resp.status_code == 200
    lectures = resp.json()
    assert len(lectures) >= 1
    print(f"  [PASS] 3. GET /api/lectures -> found {len(lectures)} lectures")

    # 4. GET /api/lectures/{lecture_id}
    resp = client.get(f"/api/lectures/{lec_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == lec_id
    print(f"  [PASS] 4. GET /api/lectures/{lec_id} -> details matched")

    # 5. GET /api/lectures/{lecture_id}/transcript
    resp = client.get(f"/api/lectures/{lec_id}/transcript")
    assert resp.status_code == 200
    trans = resp.json()
    assert "segments" in trans and len(trans["segments"]) > 0
    print(f"  [PASS] 5. GET /api/lectures/{lec_id}/transcript -> {len(trans['segments'])} segments")

    # 6. GET /api/lectures/{lecture_id}/notes
    resp = client.get(f"/api/lectures/{lec_id}/notes")
    assert resp.status_code == 200
    notes = resp.json()
    assert "summary" in notes and "key_points" in notes and "action_items" in notes
    print(f"  [PASS] 6. GET /api/lectures/{lec_id}/notes -> summary and {len(notes['key_points'])} key points")

    # 7. GET /api/lectures/{lecture_id}/search?q=latency
    resp = client.get(f"/api/lectures/{lec_id}/search?q=latency")
    assert resp.status_code == 200
    search_data = resp.json()
    assert search_data["total_results"] > 0
    print(f"  [PASS] 7. GET /api/lectures/{lec_id}/search?q=latency -> {search_data['total_results']} matches")

    # 8. Test 404 on invalid lecture
    resp = client.get("/api/lectures/nonexistent_id")
    assert resp.status_code == 404
    print("  [PASS] 8. 404 Handling verified on nonexistent ID")

    print("\nAll 8 endpoint tests passed successfully!")

if __name__ == "__main__":
    run_tests()
