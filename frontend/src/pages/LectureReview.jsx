import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Download,
  ArrowLeft,
  FileText,
  Sparkles
} from 'lucide-react';
import TranscriptPanel from '../components/TranscriptPanel';
import NotesPanel from '../components/NotesPanel';
import LoadingState from '../components/LoadingState';
import {
  getLecture,
  getTranscript,
  getNotes,
  updateTranscript,
  updateNotes,
  getLectures
} from '../services/api';

export default function LectureReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lecture, setLecture] = useState(null);
  const [activeTab, setActiveTab] = useState('transcript'); // 'transcript' or 'notes'
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  // Load lecture data
  useEffect(() => {
    let ignore = false;

    async function fetchLectureData() {
      setIsLoading(true);
      try {
        let currentId = id;
        if (!currentId) {
          const all = await getLectures();
          if (all && all.length > 0) {
            currentId = all[0].id;
          }
        }

        if (currentId) {
          const [lectureMeta, transcriptData, notesData] = await Promise.all([
            getLecture(currentId),
            getTranscript(currentId),
            getNotes(currentId),
          ]);

          if (!ignore && lectureMeta) {
            const segments = Array.isArray(transcriptData)
              ? transcriptData
              : (transcriptData?.segments || []);

            setLecture({
              ...lectureMeta,
              transcript: segments,
              notes: notesData,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load lecture review:', err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchLectureData();

    return () => {
      ignore = true;
    };
  }, [id]);

  // Handle inline transcript segment edit
  const handleSaveSegment = async (segmentId, newText) => {
    if (!lecture) return;
    try {
      await updateTranscript(lecture.id, segmentId, newText);
      setLecture((prev) => ({
        ...prev,
        transcript: prev.transcript.map((s) => (s.id === segmentId ? { ...s, text: newText } : s))
      }));
      showSaveNotification('Transcript updated successfully');
    } catch (err) {
      console.error('Failed to update segment:', err);
    }
  };

  // Handle notes edit save
  const handleSaveNotes = async (updatedNotes) => {
    if (!lecture) return;
    try {
      await updateNotes(lecture.id, updatedNotes);
      setLecture((prev) => ({
        ...prev,
        notes: updatedNotes
      }));
      showSaveNotification('AI study notes updated');
    } catch (err) {
      console.error('Failed to update notes:', err);
    }
  };

  const showSaveNotification = (msg) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus('');
    }, 3000);
  };

  // Download study notes formatted as text/markdown
  const handleDownloadNotes = () => {
    if (!lecture) return;

    const content = `
========================================================================
HearNote Lecture Notes: ${lecture.title}
Date: ${lecture.date} | Duration: ${lecture.duration}
Tagline: Every word. Never missed.
========================================================================

EXECUTIVE SUMMARY:
${lecture.notes?.summary || 'N/A'}

KEY TOPICS:
${(lecture.notes?.keyTopics || []).map((t) => `• ${t}`).join('\n')}

KEY POINTS:
${(lecture.notes?.keyPoints || []).map((p) => `✓ ${p}`).join('\n')}

DEFINITIONS:
${(lecture.notes?.definitions || [])
  .map((d) => `[${d.term}]: ${d.definition}`)
  .join('\n\n')}

QUESTIONS TO REVIEW:
${(lecture.notes?.questions || []).map((q, i) => `Q${i + 1}: ${q}`).join('\n')}

------------------------------------------------------------------------
FULL TRANSCRIPT:
------------------------------------------------------------------------
${(lecture.transcript || [])
  .map((s) => `[${s.timestamp}] ${s.speaker}: "${s.text}"`)
  .join('\n\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${lecture.title.replace(/[^a-zA-Z0-9]/g, '_')}_HearNote.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingState message="Loading completed lecture and notes..." />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-100 mb-2">Lecture Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested lecture could not be located in your history.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header & Navigation */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate('/lectures')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 mt-1"
              title="Back to All Lectures"
              aria-label="Back to All Lectures"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Completed Lecture
                </span>
                {saveStatus && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 animate-fadeIn">
                    ✓ {saveStatus}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {lecture.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>{lecture.date}</span>
                </span>

                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                  <span>{lecture.duration}</span>
                </span>

                <span className="text-slate-500">|</span>

                <span>
                  {lecture.transcript?.length || 0} transcript segments
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadNotes}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Notes</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'transcript'}
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'transcript'
                ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transcript ({lecture.transcript?.length || 0})</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'notes'}
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'notes'
                ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured AI Notes</span>
          </button>
        </div>
      </div>

      {/* 2. Main Tab View */}
      <div className="min-h-[500px]">
        {activeTab === 'transcript' ? (
          <TranscriptPanel
            lectureId={lecture.id}
            transcript={lecture.transcript || []}
            isLive={false}
            allowEdit={true}
            onSaveSegment={handleSaveSegment}
          />
        ) : (
          <NotesPanel
            notes={lecture.notes}
            isGenerating={false}
            allowEdit={true}
            onSaveNotes={handleSaveNotes}
          />
        )}
      </div>
    </div>
  );
}
