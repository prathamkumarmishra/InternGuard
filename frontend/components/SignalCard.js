import { ShieldAlert } from 'lucide-react';

export function SignalCard({ signal, description, source, checkedAt, confidence, value }) {
  const confidencePercent = Math.round((confidence || 0.7) * 100);
  return (
    <article className="rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="shrink-0 text-warning" />
          <p className="font-bold text-ink">{signal}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-muted">
          {confidencePercent}% confidence
        </span>
      </div>
      {description && (
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
        {source && <span>Source: {source}</span>}
        {checkedAt && <span>{new Date(checkedAt).toLocaleDateString()}</span>}
        {value !== undefined && value !== true && value !== false && (
          <span className="rounded bg-slate-50 px-1.5 py-0.5">Value: {String(value)}</span>
        )}
      </div>
    </article>
  );
}
