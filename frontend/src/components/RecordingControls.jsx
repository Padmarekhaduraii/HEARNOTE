import { Play, Pause, Square } from 'lucide-react';

export default function RecordingControls({
  status, // 'IDLE', 'LIVE', 'PAUSED', 'COMPLETED'
  onStart,
  onPause,
  onResume,
  onStop,
  disabled = false
}) {
  const isIdle = status === 'IDLE' || status === 'COMPLETED';
  const isLive = status === 'LIVE';
  const isPaused = status === 'PAUSED';

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Lecture recording controls">
      {isIdle ? (
        <button
          onClick={onStart}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-950/50 focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Start Lecture Recording"
        >
          <Play className="w-4 h-4 fill-white" aria-hidden="true" />
          <span>Start Lecture</span>
        </button>
      ) : (
        <>
          {isLive && (
            <button
              onClick={onPause}
              disabled={disabled}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-white font-medium text-sm transition-colors shadow-md shadow-amber-950/40 focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Pause Lecture"
            >
              <Pause className="w-4 h-4 fill-white" aria-hidden="true" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              onClick={onResume}
              disabled={disabled}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-md shadow-emerald-950/40 focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Resume Lecture"
            >
              <Play className="w-4 h-4 fill-white" aria-hidden="true" />
              <span>Resume</span>
            </button>
          )}

          <button
            onClick={onStop}
            disabled={disabled}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-medium text-sm transition-colors shadow-md shadow-red-950/40 focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label="Stop and End Lecture"
          >
            <Square className="w-4 h-4 fill-white" aria-hidden="true" />
            <span>Stop</span>
          </button>
        </>
      )}
    </div>
  );
}
