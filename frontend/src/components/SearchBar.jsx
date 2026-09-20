import { Search, X } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search...',
  matchCount = null,
  className = ''
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-16 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
      />
      {value && (
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {matchCount !== null && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              {matchCount}
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-slate-400 hover:text-slate-200 rounded focus-visible:ring-1 focus-visible:ring-cyan-400"
            aria-label="Clear search text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
