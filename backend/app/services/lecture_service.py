import json
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

from app.database import get_db
from app.models.schemas import (
    LectureCreateRequest,
    LectureResponse,
    TranscriptResponse,
    TranscriptSegment,
    NotesResponse,
    NoteTopic,
    SearchResponse,
    SearchResultItem,
)
from app.services.mock_data import generate_mock_transcript, generate_mock_notes

class LectureService:
    @staticmethod
    def create_lecture(lecture_in: LectureCreateRequest) -> LectureResponse:
        lecture_id = f"lec_{uuid.uuid4().hex[:12]}"
        now_iso = datetime.now(timezone.utc).isoformat()
        duration = lecture_in.duration if lecture_in.duration else "45 mins"

        transcript_data = generate_mock_transcript(lecture_in.title, lecture_in.course_name or "")
        notes_data = generate_mock_notes(lecture_in.title, lecture_in.course_name or "")

        with get_db() as conn:
            cursor = conn.cursor()
            
            # Insert lecture record
            cursor.execute(
                """
                INSERT INTO lectures (id, title, course_name, description, duration, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    lecture_id,
                    lecture_in.title,
                    lecture_in.course_name,
                    lecture_in.description,
                    duration,
                    "completed",
                    now_iso
                )
            )

            # Insert transcript record
            cursor.execute(
                """
                INSERT INTO transcripts (id, lecture_id, full_text, segments_json)
                VALUES (?, ?, ?, ?)
                """,
                (
                    f"tr_{uuid.uuid4().hex[:12]}",
                    lecture_id,
                    transcript_data["full_text"],
                    json.dumps(transcript_data["segments"])
                )
            )

            # Insert notes record
            cursor.execute(
                """
                INSERT INTO notes (id, lecture_id, summary, key_points_json, action_items_json, topics_json)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    f"nt_{uuid.uuid4().hex[:12]}",
                    lecture_id,
                    notes_data["summary"],
                    json.dumps(notes_data["key_points"]),
                    json.dumps(notes_data["action_items"]),
                    json.dumps(notes_data["topics"])
                )
            )

        return LectureResponse(
            id=lecture_id,
            title=lecture_in.title,
            course_name=lecture_in.course_name,
            description=lecture_in.description,
            duration=duration,
            status="completed",
            created_at=now_iso
        )

    @staticmethod
    def list_lectures() -> List[LectureResponse]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM lectures ORDER BY created_at DESC")
            rows = cursor.fetchall()
            return [
                LectureResponse(
                    id=row["id"],
                    title=row["title"],
                    course_name=row["course_name"],
                    description=row["description"],
                    duration=row["duration"],
                    status=row["status"],
                    created_at=row["created_at"]
                )
                for row in rows
            ]

    @staticmethod
    def get_lecture(lecture_id: str) -> Optional[LectureResponse]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM lectures WHERE id = ?", (lecture_id,))
            row = cursor.fetchone()
            if not row:
                return None
            return LectureResponse(
                id=row["id"],
                title=row["title"],
                course_name=row["course_name"],
                description=row["description"],
                duration=row["duration"],
                status=row["status"],
                created_at=row["created_at"]
            )

    @staticmethod
    def get_transcript(lecture_id: str) -> Optional[TranscriptResponse]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT t.lecture_id, t.full_text, t.segments_json, l.title
                FROM transcripts t
                JOIN lectures l ON l.id = t.lecture_id
                WHERE t.lecture_id = ?
            """, (lecture_id,))
            row = cursor.fetchone()
            if not row:
                return None
            
            raw_segments = json.loads(row["segments_json"])
            segments = [TranscriptSegment(**seg) for seg in raw_segments]

            return TranscriptResponse(
                lecture_id=row["lecture_id"],
                title=row["title"],
                full_text=row["full_text"],
                segments=segments
            )

    @staticmethod
    def get_notes(lecture_id: str) -> Optional[NotesResponse]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT n.lecture_id, n.summary, n.key_points_json, n.action_items_json, n.topics_json, l.title
                FROM notes n
                JOIN lectures l ON l.id = n.lecture_id
                WHERE n.lecture_id = ?
            """, (lecture_id,))
            row = cursor.fetchone()
            if not row:
                return None

            key_points = json.loads(row["key_points_json"])
            action_items = json.loads(row["action_items_json"])
            topics_raw = json.loads(row["topics_json"])
            topics = [NoteTopic(**t) for t in topics_raw]

            return NotesResponse(
                lecture_id=row["lecture_id"],
                title=row["title"],
                summary=row["summary"],
                key_points=key_points,
                action_items=action_items,
                topics=topics
            )

    @staticmethod
    def search_lecture(lecture_id: str, query: str) -> Optional[SearchResponse]:
        lecture = LectureService.get_lecture(lecture_id)
        if not lecture:
            return None

        clean_query = query.strip().lower()
        results: List[SearchResultItem] = []

        if not clean_query:
            return SearchResponse(
                lecture_id=lecture_id,
                query=query,
                total_results=0,
                results=[]
            )

        # 1. Search transcript segments
        transcript = LectureService.get_transcript(lecture_id)
        if transcript:
            for seg in transcript.segments:
                if clean_query in seg.text.lower():
                    results.append(
                        SearchResultItem(
                            type="transcript",
                            source=f"Transcript ({seg.start_time})",
                            text=seg.text,
                            timestamp=seg.start_time,
                            speaker=seg.speaker
                        )
                    )

        # 2. Search notes
        notes = LectureService.get_notes(lecture_id)
        if notes:
            # Check summary
            if clean_query in notes.summary.lower():
                results.append(
                    SearchResultItem(
                        type="note",
                        source="Summary",
                        text=notes.summary
                    )
                )

            # Check key points
            for kp in notes.key_points:
                if clean_query in kp.lower():
                    results.append(
                        SearchResultItem(
                            type="note",
                            source="Key Points",
                            text=kp
                        )
                    )

            # Check action items
            for ai in notes.action_items:
                if clean_query in ai.lower():
                    results.append(
                        SearchResultItem(
                            type="note",
                            source="Action Items",
                            text=ai
                        )
                    )

            # Check topics
            for topic in notes.topics:
                if clean_query in topic.title.lower() or clean_query in topic.content.lower():
                    results.append(
                        SearchResultItem(
                            type="note",
                            source=f"Topic: {topic.title}",
                            text=topic.content
                        )
                    )

        return SearchResponse(
            lecture_id=lecture_id,
            query=query,
            total_results=len(results),
            results=results
        )

    @staticmethod
    def seed_initial_lecture_if_needed():
        """Seeds a sample lecture if none exists so frontend works instantly."""
        lectures = LectureService.list_lectures()
        if not lectures:
            sample = LectureCreateRequest(
                title="Accessible Computing & Audio Transcription Architectures",
                course_name="CS450: Assistive Technology",
                description="Overview of real-time speech transcription, accessibility standards, and semantic indexing.",
                duration="45 mins"
            )
            LectureService.create_lecture(sample)
