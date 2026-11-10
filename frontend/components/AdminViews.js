'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { sampleOrganizations } from '../lib/demo';
import { useAuth } from './AuthProvider';
import { RiskBadge, VerificationBadge } from './RiskBadge';
import { CategoryChart, RiskDistributionChart } from './Charts';
import { Modal } from './Modal';
import { useToast } from './Toast';

export function AdminOrganizationView() { const [organizations, setOrganizations] = useState(sampleOrganizations); useEffect(() => { api('/organizations?limit=50').then((data) => setOrganizations(data.organizations)).catch(() => {}); }, []); return <div><p className="eyebrow">Organization review</p><h1 className="mt-2 text-3xl font-black tracking-tight">Verification inventory.</h1><section className="panel mt-7 overflow-x-auto"><table className="data-table min-w-[700px]"><thead><tr><th>Organization</th><th>Risk</th><th>Registration</th><th>Website</th><th>Last checked</th><th /></tr></thead><tbody>{organizations.map((item) => <tr key={item._id}><td><p className="font-extrabold">{item.name}</p><p className="text-xs text-muted">{item.state}</p></td><td><div className="flex items-center gap-2"><RiskBadge level={item.riskLevel} /><span className="font-bold">{item.riskScore}</span></div></td><td><VerificationBadge status={item.registration?.status} /></td><td className="text-slate-600">{item.website || '—'}</td><td>{new Date(item.updatedAt).toLocaleDateString()}</td><td><Link className="font-bold text-brand" href={`/organizations/${item._id}`}>View</Link></td></tr>)}</tbody></table></section></div>; }
export function AdminComplaintView() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('Loading report queue…');
  const [selectedReport, setSelectedReport] = useState(null);
  const [form, setForm] = useState({ status: 'UNDER_REVIEW', moderationNote: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    api('/complaints?limit=50', {}, token)
      .then((data) => { setReports(data.complaints); setMessage(''); })
      .catch((error) => setMessage(error.message));
  }, [token]);

  const openReview = (report) => {
    setSelectedReport(report);
    setForm({ status: report.status, moderationNote: report.moderationNote || '' });
  };

  const saveReview = async (event) => {
    event.preventDefault();
    if (!selectedReport) return;
    setSaving(true);
    try {
      const result = await api(`/admin/reviews/${selectedReport._id}`, { method: 'PUT', body: JSON.stringify(form) }, token);
      setReports((current) => current.map((report) => report._id === result.complaint._id
        ? { ...report, ...result.complaint, organization: report.organization, internship: report.internship }
        : report));
      setSelectedReport(null);
      toast('Report moderation status updated.', 'success');
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return <div>
    <p className="eyebrow">Complaint moderation</p>
    <h1 className="mt-2 text-3xl font-black tracking-tight">Reports need human context.</h1>
    <p className="mt-2 text-sm text-muted">Report status is never a finding about an organization; moderators should review supporting evidence.</p>
    <section className="panel mt-7 overflow-x-auto">
      <table className="data-table min-w-[760px]">
        <thead><tr><th>Organization</th><th>Category</th><th>Status</th><th>Submitted</th><th /></tr></thead>
        <tbody>{reports.map((report) => <tr key={report._id}>
          <td className="font-bold">{report.organization?.name}</td>
          <td>{report.category.replaceAll('_', ' ')}</td>
          <td><VerificationBadge status={report.status} /></td>
          <td>{new Date(report.createdAt).toLocaleDateString()}</td>
          <td><button className="button-secondary whitespace-nowrap" onClick={() => openReview(report)}>Review</button></td>
        </tr>)}</tbody>
      </table>
      {!reports.length && <p className="p-6 text-sm text-muted">{message}</p>}
    </section>
    <Modal open={!!selectedReport} onClose={() => !saving && setSelectedReport(null)} title="Moderate report">
      <form onSubmit={saveReview}>
        <p className="text-sm leading-6 text-muted">Update workflow status and leave a concise review note. The note is internal moderation context.</p>
        <label className="label mt-5">Status
          <select className="input mt-1" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            {['PENDING', 'UNDER_REVIEW', 'VERIFIED_REPORT', 'REJECTED', 'RESOLVED'].map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
          </select>
        </label>
        <label className="label mt-4">Moderation note <span className="font-normal text-muted">(optional)</span>
          <textarea className="input mt-1 min-h-28 resize-y" maxLength="1000" value={form.moderationNote} onChange={(event) => setForm({ ...form, moderationNote: event.target.value })} />
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="button-secondary" disabled={saving} onClick={() => setSelectedReport(null)}>Cancel</button>
          <button className="button-primary" disabled={saving}>{saving ? 'Saving…' : 'Save review'}</button>
        </div>
      </form>
    </Modal>
  </div>;
}
export function AdminReviewView() { const { token } = useAuth(); const [items, setItems] = useState(sampleOrganizations.filter((item) => item.riskLevel === 'HIGH_RISK')); const [demo, setDemo] = useState(true); useEffect(() => { if (!token) return; api('/admin/reviews', {}, token).then((data) => { setItems(data.reviews); setDemo(false); }).catch(() => {}); }, [token]); return <div><p className="eyebrow">Manual review queue</p><h1 className="mt-2 text-3xl font-black tracking-tight">Prioritized screening cases.</h1>{demo && <p className="mt-2 text-sm text-warning">Showing synthetic demo cases while API data is unavailable.</p>}<div className="mt-7 space-y-3">{items.map((item) => <article key={item._id} className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><h2 className="font-extrabold">{item.name}</h2><RiskBadge level={item.riskLevel} /></div><p className="mt-2 text-sm text-muted">Score {item.riskScore}/100 · Registration {item.registration?.status?.replaceAll('_', ' ') || 'needs review'}</p></div><Link className="button-secondary text-center no-underline" href={`/organizations/${item._id}`}>Open case</Link></article>)}</div></div>; }
export function AnalyticsView() { const { token } = useAuth(); const [data, setData] = useState({ topIndicators: [], verificationStatus: [], highRisk: [] }); useEffect(() => { if (!token) return; api('/admin/analytics', {}, token).then(setData).catch(() => {}); }, [token]); return <div><p className="eyebrow">Analytics</p><h1 className="mt-2 text-3xl font-black tracking-tight">Signals and verification trends.</h1><div className="mt-7 grid gap-6 lg:grid-cols-2"><section className="panel panel-pad"><h2 className="font-extrabold">Verification status</h2><RiskDistributionChart data={data.verificationStatus} /></section><section className="panel panel-pad"><h2 className="font-extrabold">Top detected signals</h2><CategoryChart data={data.topIndicators} /></section></div></div>; }
export function AuditLogView() { const { token } = useAuth(); const [logs, setLogs] = useState([]); const [message, setMessage] = useState('Loading audit history…'); useEffect(() => { if (!token) return; api('/admin/audit-logs', {}, token).then((data) => { setLogs(data.logs); setMessage(''); }).catch((err) => setMessage(err.message)); }, [token]); return <div><p className="eyebrow">Audit trail</p><h1 className="mt-2 text-3xl font-black tracking-tight">Reviewable administrative actions.</h1><section className="panel mt-7 overflow-x-auto"><table className="data-table min-w-[680px]"><thead><tr><th>Action</th><th>Entity</th><th>By</th><th>When</th></tr></thead><tbody>{logs.map((log) => <tr key={log._id}><td className="font-bold">{log.action}</td><td>{log.entity}</td><td>{log.user?.fullName || '—'}</td><td>{new Date(log.createdAt).toLocaleString()}</td></tr>)}</tbody></table>{!logs.length && <p className="p-6 text-sm text-muted">{message}</p>}</section></div>; }
