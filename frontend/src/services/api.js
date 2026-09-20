import { INITIAL_LECTURES } from '../data/mockData';

// Backend configuration via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';
const FORCE_MOCK_ENV = import.meta.env.VITE_USE_MOCK === 'true';
const STORAGE_KEY = 'hearnote_lectures_v1';

// In-memory API connection state
let lastConnectionStatus = {
  isOnline: null,
  lastChecked: null,
  error: null,
};

/**
 * Check if mock mode is forced via environment variable
 */
export function isMockMode() {
  return FORCE_MOCK_ENV;
}

/**
 * Get current cached connection status
 */
export function getConnectionStatus() {
  return lastConnectionStatus;
}

// Local mock storage helpers
export function getStoredLectures() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LECTURES));
      return INITIAL_LECTURES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[HearNote] LocalStorage error, falling back to initial mock lectures:', err);
    return INITIAL_LECTURES;
  }
}

export function saveStoredLectures(lectures) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lectures));
  } catch (err) {
    console.error('[HearNote] Failed to save lectures to localStorage:', err);
  }
}

/**
 * Normalize lecture objects so both backend SQLite schema and frontend UI expectations are met
 */
function normalizeLecture(lec) {
  if (!lec) return null;
  const dateStr = lec.date || (lec.created_at ? new Date(lec.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Recent');

  return {
    ...lec,
    date: dateStr,
    notes: lec.notes || {
      summary: lec.description || '',
      keyTopics: lec.course_name ? [lec.course_name] : []
    }
  };
}

/**
 * 1. Health Check - GET /api/health
 * Checks backend availability and operational status
 */
export async function healthCheck() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      lastConnectionStatus = {
        isOnline: false,
        lastChecked: new Date(),
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
      return { isOnline: false, status: 'error', error: lastConnectionStatus.error };
    }

    const data = await res.json();
    lastConnectionStatus = {
      isOnline: data.status === 'healthy',
      lastChecked: new Date(),
      error: null,
    };
    return { isOnline: true, ...data };
  } catch (err) {
    lastConnectionStatus = {
      isOnline: false,
      lastChecked: new Date(),
      error: err.name === 'AbortError' ? 'Connection timed out' : (err.message || 'Backend unreachable'),
    };
    return { isOnline: false, status: 'offline', error: lastConnectionStatus.error };
  }
}

/**
 * 2. List Lectures - GET /api/lectures
 */
export async function getLectures(filter = 'all') {
  if (FORCE_MOCK_ENV) {
    return filterMockLectures(getStoredLectures(), filter);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/lectures`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Failed to load lectures from backend (HTTP ${res.status})`);
    }

    const data = await res.json();
    lastConnectionStatus.isOnline = true;
    lastConnectionStatus.error = null;

    let normalized = (data || []).map(normalizeLecture);

    // Apply client-side filtering if requested
    if (filter === 'recent') {
      // Backend already returns newest first, but ensure consistent sorting
      return normalized;
    }
    if (filter === 'longest') {
      return [...normalized].sort((a, b) => {
        const durA = parseInt(a.duration, 10) || 0;
        const durB = parseInt(b.duration, 10) || 0;
        return durB - durA;
      });
    }

    return normalized;
  } catch (err) {
    console.warn(`[HearNote API] GET /api/lectures failed (${err.message}). Using mock fallback for resilience.`);
    lastConnectionStatus.isOnline = false;
    lastConnectionStatus.error = err.message;
    
    // Provide fallback with metadata indicator
    const fallback = filterMockLectures(getStoredLectures(), filter);
    fallback._isFallback = true;
    fallback._errorMessage = err.message;
    return fallback;
  }
}

function filterMockLectures(lectures, filter) {
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

/**
 * 3. Get Lecture Details - GET /api/lectures/{lecture_id}
 */
export async function getLecture(lectureId) {
  if (FORCE_MOCK_ENV) {
    const mock = getStoredLectures().find((l) => l.id === lectureId);
    return mock ? normalizeLecture(mock) : null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/lectures/${lectureId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch lecture ${lectureId} (HTTP ${res.status})`);
    }

    const data = await res.json();
    return normalizeLecture(data);
  } catch (err) {
    console.warn(`[HearNote API] GET /api/lectures/${lectureId} failed (${err.message}). Checking mock store.`);
    const mock = getStoredLectures().find((l) => l.id === lectureId);
    if (mock) {
      const normalizedMock = normalizeLecture(mock);
      normalizedMock._isFallback = true;
      return normalizedMock;
    }
    throw err;
  }
}

/**
 * 4. Get Lecture Transcript - GET /api/lectures/{lecture_id}/transcript
 */
export async function getTranscript(lectureId) {
  if (FORCE_MOCK_ENV) {
    const lec = getStoredLectures().find((l) => l.id === lectureId);
    return normalizeTranscriptResponse(lec ? lec.transcript : []);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/lectures/${lectureId}/transcript`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.status === 404) {
      return normalizeTranscriptResponse([]);
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch transcript for ${lectureId} (HTTP ${res.status})`);
    }

    const data = await res.json();
    return normalizeTranscriptResponse(data);
  } catch (err) {
    console.warn(`[HearNote API] GET /api/lectures/${lectureId}/transcript failed (${err.message}). Using mock fallback.`);
    const lec = getStoredLectures().find((l) => l.id === lectureId);
    const fallback = normalizeTranscriptResponse(lec ? lec.transcript : []);
    fallback._isFallback = true;
    return fallback;
  }
}

function normalizeTranscriptResponse(raw) {
  let segments = [];
  let fullText = '';
  let lectureId = '';
  let title = '';

  if (Array.isArray(raw)) {
    segments = raw;
  } else if (raw && Array.isArray(raw.segments)) {
    segments = raw.segments;
    fullText = raw.full_text || '';
    lectureId = raw.lecture_id || '';
    title = raw.title || '';
  }

  const normalizedSegments = segments.map((seg, idx) => ({
    id: seg.id ?? idx + 1,
    speaker: seg.speaker || 'Instructor',
    text: seg.text || '',
    timestamp: seg.timestamp || seg.start_time || '00:00',
    start_time: seg.start_time || seg.timestamp || '00:00',
    end_time: seg.end_time || '',
    confidence: seg.confidence ?? 0.98,
  }));

  // Return hybrid array that also contains transcript metadata
  const result = Object.assign([...normalizedSegments], {
    lecture_id: lectureId,
    title,
    full_text: fullText,
    segments: normalizedSegments,
  });

  return result;
}

/**
 * 5. Get Lecture AI Notes - GET /api/lectures/{lecture_id}/notes
 */
export async function getNotes(lectureId) {
  if (FORCE_MOCK_ENV) {
    const lec = getStoredLectures().find((l) => l.id === lectureId);
    return lec ? lec.notes : null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/lectures/${lectureId}/notes`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch AI notes for ${lectureId} (HTTP ${res.status})`);
    }

    const data = await res.json();
    return normalizeNotesResponse(data);
  } catch (err) {
    console.warn(`[HearNote API] GET /api/lectures/${lectureId}/notes failed (${err.message}). Using mock fallback.`);
    const lec = getStoredLectures().find((l) => l.id === lectureId);
    if (lec && lec.notes) {
      return { ...lec.notes, _isFallback: true };
    }
    throw err;
  }
}

function normalizeNotesResponse(data) {
  if (!data) return null;

  // Adapt backend schema ({ lecture_id, title, summary, key_points, action_items, topics })
  // to frontend NotesPanel expectations ({ summary, keyTopics, keyPoints, definitions, questions })
  const topicsList = data.topics || [];
  const keyTopics = topicsList.map((t) => (typeof t === 'string' ? t : t.title));
  const definitions = topicsList.map((t) => ({
    term: typeof t === 'string' ? t : t.title,
    definition: typeof t === 'string' ? '' : t.content,
  }));

  return {
    lecture_id: data.lecture_id,
    title: data.title,
    summary: data.summary || '',
    keyTopics: keyTopics.length > 0 ? keyTopics : (data.keyTopics || []),
    keyPoints: data.key_points || data.keyPoints || [],
    definitions: definitions.length > 0 ? definitions : (data.definitions || []),
    questions: data.action_items || data.questions || [],
    action_items: data.action_items || [],
    topics: topicsList,
  };
}

/**
 * 6. Search Inside Lecture - GET /api/lectures/{lecture_id}/search?q={query}
 */
export async function searchLecture(lectureId, query) {
  if (!query || !query.trim()) {
    return { lecture_id: lectureId, query: '', total_results: 0, results: [] };
  }

  if (FORCE_MOCK_ENV) {
    return searchMockLecture(lectureId, query);
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/lectures/${lectureId}/search?q=${encodeURIComponent(query.trim())}`,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!res.ok) {
      throw new Error(`Search request failed (HTTP ${res.status})`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[HearNote API] GET /api/lectures/${lectureId}/search failed (${err.message}). Using local search fallback.`);
    return searchMockLecture(lectureId, query);
  }
}

function searchMockLecture(lectureId, query) {
  const lec = getStoredLectures().find((l) => l.id === lectureId);
  if (!lec) return { lecture_id: lectureId, query, total_results: 0, results: [] };

  const q = query.toLowerCase();
  const results = [];

  if (lec.transcript) {
    lec.transcript.forEach((seg) => {
      if (seg.text && seg.text.toLowerCase().includes(q)) {
        results.push({
          type: 'transcript',
          source: `Transcript (${seg.timestamp || '00:00'})`,
          text: seg.text,
          timestamp: seg.timestamp || '00:00',
          speaker: seg.speaker || 'Speaker',
        });
      }
    });
  }

  if (lec.notes) {
    if (lec.notes.summary && lec.notes.summary.toLowerCase().includes(q)) {
      results.push({
        type: 'note',
        source: 'Summary',
        text: lec.notes.summary,
        timestamp: null,
        speaker: null,
      });
    }
    (lec.notes.keyPoints || []).forEach((kp) => {
      if (kp.toLowerCase().includes(q)) {
        results.push({
          type: 'note',
          source: 'Key Points',
          text: kp,
          timestamp: null,
          speaker: null,
        });
      }
    });
  }

  return {
    lecture_id: lectureId,
    query,
    total_results: results.length,
    results,
    _isFallback: true,
  };
}

/**
 * 7. Create Lecture - POST /api/lectures
 */
export async function createLecture(lectureData) {
  // Map to backend LectureCreateRequest model { title, course_name, description, duration }
  const payload = {
    title: lectureData.title || 'Untitled Classroom Lecture',
    course_name: lectureData.course_name || 'General Course',
    description: lectureData.description || (lectureData.notes?.summary || 'Interactive lecture session'),
    duration: lectureData.duration || '45 mins',
  };

  if (FORCE_MOCK_ENV) {
    const lectures = getStoredLectures();
    const newLecture = {
      id: `lec-${Date.now()}`,
      title: payload.title,
      course_name: payload.course_name,
      description: payload.description,
      duration: payload.duration,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      transcript: lectureData.transcript || [],
      notes: lectureData.notes || {
        summary: payload.description,
        keyTopics: [payload.course_name],
        keyPoints: [],
        definitions: [],
        questions: [],
      },
    };
    saveStoredLectures([newLecture, ...lectures]);
    return newLecture;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/lectures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to create lecture on backend (HTTP ${res.status})`);
    }

    const created = await res.json();
    lastConnectionStatus.isOnline = true;
    lastConnectionStatus.error = null;

    // Cache locally as well for offline resilience
    const lectures = getStoredLectures();
    saveStoredLectures([normalizeLecture(created), ...lectures]);

    return normalizeLecture(created);
  } catch (err) {
    console.warn(`[HearNote API] POST /api/lectures failed (${err.message}). Saving to local mock storage.`);
    lastConnectionStatus.isOnline = false;
    lastConnectionStatus.error = err.message;

    const lectures = getStoredLectures();
    const newLecture = {
      id: `lec-offline-${Date.now()}`,
      title: payload.title,
      course_name: payload.course_name,
      description: payload.description,
      duration: payload.duration,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      transcript: lectureData.transcript || [],
      notes: lectureData.notes || {
        summary: payload.description,
        keyTopics: [payload.course_name],
        keyPoints: [],
        definitions: [],
        questions: [],
      },
      _isFallback: true,
    };
    saveStoredLectures([newLecture, ...lectures]);
    return newLecture;
  }
}

/**
 * 8. Update transcript segment (in-memory / local storage persistence)
 */
export async function updateTranscript(lectureId, segmentId, newText) {
  const lectures = getStoredLectures();
  const lecIndex = lectures.findIndex((l) => l.id === lectureId);
  if (lecIndex === -1) return null;

  const segIndex = lectures[lecIndex].transcript?.findIndex((s) => s.id === segmentId);
  if (segIndex !== undefined && segIndex !== -1) {
    lectures[lecIndex].transcript[segIndex].text = newText;
    saveStoredLectures(lectures);
    return lectures[lecIndex].transcript[segIndex];
  }
  return null;
}

/**
 * 9. Update structured notes
 */
export async function updateNotes(lectureId, notesData) {
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

/**
 * 10. Delete a lecture by ID
 */
export async function deleteLecture(id) {
  const lectures = getStoredLectures();
  const filtered = lectures.filter((l) => l.id !== id);
  saveStoredLectures(filtered);
  return { success: true, id };
}

/**
 * 11. Legacy search alias for transcript
 */
export async function searchTranscript(lectureId, query) {
  return searchLecture(lectureId, query);
}
