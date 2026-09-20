import { AlertCircle, CheckCircle2, Clock, FileText, Tag, ArrowRight, Save } from 'lucide-react';

export default function EndLectureModal({
  isOpen = false,
  stage = 'CONFIRM', // 'CONFIRM' or 'COMPLETED'
  onContinue,
  onConfirmEnd,
  onReviewNotes,
  onSaveLecture,
  stats = {
    duration: '00:00',
    wordsCaptured: 0,
    topicsCount: 0
  }
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6">
        {stage === 'CONFIRM' ? (
          <>
            {/* Step 1: Confirmation */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-400 shrink-0">
                <AlertCircle className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-slate-100">
                  End this lecture?
                </h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to stop recording? HearNote will finalize the real-time transcript and generate your complete structured AI study notes.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onContinue}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                Continue Lecture
              </button>
              <button
                type="button"
                onClick={onConfirmEnd}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors shadow-md shadow-red-950/50"
              >
                End Lecture
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Completed Stats Summary */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 mb-1">
                <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 id="modal-title" className="text-xl font-bold text-slate-100">
                Lecture completed ✓
              </h3>
              <p className="text-xs text-slate-400">
                All speech has been transcribed and AI study notes have been generated.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 py-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-xs text-slate-400 block font-medium">Duration</span>
                <span className="text-sm font-bold text-slate-100 font-mono mt-0.5 block">
                  {stats.duration}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <FileText className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                <span className="text-xs text-slate-400 block font-medium">Words</span>
                <span className="text-sm font-bold text-slate-100 font-mono mt-0.5 block">
                  {stats.wordsCaptured}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <Tag className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <span className="text-xs text-slate-400 block font-medium">Topics</span>
                <span className="text-sm font-bold text-slate-100 font-mono mt-0.5 block">
                  {stats.topicsCount}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onReviewNotes}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-950/50"
              >
                <span>Review Notes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onSaveLecture}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>Save Lecture</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
