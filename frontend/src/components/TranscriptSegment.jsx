import { useState } from 'react';
import { User, Clock, Check, X, Edit2, ShieldCheck } from 'lucide-react';

export default function TranscriptSegment({
  segment,
  searchQuery = '',
  allowEdit = false,
  onSaveEdit = null,
  fontSize = 'base',
  isNew = false
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(segment.text);

  const handleSave = () => {
    if (onSaveEdit) {
      onSaveEdit(segment.id, editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(segment.text);
    setIsEditing(false);
  };

  // Safe search highlight helper
  const renderHighlightedText = (text, query) => {
    if (!query || !query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed font-medium',
    xl: 'text-xl leading-loose font-medium'
  };

  const confidencePercent = segment.confidence ? Math.round(segment.confidence * 100) : null;

  return (
    <article
      className={`p-4 rounded-xl border transition-all duration-300 ${
        isNew
          ? 'bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse'
          : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800'
      }`}
      aria-label={`Transcript entry from ${segment.speaker} at ${segment.timestamp}`}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700">
            <User className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span>{segment.speaker}</span>
          </span>

          <span className="flex items-center gap-1 text-slate-400 text-xs font-mono">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <time dateTime={segment.timestamp}>{segment.timestamp}</time>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {confidencePercent && (
            <span
              className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border ${
                confidencePercent >= 90
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                  : 'bg-amber-950/40 text-amber-400 border-amber-800/60'
              }`}
              title={`Speech-to-text accuracy confidence: ${confidencePercent}%`}
            >
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
              <span>{confidencePercent}%</span>
            </span>
          )}

          {allowEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 p-1 rounded hover:bg-slate-800 transition-colors"
              aria-label={`Edit segment from ${segment.speaker}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Content or Edit Form */}
      {isEditing ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-slate-950 border border-cyan-500/60 rounded-lg p-2.5 text-slate-100 text-sm focus:ring-1 focus:ring-cyan-500"
            rows={3}
            aria-label="Edit transcript text"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors font-medium"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : (
        <p className={`text-slate-100 ${fontSizeClasses[fontSize] || fontSizeClasses.base}`}>
          {renderHighlightedText(segment.text, searchQuery)}
        </p>
      )}
    </article>
  );
}
