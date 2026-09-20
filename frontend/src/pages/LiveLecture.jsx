import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Check, ArrowLeft } from 'lucide-react';
import StatusIndicator from '../components/StatusIndicator';
import AudioVisualizer from '../components/AudioVisualizer';
import RecordingControls from '../components/RecordingControls';
import TranscriptPanel from '../components/TranscriptPanel';
import NotesPanel from '../components/NotesPanel';
import EndLectureModal from '../components/EndLectureModal';
import { LIVE_SIMULATION_SCRIPT } from '../data/mockData';
import { createLecture } from '../services/api';

export default function LiveLecture() {
  const navigate = useNavigate();

  // Lecture State
  const [lectureTitle, setLectureTitle] = useState('Introduction to Artificial Intelligence');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [status, setStatus] = useState('IDLE'); // 'IDLE', 'LIVE', 'PAUSED', 'COMPLETED'
  const [seconds, setSeconds] = useState(0);

  // Panels Data
  const [transcript, setTranscript] = useState([]);
  const [notes, setNotes] = useState({
    summary: '',
    keyTopics: [],
    keyPoints: [],
    definitions: [],
    questions: []
  });

  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [newestSegmentId, setNewestSegmentId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState('CONFIRM'); // 'CONFIRM' or 'COMPLETED'
  const [savedLectureId, setSavedLectureId] = useState(null);

  // Simulation step tracking
  const scriptIndexRef = useRef(0);
  const timerIntervalRef = useRef(null);
  const simulationTimeoutRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (status === 'LIVE') {
      timerIntervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status]);

  // Format seconds to HH:MM:SS or MM:SS
  const formatTimer = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  // Helper to schedule next progressive segment
  const scheduleNextSegment = () => {
    if (scriptIndexRef.current >= LIVE_SIMULATION_SCRIPT.length) return;

    const currentItem = LIVE_SIMULATION_SCRIPT[scriptIndexRef.current];
    const delayMs = (currentItem.delaySeconds || 3) * 1000;

    simulationTimeoutRef.current = setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newSegment = {
        id: `live-seg-${Date.now()}-${scriptIndexRef.current}`,
        speaker: currentItem.speaker,
        text: currentItem.text,
        timestamp: timeStr,
        confidence: currentItem.confidence || 0.98
      };

      setTranscript((prev) => [...prev, newSegment]);
      setNewestSegmentId(newSegment.id);

      // If this step provides updated AI notes
      if (currentItem.partialNotes) {
        setIsGeneratingNotes(true);
        setTimeout(() => {
          setNotes(currentItem.partialNotes);
          setIsGeneratingNotes(false);
        }, 600);
      }

      scriptIndexRef.current += 1;

      // Schedule subsequent segment if still live
      scheduleNextSegment();
    }, delayMs);
  };

  // Live Control Handlers
  const handleStart = () => {
    setStatus('LIVE');
    scheduleNextSegment();
  };

  const handlePause = () => {
    setStatus('PAUSED');
    if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current);
  };

  const handleResume = () => {
    setStatus('LIVE');
    scheduleNextSegment();
  };

  const handleStop = () => {
    if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current);
    setModalStage('CONFIRM');
    setIsModalOpen(true);
  };

  const handleContinueLecture = () => {
    setIsModalOpen(false);
    if (status === 'LIVE') {
      scheduleNextSegment();
    }
  };

  // Total words captured calculation
  const wordsCaptured = transcript.reduce(
    (acc, seg) => acc + (seg.text ? seg.text.split(/\s+/).length : 0),
    0
  );

  const topicsCount = notes.keyTopics ? notes.keyTopics.length : 0;

  const handleConfirmEnd = async () => {
    setStatus('COMPLETED');
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current);

    // Prepare lecture payload for backend POST /api/lectures
    const lectureDuration = seconds > 0
      ? `${Math.max(1, Math.round(seconds / 60))} mins`
      : '45 mins';

    const lecturePayload = {
      title: lectureTitle || 'Untitled Lecture',
      course_name: 'Computer Science & AI',
      description: notes.summary || 'Live classroom lecture session captured with speech-to-text.',
      duration: lectureDuration,
      transcript: transcript,
      notes: notes
    };

    try {
      const saved = await createLecture(lecturePayload);
      setSavedLectureId(saved.id);
    } catch (err) {
      console.error('Failed to auto-save lecture to backend:', err);
      setSavedLectureId(`lec-${Date.now()}`);
    }

    setModalStage('COMPLETED');
  };

  const handleReviewNotes = () => {
    setIsModalOpen(false);
    if (savedLectureId) {
      navigate(`/review/${savedLectureId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSaveAndExit = () => {
    setIsModalOpen(false);
    navigate('/dashboard');
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* 1. Top Section / Lecture Control Header */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 shrink-0">
        {/* Left: Title & Live Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    className="bg-slate-950 border border-cyan-500 rounded px-2 py-0.5 text-sm font-bold text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsEditingTitle(false)}
                    className="p-1 rounded bg-cyan-600 text-white"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {lectureTitle}
                  </h1>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 text-slate-400 hover:text-cyan-400 rounded"
                    title="Rename Lecture"
                    aria-label="Rename Lecture"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <StatusIndicator status={status} size="sm" />
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              Speech-to-Text Classroom Capture
            </p>
          </div>
        </div>

        {/* Center: Audio Visualizer Activity Indicator */}
        <div className="flex items-center gap-3">
          <AudioVisualizer
            isActive={status === 'LIVE'}
            isPaused={status === 'PAUSED'}
          />

          <div
            className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-sm font-bold text-slate-100 shadow-inner"
            aria-label={`Elapsed lecture time: ${formatTimer(seconds)}`}
          >
            {formatTimer(seconds)}
          </div>
        </div>

        {/* Right: Controls (Start, Pause, Resume, Stop) */}
        <div>
          <RecordingControls
            status={status}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
          />
        </div>
      </div>

      {/* 2. Main Dual-Panel Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* LEFT PANEL: Live Transcript */}
        <div className="h-full min-h-[400px]">
          <TranscriptPanel
            transcript={transcript}
            isLive={status === 'LIVE'}
            isPaused={status === 'PAUSED'}
            newestSegmentId={newestSegmentId}
          />
        </div>

        {/* RIGHT PANEL: AI Structured Notes */}
        <div className="h-full min-h-[400px]">
          <NotesPanel
            notes={notes}
            isGenerating={isGeneratingNotes}
          />
        </div>
      </div>

      {/* 3. Stop & Completion Modal Dialog */}
      <EndLectureModal
        isOpen={isModalOpen}
        stage={modalStage}
        onContinue={handleContinueLecture}
        onConfirmEnd={handleConfirmEnd}
        onReviewNotes={handleReviewNotes}
        onSaveLecture={handleSaveAndExit}
        stats={{
          duration: formatTimer(seconds),
          wordsCaptured: wordsCaptured,
          topicsCount: topicsCount
        }}
      />
    </div>
  );
}
