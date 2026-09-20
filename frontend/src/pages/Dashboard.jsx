import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Clock, FileText, Sparkles, Radio, ArrowRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import LectureCard from '../components/LectureCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { getLectures, deleteLecture } from '../services/api';

export default function Dashboard() {
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const data = await getLectures('recent');
        if (!ignore) {
          setLectures(data || []);
          if (data && data._isFallback) {
            setBackendOffline(true);
          } else {
            setBackendOffline(false);
          }
        }
      } catch (err) {
        console.error('Failed to load lectures:', err);
        if (!ignore) {
          setBackendOffline(true);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteLecture(id);
      setLectures((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Failed to delete lecture:', err);
    }
  };

  // Compute summary stats dynamically
  const lecturesCount = lectures.length;
  const totalMinutes = lectures.reduce((acc, l) => {
    const mins = parseInt(l.duration, 10) || 45;
    return acc + mins;
  }, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const notesCreatedCount = lectures.filter(
    (l) => (l.notes && (l.notes.summary || l.notes.keyTopics?.length > 0)) || l.description
  ).length;

  const totalWords = lectures.reduce((acc, l) => {
    if (l.transcript && l.transcript.length > 0) {
      return acc + l.transcript.reduce((wAcc, seg) => wAcc + (seg.text ? seg.text.split(/\s+/).length : 0), 0);
    }
    const mins = parseInt(l.duration, 10) || 45;
    return acc + (mins * 135);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Welcome back 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ready to capture your next lecture?
          </p>
        </div>

        <Link
          to="/live"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-950/50 transition-all transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Plus className="w-4 h-4" />
          <span>+ Start New Lecture</span>
        </Link>
      </div>

      {/* Backend Status Notice if Offline */}
      {backendOffline && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-300 text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span>FastAPI backend is offline (http://127.0.0.1:8001). Demonstrating cached/demo lectures.</span>
          </div>
          <span className="text-[11px] font-mono text-amber-400/80 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50">
            Offline Mode
          </span>
        </div>
      )}

      {/* 2. Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lectures Saved"
          value={lecturesCount}
          subtitle="Classroom sessions archived"
          icon={BookOpen}
          color="cyan"
        />
        <StatCard
          title="Total Lecture Time"
          value={`${totalHours} hrs`}
          subtitle={`${totalMinutes} total transcribed mins`}
          icon={Clock}
          color="indigo"
        />
        <StatCard
          title="Notes Created"
          value={notesCreatedCount}
          subtitle="AI structured study guides"
          icon={Sparkles}
          color="purple"
        />
        <StatCard
          title="Words Captured"
          value={totalWords.toLocaleString()}
          subtitle="High-confidence speech tokens"
          icon={FileText}
          color="emerald"
        />
      </div>

      {/* 3. Quick Action Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-slate-900 border border-cyan-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-900/50 border border-cyan-700/60 text-cyan-300">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Live Classroom Assistant is Ready</h3>
            <p className="text-xs text-slate-300">
              Start real-time visual speech captioning and live AI notes generation right from your microphone.
            </p>
          </div>
        </div>

        <Link
          to="/live"
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <span>Launch Live Session</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4. Recent Lectures Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Lectures</h2>
            <p className="text-xs text-slate-400">Review your past transcriptions and study materials</p>
          </div>

          {lectures.length > 0 && (
            <Link
              to="/lectures"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>View all ({lectures.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <LoadingState message="Fetching student lectures..." />
        ) : lectures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lectures.slice(0, 6).map((lecture) => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No lectures yet"
            description="You haven't recorded any lectures yet. Launch a live lecture session to capture your first class!"
            actionLabel="+ Start New Lecture"
            actionLink="/live"
          />
        )}
      </div>
    </div>
  );
}
