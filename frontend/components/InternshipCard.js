import Link from 'next/link';
import { BriefcaseBusiness, Building2, Clock3, MapPin, Wallet } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

export function InternshipCard({ internship }) {
  const score = internship.aiAnalysis?.risk_score ?? null;
  const level = internship.aiAnalysis?.classification?.replace(' ', '_') || null;

  return (
    <article className="panel panel-pad flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-lg bg-blue-50 p-2 text-brand">
          <BriefcaseBusiness size={18} />
        </span>
        {level && <RiskBadge level={level} />}
      </div>
      <h3 className="mt-4 font-extrabold text-ink">{internship.title}</h3>
      {internship.organization && (
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <Building2 size={14} />
          {internship.organization.name || internship.organization}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
        {internship.stipend && (
          <span className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
            <Wallet size={12} /> {internship.stipend}
          </span>
        )}
        {internship.workMode && internship.workMode !== 'UNSPECIFIED' && (
          <span className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
            <MapPin size={12} /> {internship.workMode}
          </span>
        )}
        {internship.duration && (
          <span className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1">
            <Clock3 size={12} /> {internship.duration}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        {score !== null && <span className="text-sm font-black text-ink">{score}/100</span>}
        <Link href={`/internships/${internship._id}`} className="text-sm font-bold text-brand no-underline">
          View details →
        </Link>
      </div>
    </article>
  );
}
