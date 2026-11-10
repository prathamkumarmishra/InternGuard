import { CheckCircle2, Clock3, Eye, Search, ShieldCheck } from 'lucide-react';
import { VerificationBadge } from './RiskBadge';

const typeIcons = { COMPANY: Search, WEBSITE: Eye, IDENTITY: ShieldCheck, MANUAL: CheckCircle2 };

export function VerificationTimeline({ verifications = [] }) {
  if (!verifications.length) {
    return <p className="text-sm text-muted">No verification history recorded.</p>;
  }

  return (
    <div className="relative space-y-0">
      {verifications.map((verification, index) => {
        const Icon = typeIcons[verification.type] || Clock3;
        const isLast = index === verifications.length - 1;

        return (
          <div key={verification._id || index} className="relative flex gap-4 pb-6">
            {!isLast && (
              <div className="absolute left-[15px] top-8 h-full w-px bg-slate-200" aria-hidden="true" />
            )}
            <span className="relative z-10 shrink-0 rounded-full bg-white p-1 text-brand ring-2 ring-slate-100">
              <Icon size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-ink">{verification.type} verification</p>
                <VerificationBadge status={verification.status} />
              </div>
              {verification.source && (
                <p className="mt-1 text-xs text-muted">Source: {verification.source}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                {verification.createdAt ? new Date(verification.createdAt).toLocaleString() : 'Date unknown'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
