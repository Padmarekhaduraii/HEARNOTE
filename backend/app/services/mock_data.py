from typing import Dict, Any, List

def generate_mock_transcript(title: str, course_name: str = "") -> Dict[str, Any]:
    """
    Generates realistic transcript segments and full text for an accessible lecture.
    """
    subject = course_name if course_name else "Applied Computer Science"
    
    segments = [
        {
            "id": 1,
            "start_time": "00:00:05",
            "end_time": "00:00:32",
            "speaker": "Prof. Alexander",
            "text": f"Good morning everyone, and welcome to today's session on {title} as part of {subject}. Before we dive into the core mechanics, let's establish why this matters."
        },
        {
            "id": 2,
            "start_time": "00:00:35",
            "end_time": "00:01:15",
            "speaker": "Prof. Alexander",
            "text": "When we look at real-world systems, one of the biggest challenges is breaking down complex data flows into modular, accessible components. Notice how traditional approaches struggle with scalability."
        },
        {
            "id": 3,
            "start_time": "00:01:18",
            "end_time": "00:01:42",
            "speaker": "Student (Sarah)",
            "text": "Professor, could you clarify whether latency or bandwidth constraints play a bigger role in that bottleneck?"
        },
        {
            "id": 4,
            "start_time": "00:01:45",
            "end_time": "00:02:30",
            "speaker": "Prof. Alexander",
            "text": "Great question, Sarah. In distributed environments, latency is typically the dominant factor. That's why asynchronous pipelines and caching layers become indispensable design patterns."
        },
        {
            "id": 5,
            "start_time": "00:02:35",
            "end_time": "00:03:10",
            "speaker": "Prof. Alexander",
            "text": "Next, let's focus on fault tolerance. If one node fails, the downstream consumers must gracefully degrade rather than crashing the whole cluster."
        },
        {
            "id": 6,
            "start_time": "00:03:15",
            "end_time": "00:03:55",
            "speaker": "Prof. Alexander",
            "text": "For your homework assignment due this Thursday: implement the retry logic with exponential backoff and jitter. We'll run automated stress tests during Friday's lab."
        },
        {
            "id": 7,
            "start_time": "00:04:00",
            "end_time": "00:04:30",
            "speaker": "Prof. Alexander",
            "text": "To wrap up today's lecture: remember that accessibility and clean abstractions are foundational. See you all on Wednesday!"
        }
    ]

    full_text = " ".join([seg["text"] for seg in segments])

    return {
        "full_text": full_text,
        "segments": segments
    }

def generate_mock_notes(title: str, course_name: str = "") -> Dict[str, Any]:
    """
    Generates structured AI-powered study notes including summary, key points, topics, and action items.
    """
    subject = course_name if course_name else "Core Curriculum"
    
    summary = (
        f"This lecture covered foundational principles of '{title}' within {subject}. "
        "The instructor emphasized modular architecture, latency management in asynchronous pipelines, "
        "and critical fault-tolerance strategies such as exponential backoff with jitter."
    )

    key_points = [
        "Latency is typically the primary bottleneck over bandwidth in distributed systems.",
        "Asynchronous message passing and caching provide effective decoupling of high-throughput services.",
        "Fault tolerance requires graceful degradation to prevent cascading cluster failures.",
        "Exponential backoff combined with jitter mitigates the thundering herd problem during recovery."
    ]

    action_items = [
        "Implement retry mechanism with exponential backoff and jitter for the lab assignment.",
        "Review asynchronous pipeline diagrams in chapter 4 before Wednesday's session.",
        "Submit lab code repository link by Thursday 11:59 PM."
    ]

    topics = [
        {
            "title": "System Latency & Asynchronous Pipelines",
            "content": "Detailed discussion on how latency impacts pipeline throughput and how decoupling with asynchronous queues preserves responsiveness."
        },
        {
            "title": "Fault Tolerance & Graceful Degradation",
            "content": "Designing resilient consumer nodes that handle partial outages without causing system-wide cascading failure."
        },
        {
            "title": "Lab Preparation: Backoff & Jitter",
            "content": "Practical implementation requirements for Thursday's homework assignment testing automated failover."
        }
    ]

    return {
        "summary": summary,
        "key_points": key_points,
        "action_items": action_items,
        "topics": topics
    }
