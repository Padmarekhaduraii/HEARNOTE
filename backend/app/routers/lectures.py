from typing import List
from fastapi import APIRouter, HTTPException, Query, status

from app.models.schemas import (
    LectureCreateRequest,
    LectureResponse,
    TranscriptResponse,
    NotesResponse,
    SearchResponse,
)
from app.services.lecture_service import LectureService

router = APIRouter(prefix="/api/lectures", tags=["Lectures"])

@router.post(
    "",
    response_model=LectureResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Lecture",
    description="Creates a new lecture record and automatically prepares mock transcript segments and AI study notes."
)
def create_lecture(payload: LectureCreateRequest) -> LectureResponse:
    lecture = LectureService.create_lecture(payload)
    return lecture

@router.get(
    "",
    response_model=List[LectureResponse],
    summary="List Lectures",
    description="Returns all lectures ordered chronologically with newest first."
)
def list_lectures() -> List[LectureResponse]:
    return LectureService.list_lectures()

@router.get(
    "/{lecture_id}",
    response_model=LectureResponse,
    summary="Get Lecture Details",
    description="Retrieves metadata for a specific lecture."
)
def get_lecture(lecture_id: str) -> LectureResponse:
    lecture = LectureService.get_lecture(lecture_id)
    if not lecture:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lecture with ID '{lecture_id}' not found."
        )
    return lecture

@router.get(
    "/{lecture_id}/transcript",
    response_model=TranscriptResponse,
    summary="Get Lecture Transcript",
    description="Returns full transcript text along with timestamped speech segments."
)
def get_transcript(lecture_id: str) -> TranscriptResponse:
    transcript = LectureService.get_transcript(lecture_id)
    if not transcript:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transcript for lecture ID '{lecture_id}' not found."
        )
    return transcript

@router.get(
    "/{lecture_id}/notes",
    response_model=NotesResponse,
    summary="Get Lecture AI Notes",
    description="Returns AI-generated structured notes, summaries, topics, and action items."
)
def get_notes(lecture_id: str) -> NotesResponse:
    notes = LectureService.get_notes(lecture_id)
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notes for lecture ID '{lecture_id}' not found."
        )
    return notes

@router.get(
    "/{lecture_id}/search",
    response_model=SearchResponse,
    summary="Search Inside Lecture",
    description="Searches within the transcript and notes of a specific lecture for a keyword query."
)
def search_lecture(
    lecture_id: str,
    q: str = Query(..., min_length=1, description="Search query term")
) -> SearchResponse:
    search_result = LectureService.search_lecture(lecture_id, q)
    if search_result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lecture with ID '{lecture_id}' not found."
        )
    return search_result
