import { CheckCircle2, Clock3, AlertTriangle, ShieldCheck } from 'lucide-react';

const levelIcons = { LOW_RISK: CheckCircle2, MEDIUM_RISK: AlertTriangle, HIGH_RISK: ShieldCheck };
const levelColors = { LOW_RISK: 'text-success', MEDIUM_RISK: 'text-warning', HIGH_RISK: 'text-danger' };

export function RiskTimeline({ assessments = [] }) {
  if (!assessments.length) {
    return <p className="text-sm text-muted">No risk assessments recorded.</p>;
  }

  return (
    <div className="relative space-y-0">
      {assessments.map((assessment, index) => {
        const Icon = levelIcons[assessment.level] || Clock3;
        const color = levelColors[assessment.level] || 'text-muted';
        const isLast = index === assessments.length - 1;

        return (
          <div key={assessment._id || index} className="relative flex gap-4 pb-6">
            {!isLast && (
              <div className="absolute left-[15px] top-8 h-full w-px bg-slate-200" aria-hidden="true" />
            )}
            <span className={`relative z-10 shrink-0 rounded-full bg-white p-1 ring-2 ring-slate-100 ${color}`}>
              <Icon size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-ink">Score: {assessment.score}/100</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-muted">
                  {assessment.level?.replaceAll('_', ' ')}
                </span>
              </div>
              {assessment.factors && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                  {Object.entries(assessment.factors).map(([key, value]) => (
                    value > 0 && (
                      <span key={key} className="rounded bg-slate-50 px-1.5 py-0.5">
                        {key.replace(/([A-Z])/g, ' $1').trim()}: +{value}
                      </span>
                    )
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {assessment.createdAt ? new Date(assessment.createdAt).toLocaleString() : 'Date unknown'}
                {assessment.engineVersion && ` · ${assessment.engineVersion}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
