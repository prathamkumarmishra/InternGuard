'use client';
import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, Clock3, ExternalLink, FileWarning, Globe2, Mail, MapPin, Phone, ShieldAlert } from 'lucide-react';
import { api } from '../lib/api';
import { sampleOrganizations } from '../lib/demo';
import { RiskBadge, VerificationBadge } from './RiskBadge';
import { ScoreGauge } from './ScoreGauge';
import { ScreeningNotice } from './Notice';
import { SignalCard } from './SignalCard';
import { EvidenceCard } from './EvidenceCard';
import { RiskTimeline } from './RiskTimeline';
import { ConfirmDialog } from './ConfirmDialog';
import { useAuth } from './AuthProvider';
import { useToast } from './Toast';

export function OrganizationDetail({ id }) {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'VERIFIER';
  const fallback = sampleOrganizations.find((item) => item._id === id) || sampleOrganizations[0];
  const [data, setData] = useState({ organization: fallback, internships: [], complaintSummary: [], assessments: [] });
  const [usingDemo, setUsingDemo] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  useEffect(() => {
    api(`/organizations/${id}`)
      .then((result) => { setData(result); setUsingDemo(false); })
      .catch(() => {});
  }, [id]);

  const { organization, internships, complaintSummary, assessments } = data;
  const latest = assessments[0];
  const signals = latest?.signals?.length
    ? latest.signals
    : [{ signal: 'Synthetic demonstration record', description: 'Connect the API and seeded data to load evidence-backed signals.', source: 'Demo data', checkedAt: new Date().toISOString(), confidence: 1 }];

  const updateStatus = async (verificationStatus) => {
    setActionLoading(true);
    try {
      const result = await api(`/admin/organizations/${id}/status`, { method: 'PUT', body: JSON.stringify({ verificationStatus }) }, token);
      setData((prev) => ({ ...prev, organization: { ...prev.organization, ...result.organization } }));
      toast(`Status updated to ${verificationStatus.replaceAll('_', ' ')}`, 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  const runAssessment = async () => {
    if (!token) {
      toast('Sign in to run and save an assessment.', 'info');
      return;
    }
    setAssessmentLoading(true);
    try {
      const result = await api('/risk/assessment', { method: 'POST', body: JSON.stringify({ organizationId: id }) }, token);
      const assessment = result.assessment;
      setData((prev) => ({
        ...prev,
        organization: { ...prev.organization, riskScore: assessment.score, riskLevel: assessment.level },
        assessments: [assessment, ...prev.assessments.filter((item) => item._id !== assessment._id)].slice(0, 5)
      }));
      toast('Assessment saved to your risk history.', 'success');
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setAssessmentLoading(false);
    }
  };

  const adminActions = [
    { label: 'Verify', status: 'VERIFIED', variant: 'primary', message: 'Mark this organization as verified? This confirms the registration information has been manually reviewed.' },
    { label: 'Needs more info', status: 'NEEDS_INFORMATION', variant: 'secondary', message: 'Request additional information for this organization?' },
    { label: 'Manual review', status: 'MANUAL_REVIEW', variant: 'secondary', message: 'Queue this organization for manual investigation?' },
    { label: 'Reset to pending', status: 'PENDING', variant: 'secondary', message: 'Reset this organization verification status to pending?' },
  ];

  return (
    <main className="container-page py-12">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <div>
          <p className="eyebrow">Organization profile</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-ink">{organization.name}</h1>
            <RiskBadge level={organization.riskLevel} />
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <MapPin size={16} />
            {organization.address || organization.state || 'Address not recorded'}
          </p>
          {usingDemo && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-warning">
              Synthetic demo profile — no claim about a real entity.
            </p>
          )}
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:items-end">
          <section className="panel px-5 py-3">
            <ScoreGauge score={organization.riskScore} level={organization.riskLevel} compact />
          </section>
          {!usingDemo && (token ? (
            <button className="button-primary" onClick={runAssessment} disabled={assessmentLoading}>
              {assessmentLoading ? 'Assessing…' : 'Run assessment'}
            </button>
          ) : (
            <Link className="button-primary text-center no-underline" href="/login">Sign in to assess</Link>
          ))}
        </div>
      </div>

      {/* Admin actions panel */}
      {isAdmin && !usingDemo && (
        <section className="mt-6 panel panel-pad">
          <h2 className="font-extrabold">Verification actions</h2>
          <p className="mt-1 text-sm text-muted">
            Current status: <VerificationBadge status={organization.verificationStatus} />
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {adminActions.map((action) => (
              <button
                key={action.status}
                className={action.variant === 'primary' ? 'button-primary' : 'button-secondary'}
                onClick={() => setConfirmAction(action)}
                disabled={organization.verificationStatus === action.status}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <div className="space-y-6">
          {/* Organization overview */}
          <section className="panel panel-pad">
            <div className="flex items-center gap-2">
              <Building2 className="text-brand" size={20} />
              <h2 className="font-extrabold">Organization overview</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              {organization.description || 'No public overview is recorded for this organization.'}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                [Globe2, 'Website', organization.website],
                [Mail, 'Official email', organization.officialEmail],
                [Phone, 'Phone', organization.phone],
                [Clock3, 'Last updated', organization.updatedAt ? new Date(organization.updatedAt).toLocaleDateString() : 'Not recorded'],
              ].map(([Icon, label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <p className="flex items-center gap-2 text-xs font-bold text-muted">
                    <Icon size={14} />
                    {label}
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-ink">{value || 'Not recorded'}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why this assessment */}
          <section className="panel panel-pad">
            <h2 className="font-extrabold">Why this assessment?</h2>
            <div className="mt-4 space-y-3">
              {signals.map((signal, index) => (
                <SignalCard key={`${signal.signal}-${index}`} {...signal} />
              ))}
            </div>
          </section>

          {/* Risk assessment timeline */}
          {assessments.length > 0 && (
            <section className="panel panel-pad">
              <h2 className="font-extrabold">Assessment history</h2>
              <div className="mt-4">
                <RiskTimeline assessments={assessments} />
              </div>
            </section>
          )}

          {/* Internship information */}
          <section className="panel panel-pad">
            <h2 className="font-extrabold">Internship information</h2>
            {internships.length ? (
              <div className="mt-4 space-y-3">
                {internships.map((item) => (
                  <div key={item._id} className="rounded-xl border border-slate-100 p-4">
                    <p className="font-bold">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {item.stipend || 'Stipend not recorded'} · {item.workMode}
                    </p>
                    {item.aiAnalysis && (
                      <p className="mt-2 text-xs font-bold text-slate-500">
                        AI screening: {item.aiAnalysis.risk_score}/100 — {item.aiAnalysis.classification}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">No internships are available in this profile.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          {/* Registration */}
          <section className="panel panel-pad">
            <h2 className="font-extrabold">Registration</h2>
            <div className="mt-4">
              <VerificationBadge status={organization.registration?.status} />
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Corporate identifier</dt>
                <dd className="mt-1 font-bold">{organization.cin || 'Not recorded'}</dd>
              </div>
              <div>
                <dt className="text-muted">Company type</dt>
                <dd className="mt-1 font-bold">{organization.registration?.companyType || 'Not recorded'}</dd>
              </div>
              <div>
                <dt className="text-muted">Source</dt>
                <dd className="mt-1 font-bold">{organization.registration?.source || 'Not recorded'}</dd>
              </div>
              <div>
                <dt className="text-muted">Last verified</dt>
                <dd className="mt-1 font-bold">
                  {organization.registration?.lastVerifiedAt
                    ? new Date(organization.registration.lastVerifiedAt).toLocaleDateString()
                    : 'Not recorded'}
                </dd>
              </div>
            </dl>
          </section>

          {/* Complaint summary */}
          <section className="panel panel-pad">
            <h2 className="font-extrabold">Complaint summary</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Reports are review context, not evidence of a legal finding.
            </p>
            <div className="mt-4 space-y-2">
              {complaintSummary.length ? (
                complaintSummary.map((item) => (
                  <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm" key={item._id}>
                    <span>{item._id.replaceAll('_', ' ')}</span>
                    <b>{item.count}</b>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">No report summary available.</p>
              )}
            </div>
          </section>

          {/* Recommended action */}
          <section className="rounded-2xl bg-ink p-5 text-white">
            <ShieldAlert size={21} className="text-amber-300" />
            <h2 className="mt-4 font-extrabold">Recommended action</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {latest?.recommendations?.[0] || 'Review registration details, official contact channels, and supporting evidence before applying.'}
            </p>
            {latest?.recommendations?.length > 1 && (
              <ul className="mt-3 space-y-2">
                {latest.recommendations.slice(1).map((rec, i) => (
                  <li key={i} className="text-xs leading-5 text-slate-400">• {rec}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Evidence */}
          {latest?.signals?.some((s) => s.source) && (
            <section className="panel panel-pad">
              <h2 className="font-extrabold">Sources & evidence</h2>
              <div className="mt-4 space-y-2">
                {[...new Set(latest.signals.map((s) => s.source).filter(Boolean))].map((source) => (
                  <EvidenceCard key={source} type="TEXT" reference={source} description={`Data source referenced in this assessment`} />
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      <div className="mt-7">
        <ScreeningNotice />
      </div>

      {/* Confirm dialog for admin actions */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmAction && updateStatus(confirmAction.status)}
        title={confirmAction?.label}
        message={confirmAction?.message}
        confirmLabel={confirmAction?.label}
        loading={actionLoading}
      />
    </main>
  );
}
