from typing import List, Optional
from pydantic import BaseModel, Field

# Health Check Model
class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="API operational status")
    service: str = Field(default="HearNote API", description="Service identifier")
    version: str = Field(default="0.1.0", description="API version")
    timestamp: str = Field(..., description="Current server time (ISO 8601)")

# Lecture Models
class LectureCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Title of the lecture")
    course_name: Optional[str] = Field(None, max_length=150, description="Course or subject name (e.g., CS101)")
    description: Optional[str] = Field(None, max_length=1000, description="Brief description of the lecture topic")
    duration: Optional[str] = Field(None, max_length=50, description="Estimated lecture duration (e.g., '45 mins')")

class LectureResponse(BaseModel):
    id: str
    title: str
    course_name: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    status: str = "completed"
    created_at: str

    class Config:
        from_attributes = True

# Transcript Models
class TranscriptSegment(BaseModel):
    id: int
    start_time: str = Field(..., description="Start timestamp in HH:MM:SS format")
    end_time: str = Field(..., description="End timestamp in HH:MM:SS format")
    speaker: str = Field(default="Instructor", description="Speaker identity tag")
    text: str = Field(..., description="Transcribed spoken text")

class TranscriptResponse(BaseModel):
    lecture_id: str
    title: str
    full_text: str
    segments: List[TranscriptSegment]

# AI Notes Models
class NoteTopic(BaseModel):
    title: str
    content: str

class NotesResponse(BaseModel):
    lecture_id: str
    title: str
    summary: str
    key_points: List[str]
    action_items: List[str]
    topics: List[NoteTopic]

# Search Models
class SearchResultItem(BaseModel):
    type: str = Field(..., description="'transcript' or 'note'")
    source: str = Field(..., description="Source location description")
    text: str = Field(..., description="Matching text or snippet")
    timestamp: Optional[str] = Field(None, description="Audio timestamp if matched in transcript")
    speaker: Optional[str] = Field(None, description="Speaker name if matched in transcript")

class SearchResponse(BaseModel):
    lecture_id: str
    query: str
    total_results: int
    results: List[SearchResultItem]
