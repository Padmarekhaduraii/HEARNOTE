export default function StatCard({ title, value, subtitle, icon: Icon, color = 'cyan' }) {
  const colorMap = {
    cyan: {
      bg: 'bg-cyan-950/40 border-cyan-800/50',
      iconBg: 'bg-cyan-900/60 text-cyan-300',
      text: 'text-cyan-400'
    },
    indigo: {
      bg: 'bg-indigo-950/40 border-indigo-800/50',
      iconBg: 'bg-indigo-900/60 text-indigo-300',
      text: 'text-indigo-400'
    },
    purple: {
      bg: 'bg-purple-950/40 border-purple-800/50',
      iconBg: 'bg-purple-900/60 text-purple-300',
      text: 'text-purple-400'
    },
    emerald: {
      bg: 'bg-emerald-950/40 border-emerald-800/50',
      iconBg: 'bg-emerald-900/60 text-emerald-300',
      text: 'text-emerald-400'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`p-5 rounded-2xl border ${scheme.bg} backdrop-blur-sm shadow-lg flex items-start justify-between gap-3`}>
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <span className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tracking-tight block">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-slate-400 mt-1 block">
            {subtitle}
          </span>
        )}
      </div>

      {Icon && (
        <div className={`p-3 rounded-xl ${scheme.iconBg} shrink-0`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
