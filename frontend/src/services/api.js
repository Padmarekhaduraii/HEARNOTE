import { INITIAL_LECTURES } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK_ENV = import.meta.env.VITE_USE_MOCK;
const STORAGE_KEY = 'hearnote_lectures_v1';

// Initialize mock storage if not already present
function getStoredLectures() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LECTURES));
      return INITIAL_LECTURES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage error, falling back to initial lectures', err);
    return INITIAL_LECTURES;
  }
}

function saveStoredLectures(lectures) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lectures));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

// Check if mock mode is explicitly forced or active
export function isMockMode() {
  if (USE_MOCK_ENV === 'false') return false;
  return true; // default to true for standalone hackathon demo
}

// Helper for safe API calls with mock fallback
async function fetchWithFallback(url, options = {}, mockHandler) {
  if (isMockMode()) {
    return mockHandler();
  }

  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[HearNote API] Backend unreachable at ${API_BASE_URL}${url}. Falling back to mock data:`, err.message);
    return mockHandler();
  }
}

/**
 * 1. Create a new lecture
 */
export async function createLecture(lectureData) {
  return fetchWithFallback(
    '/api/lectures',
    {
      method: 'POST',
      body: JSON.stringify(lectureData),
    },
    () => {
      const lectures = getStoredLectures();
      const newLecture = {
        id: lectureData.id || `lec-${Date.now()}`,
        title: lectureData.title || 'Untitled Lecture',
        date: lectureData.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        duration: lectureData.duration || '00:00',
        transcript: lectureData.transcript || [],
        notes: lectureData.notes || {
          summary: '',
          keyTopics: [],
          keyPoints: [],
          definitions: [],
          questions: [],
        },
      };
      const updated = [newLecture, ...lectures];
      saveStoredLectures(updated);
      return newLecture;
    }
  );
}

/**
 * 2. Upload audio recording to backend
 */
export async function uploadAudio(fileOrBlob) {
  if (isMockMode()) {
    return {
      success: true,
      audioUrl: URL.createObjectURL(fileOrBlob),
      message: 'Mock audio uploaded successfully'
    };
  }

  try {
    const formData = new FormData();
    formData.append('audio', fileOrBlob);

    const res = await fetch(`${API_BASE_URL}/api/lectures/audio`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Audio upload failed');
    return await res.json();
  } catch (err) {
    console.warn('[HearNote API] Audio upload failed, falling back to mock mode:', err.message);
    return {
      success: true,
      audioUrl: null,
      message: 'Audio upload mock completed'
    };
  }
}

/**
 * 3. Get transcript for a lecture
 */
export async function getTranscript(lectureId) {
  return fetchWithFallback(
    `/api/lectures/${lectureId}/transcript`,
    { method: 'GET' },
    () => {
      const lectures = getStoredLectures();
      const lec = lectures.find((l) => l.id === lectureId);
      return lec ? lec.transcript : [];
    }
  );
}

/**
 * 4. Get structured AI notes for a lecture
 */
export async function getNotes(lectureId) {
  return fetchWithFallback(
    `/api/lectures/${lectureId}/notes`,
    { method: 'GET' },
    () => {
      const lectures = getStoredLectures();
      const lec = lectures.find((l) => l.id === lectureId);
      return lec ? lec.notes : null;
    }
  );
}

/**
 * 5. Get all lectures with optional filtering
 */
export async function getLectures(filter = 'all') {
  return fetchWithFallback(
    `/api/lectures?filter=${encodeURIComponent(filter)}`,
    { method: 'GET' },
    () => {
      const lectures = getStoredLectures();
      if (filter === 'recent') {
        return [...lectures].reverse();
      }
      if (filter === 'longest') {
        return [...lectures].sort((a, b) => {
          const durA = parseInt(a.duration, 10) || 0;
          const durB = parseInt(b.duration, 10) || 0;
          return durB - durA;
        });
      }
      return lectures;
    }
  );
}

/**
 * 6. Get a single lecture by ID
 */
export async function getLecture(id) {
  return fetchWithFallback(
    `/api/lectures/${id}`,
    { method: 'GET' },
    () => {
      const lectures = getStoredLectures();
      const found = lectures.find((l) => l.id === id);
      return found || null;
    }
  );
}

/**
 * 7. Search transcript within a lecture
 */
export async function searchTranscript(lectureId, query) {
  return fetchWithFallback(
    `/api/lectures/${lectureId}/transcript/search?q=${encodeURIComponent(query)}`,
    { method: 'GET' },
    () => {
      const lectures = getStoredLectures();
      const lec = lectures.find((l) => l.id === lectureId);
      if (!lec) return [];
      if (!query || !query.trim()) return lec.transcript;

      const q = query.toLowerCase();
      return lec.transcript.filter(
        (seg) => seg.text.toLowerCase().includes(q) || seg.speaker.toLowerCase().includes(q)
      );
    }
  );
}

/**
 * 8. Update an edited transcript segment
 */
export async function updateTranscript(lectureId, transcriptId, newText) {
  return fetchWithFallback(
    `/api/lectures/${lectureId}/transcript/${transcriptId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ text: newText }),
    },
    () => {
      const lectures = getStoredLectures();
      const lecIndex = lectures.findIndex((l) => l.id === lectureId);
      if (lecIndex === -1) return null;

      const segIndex = lectures[lecIndex].transcript.findIndex((s) => s.id === transcriptId);
      if (segIndex !== -1) {
        lectures[lecIndex].transcript[segIndex].text = newText;
        saveStoredLectures(lectures);
      }
      return lectures[lecIndex].transcript[segIndex];
    }
  );
}

/**
 * 9. Update structured notes for a lecture
 */
export async function updateNotes(lectureId, notesData) {
  return fetchWithFallback(
    `/api/lectures/${lectureId}/notes`,
    {
      method: 'PUT',
      body: JSON.stringify(notesData),
    },
    () => {
      const lectures = getStoredLectures();
      const lecIndex = lectures.findIndex((l) => l.id === lectureId);
      if (lecIndex === -1) return null;

      lectures[lecIndex].notes = {
        ...lectures[lecIndex].notes,
        ...notesData,
      };
      saveStoredLectures(lectures);
      return lectures[lecIndex].notes;
    }
  );
}

/**
 * 10. Delete a lecture by ID
 */
export async function deleteLecture(id) {
  return fetchWithFallback(
    `/api/lectures/${id}`,
    { method: 'DELETE' },
    () => {
      const lectures = getStoredLectures();
      const filtered = lectures.filter((l) => l.id !== id);
      saveStoredLectures(filtered);
      return { success: true, id };
    }
  );
}
