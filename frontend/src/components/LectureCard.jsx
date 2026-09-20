import { Calendar, Clock, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LectureCard({ lecture, onDelete = null }) {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/review/${lecture.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${lecture.title}"?`)) {
      if (onDelete) onDelete(lecture.id);
    }
  };

  const summary = lecture.notes?.summary || 'No summary available.';
  const topics = lecture.notes?.keyTopics || [];

  return (
    <div
      onClick={handleOpen}
      className="group flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-950/20"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
      aria-label={`Lecture card for ${lecture.title}`}
    >
      <div>
        {/* Header & Meta */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2.5">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span>{lecture.date}</span>
          </span>

          <span className="flex items-center gap-1.5 font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>{lecture.duration}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
          {lecture.title}
        </h3>

        {/* Short Summary */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {summary}
        </p>

        {/* Topics Pills */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {topics.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300"
              >
                {topic}
              </span>
            ))}
            {topics.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                +{topics.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
        >
          <span>Open Lecture</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
            title="Delete lecture"
            aria-label={`Delete lecture ${lecture.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
