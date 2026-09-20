import { useState } from 'react';
import { Sparkles, BookOpen, CheckCircle, HelpCircle, Tag, Layers, Edit3, Save } from 'lucide-react';

const DEFAULT_NOTES = {
  summary: '',
  keyTopics: [],
  keyPoints: [],
  definitions: [],
  questions: []
};

export default function NotesPanel({
  notes = null,
  isGenerating = false,
  allowEdit = false,
  onSaveNotes = null
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(DEFAULT_NOTES);

  const activeNotes = isEditing ? editedNotes : (notes || DEFAULT_NOTES);

  const handleStartEdit = () => {
    setEditedNotes(notes || DEFAULT_NOTES);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSaveNotes) {
      onSaveNotes(editedNotes);
    }
    setIsEditing(false);
  };

  const hasContent =
    activeNotes &&
    (activeNotes.summary ||
      (activeNotes.keyTopics && activeNotes.keyTopics.length > 0) ||
      (activeNotes.keyPoints && activeNotes.keyPoints.length > 0));

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              Structured AI Notes
              {isGenerating && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 animate-pulse">
                  Updating live...
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">Auto-extracted concepts, definitions & review items</p>
          </div>
        </div>

        {allowEdit && hasContent && (
          <div>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            ) : (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors border border-slate-700"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Edit Notes</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 focus:outline-none" tabIndex={0} aria-label="Structured notes content">
        {!hasContent ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="p-3 rounded-full bg-slate-800 text-slate-400 mb-3">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Synthesizing Lecture Notes...</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              As the lecture progresses, HearNote automatically organizes speech into summaries, key points, definitions, and review questions.
            </p>
          </div>
        ) : isEditing ? (
          /* Inline Editing View */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Executive Summary
              </label>
              <textarea
                value={editedNotes.summary || ''}
                onChange={(e) => setEditedNotes({ ...editedNotes, summary: e.target.value })}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Key Topics (comma separated)
              </label>
              <input
                type="text"
                value={(editedNotes.keyTopics || []).join(', ')}
                onChange={(e) =>
                  setEditedNotes({
                    ...editedNotes,
                    keyTopics: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Key Points (one per line)
              </label>
              <textarea
                value={(editedNotes.keyPoints || []).join('\n')}
                onChange={(e) =>
                  setEditedNotes({
                    ...editedNotes,
                    keyPoints: e.target.value.split('\n').filter(Boolean)
                  })
                }
                rows={5}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
              />
            </div>
          </div>
        ) : (
          /* Presentation View */
          <div className="space-y-6">
            {/* 1. Summary Section */}
            {activeNotes.summary && (
              <section className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Summary
                  </h3>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {activeNotes.summary}
                </p>
              </section>
            )}

            {/* 2. Key Topics */}
            {activeNotes.keyTopics && activeNotes.keyTopics.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-2.5 text-cyan-400">
                  <Tag className="w-4 h-4" aria-hidden="true" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Key Topics
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeNotes.keyTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Key Points */}
            {activeNotes.keyPoints && activeNotes.keyPoints.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-2.5 text-emerald-400">
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Key Points & Takeaways
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {activeNotes.keyPoints.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-slate-200 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60"
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 4. Important Definitions */}
            {activeNotes.definitions && activeNotes.definitions.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-2.5 text-purple-400">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Important Definitions
                  </h3>
                </div>
                <div className="space-y-3">
                  {activeNotes.definitions.map((def, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/40 text-sm"
                    >
                      <span className="font-semibold text-purple-300 block mb-1">
                        {def.term}
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {def.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Questions to Review */}
            {activeNotes.questions && activeNotes.questions.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-2.5 text-amber-400">
                  <HelpCircle className="w-4 h-4" aria-hidden="true" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Questions to Review
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {activeNotes.questions.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-sm text-slate-200 flex items-start gap-2.5"
                    >
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded shrink-0">
                        Q{i + 1}
                      </span>
                      <span className="text-slate-200 text-xs font-medium leading-relaxed">{q}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
