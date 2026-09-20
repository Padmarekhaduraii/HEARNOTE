import { Mic, MicOff } from 'lucide-react';

export default function AudioVisualizer({ isActive = false, isPaused = false }) {
  // Height presets for visually appealing equalizer effect
  const barHeights = [40, 75, 55, 95, 60, 85, 45, 100, 70, 90, 50, 65];

  return (
    <div
      className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-inner select-none"
      role="status"
      aria-label={isActive ? (isPaused ? "Microphone paused" : "Microphone active and detecting sound") : "Microphone idle"}
    >
      <div className="flex items-center gap-1.5 font-medium">
        {isActive && !isPaused ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        ) : isPaused ? (
          <span className="h-2 w-2 rounded-full bg-amber-400"></span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-slate-500"></span>
        )}

        {isActive && !isPaused ? (
          <Mic className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
        ) : isPaused ? (
          <MicOff className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
        ) : (
          <MicOff className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
        )}

        <span className="tracking-wide">
          {isActive ? (isPaused ? "MIC PAUSED" : "MIC ACTIVE") : "MIC STANDBY"}
        </span>
      </div>

      {/* Visual Equalizer Bars */}
      <div className="flex items-end gap-1 h-5 w-24 px-1" aria-hidden="true">
        {barHeights.map((h, i) => {
          let heightClass = "h-1 bg-slate-700";
          let animationClass = "";

          if (isActive && !isPaused) {
            heightClass = "bg-gradient-to-t from-emerald-500 to-teal-300";
            const animIndex = (i % 5) + 1;
            animationClass = `animate-wave-${animIndex}`;
          } else if (isPaused) {
            heightClass = "h-1.5 bg-amber-500/40";
          }

          return (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${heightClass} ${animationClass}`}
              style={{
                height: isActive && !isPaused ? `${h}%` : undefined,
                minHeight: '3px'
              }}
            />
          );
        })}
      </div>

      {isActive && !isPaused && (
        <span className="hidden sm:inline-block font-mono text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
          SPEECH DETECTED
        </span>
      )}
    </div>
  );
}
