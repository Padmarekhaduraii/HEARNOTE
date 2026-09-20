import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon = BookOpen,
  title = 'No lectures found',
  description = 'You have not saved any lectures yet. Start a new live lecture session to capture speech and AI notes.',
  actionLabel = '+ Start New Lecture',
  actionLink = '/live'
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 my-4">
      <div className="p-4 rounded-full bg-slate-800/80 text-cyan-400 mb-4 border border-slate-700">
        <Icon className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLink && actionLabel && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-colors shadow-lg shadow-cyan-950/50"
        >
          <span>{actionLabel}</span>
        </Link>
      )}
    </div>
  );
}
