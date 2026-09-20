import { useState, useEffect } from 'react';
import { Filter, Plus, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import LectureCard from '../components/LectureCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import SearchBar from '../components/SearchBar';
import { getLectures, deleteLecture } from '../services/api';

export default function PreviousLectures() {
  const [lectures, setLectures] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'recent', 'longest'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getLectures(activeFilter);
        if (!ignore) {
          setLectures(data || []);
        }
      } catch (err) {
        console.error('Failed to load previous lectures:', err);
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
  }, [activeFilter]);

  const handleDelete = async (id) => {
    try {
      await deleteLecture(id);
      setLectures((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Failed to delete lecture:', err);
    }
  };

  // Filter lectures by search query
  const filteredLectures = lectures.filter((lec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = lec.title.toLowerCase().includes(q);
    const matchSummary = (lec.notes?.summary || '').toLowerCase().includes(q);
    const matchTopics = (lec.notes?.keyTopics || []).some((t) => t.toLowerCase().includes(q));
    return matchTitle || matchSummary || matchTopics;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-cyan-400" />
            <span>Previous Lectures</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search, review, and manage your complete classroom lecture archive
          </p>
        </div>

        <Link
          to="/live"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Lecture</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full md:max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search lectures by title, topic, or concept..."
            matchCount={searchQuery.trim() ? filteredLectures.length : null}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start md:self-auto" role="group" aria-label="Filter lectures">
          <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          {['all', 'recent', 'longest'].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setActiveFilter(filterKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                activeFilter === filterKey
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Lectures Grid or Empty State */}
      {isLoading ? (
        <LoadingState message="Loading saved lecture archive..." />
      ) : filteredLectures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : searchQuery.trim() ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <p className="text-base font-medium text-slate-200 mb-1">
            No lectures matching &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-slate-400 mb-4">
            Try searching with different keywords or topics.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 rounded-lg"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <EmptyState
          title="No lectures in archive"
          description="Your lecture archive is currently empty. Record your first classroom session to build your study collection!"
          actionLabel="+ Start Live Lecture"
          actionLink="/live"
        />
      )}
    </div>
  );
}
