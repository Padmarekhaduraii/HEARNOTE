import { useState, useEffect, useRef } from 'react';
import { MessageSquare, ArrowDown, Type, Volume2 } from 'lucide-react';
import SearchBar from './SearchBar';
import TranscriptSegment from './TranscriptSegment';

export default function TranscriptPanel({
  transcript = [],
  isLive = false,
  isPaused = false,
  allowEdit = false,
  onSaveSegment = null,
  newestSegmentId = null
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState('base'); // 'sm', 'base', 'lg', 'xl'
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollContainerRef = useRef(null);

  // Filter segments based on search
  const filteredSegments = transcript.filter((seg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return seg.text.toLowerCase().includes(q) || seg.speaker.toLowerCase().includes(q);
  });

  // Auto-scroll when new segment arrives (if auto-scroll enabled)
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [transcript.length, autoScroll]);

  const cycleFontSize = () => {
    const sizes = ['sm', 'base', 'lg', 'xl'];
    const nextIdx = (sizes.indexOf(fontSize) + 1) % sizes.length;
    setFontSize(sizes[nextIdx]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              Live Transcript
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                {transcript.length} {transcript.length === 1 ? 'segment' : 'segments'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Real-time speech-to-text visual stream</p>
          </div>
        </div>

        {/* Toolbar: Font size adjuster & Auto-scroll */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleFontSize}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors border border-slate-700"
            title="Adjust transcription font size"
            aria-label={`Current font size: ${fontSize.toUpperCase()}. Click to enlarge.`}
          >
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase font-mono">{fontSize}</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              autoScroll
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle automatic scrolling to latest speech"
            aria-label="Toggle auto scroll"
          >
            <ArrowDown className={`w-3.5 h-3.5 ${autoScroll ? 'text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Auto-scroll</span>
          </button>
        </div>
      </div>

      {/* Search Bar Subheader */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/60">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search transcript by keywords or speaker..."
          matchCount={searchQuery.trim() ? filteredSegments.length : null}
        />
      </div>

      {/* Live State Banner */}
      {isLive && !isPaused && (
        <div className="px-4 py-1.5 bg-cyan-950/30 border-b border-cyan-900/30 flex items-center justify-between text-xs text-cyan-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-medium">Listening for classroom speech...</span>
          </div>
          <span className="text-[11px] text-cyan-400/80 font-mono">Microphone Active</span>
        </div>
      )}

      {isPaused && (
        <div className="px-4 py-1.5 bg-amber-950/30 border-b border-amber-900/30 flex items-center gap-2 text-xs text-amber-300">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="font-medium">Transcription paused. Resume when ready.</span>
        </div>
      )}

      {/* Transcript Segments Scroll Container */}
      <div
        ref={scrollContainerRef}
        tabIndex={0}
        aria-label="Transcript content stream"
        className="flex-1 overflow-y-auto p-4 space-y-3 focus:outline-none"
      >
        {filteredSegments.length > 0 ? (
          filteredSegments.map((seg) => (
            <TranscriptSegment
              key={seg.id}
              segment={seg}
              searchQuery={searchQuery}
              allowEdit={allowEdit}
              onSaveEdit={onSaveSegment}
              fontSize={fontSize}
              isNew={seg.id === newestSegmentId}
            />
          ))
        ) : searchQuery.trim() ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-6 text-slate-400">
            <p className="text-sm font-medium text-slate-300 mb-1">No matching segments found</p>
            <p className="text-xs text-slate-500">
              No transcript matches &quot;{searchQuery}&quot;. Try clearing your search.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="p-3 rounded-full bg-slate-800 text-slate-400 mb-3 animate-pulse">
              <Volume2 className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Waiting for speech...</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Spoken words from the instructor will appear here in real time with speaker labels and visual timestamps.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
