# HearNote Backend API Contract

This document provides the complete API specification for the **HearNote** backend so frontend developers can easily integrate and test endpoints.

---

## 🌐 Base URL & Interactive Docs

| Environment | Base URL |
| :--- | :--- |
| **Local Development** | `http://127.0.0.1:8000` or `http://localhost:8000` |
| **Swagger UI (Interactive Docs)** | `http://127.0.0.1:8000/docs` |
| **ReDoc Specification** | `http://127.0.0.1:8000/redoc` |

- **CORS**: Fully enabled for local frontend development (including Vite on `localhost:5173` and Next.js on `localhost:3000`).
- **Content-Type**: `application/json`

---

## 📡 Endpoints Overview

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | `200 OK` |
| `POST` | `/api/lectures` | Create new lecture (auto-generates transcript & notes) | `201 Created` |
| `GET` | `/api/lectures` | List all lectures | `200 OK` |
| `GET` | `/api/lectures/{lecture_id}` | Get metadata for a specific lecture | `200 OK` / `404 Not Found` |
| `GET` | `/api/lectures/{lecture_id}/transcript` | Get full transcript and timestamped speech segments | `200 OK` / `404 Not Found` |
| `GET` | `/api/lectures/{lecture_id}/notes` | Get AI summary, key points, topics, & action items | `200 OK` / `404 Not Found` |
| `GET` | `/api/lectures/{lecture_id}/search?q=` | Search keyword in transcript and AI notes | `200 OK` / `404 Not Found` |

---

## 📋 Endpoint Details & Payloads

### 1. Health Check
Checks if the backend server is running and database is reachable.

- **Method**: `GET`
- **Path**: `/api/health`
- **Response (200 OK)**:
```json
{
  "status": "healthy",
  "service": "HearNote API",
  "version": "0.1.0",
  "timestamp": "2026-09-20T07:35:00.123456+00:00"
}
```

---

### 2. Create Lecture
Uploads/creates a new lecture. In this mock stage, creating a lecture will automatically seed high-quality realistic transcripts and AI notes into the SQLite database.

- **Method**: `POST`
- **Path**: `/api/lectures`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "Introduction to Neural Networks & Speech Recognition",
  "course_name": "CS482: Audio Machine Learning",
  "description": "Foundations of speech feature extraction, spectrograms, and acoustic models.",
  "duration": "45 mins"
}
```
*Note: `course_name`, `description`, and `duration` are optional.*

- **Response (201 Created)**:
```json
{
  "id": "lec_a1b2c3d4e5f6",
  "title": "Introduction to Neural Networks & Speech Recognition",
  "course_name": "CS482: Audio Machine Learning",
  "description": "Foundations of speech feature extraction, spectrograms, and acoustic models.",
  "duration": "45 mins",
  "status": "completed",
  "created_at": "2026-09-20T07:35:10.551234+00:00"
}
```

---

### 3. List Lectures
Returns all lectures saved in the database, ordered from newest to oldest.

- **Method**: `GET`
- **Path**: `/api/lectures`
- **Response (200 OK)**:
```json
[
  {
    "id": "lec_a1b2c3d4e5f6",
    "title": "Introduction to Neural Networks & Speech Recognition",
    "course_name": "CS482: Audio Machine Learning",
    "description": "Foundations of speech feature extraction, spectrograms, and acoustic models.",
    "duration": "45 mins",
    "status": "completed",
    "created_at": "2026-09-20T07:35:10.551234+00:00"
  }
]
```

---

### 4. Get Lecture Details
Fetches metadata for a single lecture.

- **Method**: `GET`
- **Path**: `/api/lectures/{lecture_id}`
- **Response (200 OK)**:
```json
{
  "id": "lec_a1b2c3d4e5f6",
  "title": "Introduction to Neural Networks & Speech Recognition",
  "course_name": "CS482: Audio Machine Learning",
  "description": "Foundations of speech feature extraction, spectrograms, and acoustic models.",
  "duration": "45 mins",
  "status": "completed",
  "created_at": "2026-09-20T07:35:10.551234+00:00"
}
```
- **Error Response (404 Not Found)**:
```json
{
  "detail": "Lecture with ID 'lec_invalid' not found."
}
```

---

### 5. Get Lecture Transcript
Retrieves the full spoken transcript and timestamped chunks for media sync / clickable audio playback.

- **Method**: `GET`
- **Path**: `/api/lectures/{lecture_id}/transcript`
- **Response (200 OK)**:
```json
{
  "lecture_id": "lec_a1b2c3d4e5f6",
  "title": "Introduction to Neural Networks & Speech Recognition",
  "full_text": "Good morning everyone, and welcome to today's session...",
  "segments": [
    {
      "id": 1,
      "start_time": "00:00:05",
      "end_time": "00:00:32",
      "speaker": "Prof. Alexander",
      "text": "Good morning everyone, and welcome to today's session on Introduction to Neural Networks..."
    },
    {
      "id": 2,
      "start_time": "00:00:35",
      "end_time": "00:01:15",
      "speaker": "Prof. Alexander",
      "text": "When we look at real-world systems, one of the biggest challenges..."
    },
    {
      "id": 3,
      "start_time": "00:01:18",
      "end_time": "00:01:42",
      "speaker": "Student (Sarah)",
      "text": "Professor, could you clarify whether latency or bandwidth constraints play a bigger role?"
    }
  ]
}
```

---

### 6. Get Lecture AI Notes
Retrieves structured notes generated from the lecture, ideal for flashcards, study guides, and summaries.

- **Method**: `GET`
- **Path**: `/api/lectures/{lecture_id}/notes`
- **Response (200 OK)**:
```json
{
  "lecture_id": "lec_a1b2c3d4e5f6",
  "title": "Introduction to Neural Networks & Speech Recognition",
  "summary": "This lecture covered foundational principles of 'Introduction to Neural Networks & Speech Recognition'...",
  "key_points": [
    "Latency is typically the primary bottleneck over bandwidth in distributed systems.",
    "Asynchronous message passing and caching provide effective decoupling.",
    "Fault tolerance requires graceful degradation to prevent cascading cluster failures."
  ],
  "action_items": [
    "Implement retry mechanism with exponential backoff and jitter for the lab assignment.",
    "Review asynchronous pipeline diagrams in chapter 4 before Wednesday's session.",
    "Submit lab code repository link by Thursday 11:59 PM."
  ],
  "topics": [
    {
      "title": "System Latency & Asynchronous Pipelines",
      "content": "Detailed discussion on how latency impacts pipeline throughput and how decoupling with asynchronous queues preserves responsiveness."
    },
    {
      "title": "Fault Tolerance & Graceful Degradation",
      "content": "Designing resilient consumer nodes that handle partial outages without causing system-wide cascading failure."
    }
  ]
}
```

---

### 7. Search Inside Lecture
Full-text search inside both the transcript segments and the AI study notes for a specific lecture.

- **Method**: `GET`
- **Path**: `/api/lectures/{lecture_id}/search?q={query}`
- **Query Parameter**: `q` (required, string)
- **Response (200 OK)**:
```json
{
  "lecture_id": "lec_a1b2c3d4e5f6",
  "query": "latency",
  "total_results": 2,
  "results": [
    {
      "type": "transcript",
      "source": "Transcript (00:01:18)",
      "text": "Professor, could you clarify whether latency or bandwidth constraints play a bigger role in that bottleneck?",
      "timestamp": "00:01:18",
      "speaker": "Student (Sarah)"
    },
    {
      "type": "note",
      "source": "Key Points",
      "text": "Latency is typically the primary bottleneck over bandwidth in distributed systems.",
      "timestamp": null,
      "speaker": null
    }
  ]
}
```

---

## 💻 Frontend Code Integration Examples

### JavaScript / TypeScript `fetch`

```typescript
const BASE_URL = 'http://127.0.0.1:8000';

// 1. Fetch all lectures
export async function getLectures() {
  const res = await fetch(`${BASE_URL}/api/lectures`);
  if (!res.ok) throw new Error('Failed to load lectures');
  return res.json();
}

// 2. Fetch transcript
export async function getTranscript(lectureId: string) {
  const res = await fetch(`${BASE_URL}/api/lectures/${lectureId}/transcript`);
  if (!res.ok) throw new Error('Transcript not found');
  return res.json();
}

// 3. Search within lecture
export async function searchLecture(lectureId: string, query: string) {
  const res = await fetch(`${BASE_URL}/api/lectures/${lectureId}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}
```

---

## ⚠️ Standard Error Responses

- **400 Bad Request**: Invalid parameters or query format.
- **404 Not Found**:
```json
{
  "detail": "Lecture with ID '...' not found."
}
```
- **422 Validation Error**:
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```
