'use client';
import { Filter, X } from 'lucide-react';

const riskLevels = [
  { value: '', label: 'All risk levels' },
  { value: 'LOW_RISK', label: 'Low risk' },
  { value: 'MEDIUM_RISK', label: 'Medium risk' },
  { value: 'HIGH_RISK', label: 'High risk' },
];

const registrationStatuses = [
  { value: '', label: 'All registration' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'NEEDS_REVIEW', label: 'Needs review' },
  { value: 'NOT_FOUND', label: 'Not found' },
];

const verificationStatuses = [
  { value: '', label: 'All verification' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'NEEDS_INFORMATION', label: 'Needs information' },
  { value: 'MANUAL_REVIEW', label: 'Manual review' },
];

const complaintCategories = [
  { value: '', label: 'All categories' },
  { value: 'PAYMENT_REQUEST', label: 'Payment request' },
  { value: 'FAKE_INTERNSHIP_OFFER', label: 'Fake internship offer' },
  { value: 'FAKE_INTERVIEW', label: 'Fake interview' },
  { value: 'CERTIFICATE_SCAM', label: 'Certificate scam' },
  { value: 'NON_RESPONSE', label: 'Non response' },
  { value: 'IDENTITY_MISREPRESENTATION', label: 'Identity misrepresentation' },
  { value: 'MISLEADING_STIPEND', label: 'Misleading stipend' },
  { value: 'OTHER', label: 'Other' },
];

const complaintStatuses = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'VERIFIED_REPORT', label: 'Verified report' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'RESOLVED', label: 'Resolved' },
];

function SelectFilter({ options, value, onChange, label }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="sr-only">{label}</span>
      <select className="input py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ filters = {}, onChange, variant = 'organization' }) {
  const hasActive = Object.values(filters).some((v) => v);

  const clearAll = () => {
    const cleared = {};
    Object.keys(filters).forEach((key) => { cleared[key] = ''; });
    onChange(cleared);
  };

  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted">
        <Filter size={14} /> Filters
      </span>
      {variant === 'organization' && (
        <>
          <SelectFilter label="Risk level" options={riskLevels} value={filters.riskLevel || ''} onChange={(v) => update('riskLevel', v)} />
          <SelectFilter label="Registration" options={registrationStatuses} value={filters.registrationStatus || ''} onChange={(v) => update('registrationStatus', v)} />
          <SelectFilter label="Verification" options={verificationStatuses} value={filters.verificationStatus || ''} onChange={(v) => update('verificationStatus', v)} />
        </>
      )}
      {variant === 'complaint' && (
        <>
          <SelectFilter label="Category" options={complaintCategories} value={filters.category || ''} onChange={(v) => update('category', v)} />
          <SelectFilter label="Status" options={complaintStatuses} value={filters.status || ''} onChange={(v) => update('status', v)} />
        </>
      )}
      {hasActive && (
        <button onClick={clearAll} className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-muted hover:bg-slate-200">
          <X size={14} /> Clear
        </button>
      )}
    </div>
  );
}
