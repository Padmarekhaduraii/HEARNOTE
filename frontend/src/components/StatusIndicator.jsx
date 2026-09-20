import { Pause, CheckCircle2 } from 'lucide-react';

export default function StatusIndicator({ status = 'IDLE', size = 'md' }) {
  const isLive = status === 'LIVE';
  const isPaused = status === 'PAUSED';
  const isCompleted = status === 'COMPLETED';

  let bgClass = "bg-slate-800 text-slate-400 border-slate-700";
  let dotColor = "bg-slate-400";

  if (isLive) {
    bgClass = "bg-red-950/70 text-red-300 border-red-800/80 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
    dotColor = "bg-red-500";
  } else if (isPaused) {
    bgClass = "bg-amber-950/70 text-amber-300 border-amber-800/80";
    dotColor = "bg-amber-500";
  } else if (isCompleted) {
    bgClass = "bg-emerald-950/70 text-emerald-300 border-emerald-800/80";
    dotColor = "bg-emerald-500";
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${padding} ${bgClass} uppercase tracking-wider select-none`}
      role="status"
      aria-label={`Lecture status: ${status}`}
    >
      {isLive && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      )}

      {isPaused && <Pause className="w-3 h-3 text-amber-400 fill-amber-400" aria-hidden="true" />}
      {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" aria-hidden="true" />}
      {!isLive && !isPaused && !isCompleted && (
        <span className={`inline-block h-2 w-2 rounded-full ${dotColor}`} aria-hidden="true" />
      )}

      <span>{status}</span>
    </div>
  );
}
