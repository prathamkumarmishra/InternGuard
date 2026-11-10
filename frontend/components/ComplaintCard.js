import Link from 'next/link';
import { Clock3, MessageSquareWarning } from 'lucide-react';
import { VerificationBadge } from './RiskBadge';

export function ComplaintCard({ complaint }) {
  return (
    <article className="panel panel-pad">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-lg bg-amber-50 p-2 text-warning">
          <MessageSquareWarning size={18} />
        </span>
        <VerificationBadge status={complaint.status} />
      </div>
      <h3 className="mt-4 font-extrabold text-ink">
        {complaint.category?.replaceAll('_', ' ') || 'Report'}
      </h3>
      <p className="mt-1 text-sm text-muted line-clamp-2">{complaint.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span className="font-bold">{complaint.organization?.name || 'Organization'}</span>
        <span className="flex items-center gap-1">
          <Clock3 size={12} />
          {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Date unknown'}
        </span>
      </div>
      {complaint._id && (
        <Link href={`/dashboard/reports`} className="mt-3 block text-sm font-bold text-brand no-underline">
          View report details →
        </Link>
      )}
    </article>
  );
}
