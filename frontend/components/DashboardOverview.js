'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, BrainCircuit, Building2, CheckCircle2, ClipboardList, FileSearch, FileWarning, SearchCheck, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import { dashboardDemo, sampleOrganizations } from '../lib/demo';
import { StatCard } from './StatCard';
import { RiskDistributionChart, CategoryChart, TrendChart } from './Charts';
import { OrganizationCard } from './OrganizationCard';
import { ScreeningNotice } from './Notice';
import { SearchBar } from './SearchBar';
import { useAuth } from './AuthProvider';

export function DashboardOverview({ admin = false }) {
  const { token, user } = useAuth();
  const [data, setData] = useState(dashboardDemo);
  const [offline, setOffline] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!admin || !token) return;
    api('/admin/dashboard', {}, token).then(setData).catch(() => setOffline(true));
  }, [admin, token]);

  const handleSearch = (query) => {
    if (!query.trim()) { setSearchResults(null); return; }
    setSearching(true);
    api(`/organizations?q=${encodeURIComponent(query)}&limit=6`)
      .then((data) => setSearchResults(data.organizations))
      .catch(() => setSearchResults([]))
      .finally(() => setSearching(false));
  };

  const stats = data.stats || dashboardDemo.stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">{admin ? 'Verification operations' : 'Your workspace'}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">
            {admin ? 'Review what needs attention.' : `Welcome back${user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}.`}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {admin
              ? 'Monitor submitted information, manual-review cases, and report patterns.'
              : 'Search, assess, and keep a record of your internship checks.'}
          </p>
        </div>
        {offline && (
          <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-warning">
            Showing synthetic demo data — API unavailable
          </span>
        )}
      </div>

      {/* Search bar */}
      <SearchBar
        onChange={handleSearch}
        placeholder="Search company, internship or website..."
        className="max-w-2xl"
      />

      {/* Quick actions */}
      {!admin && (
        <div className="flex flex-wrap gap-3">
          <Link href="/verify/company" className="button-secondary inline-flex items-center gap-2 no-underline">
            <SearchCheck size={17} /> Check Company
          </Link>
          <Link href="/analyze/internship" className="button-secondary inline-flex items-center gap-2 no-underline">
            <BrainCircuit size={17} /> Analyze Internship
          </Link>
          <Link href="/report" className="button-secondary inline-flex items-center gap-2 no-underline">
            <FileWarning size={17} /> Report Experience
          </Link>
        </div>
      )}

      {/* Search results */}
      {searchResults !== null && (
        <section>
          <p className="mb-3 text-sm font-bold text-muted">
            {searching ? 'Searching…' : `${searchResults.length} result(s) found`}
          </p>
          <div className="grid-auto">
            {searchResults.map((org) => (
              <OrganizationCard key={org._id} organization={org} />
            ))}
            {!searchResults.length && !searching && (
              <div className="panel panel-pad col-span-full text-center text-sm text-muted">
                No organizations matched this search. Try a different query.
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats */}
      {searchResults === null && (
        <>
          <div className="grid-auto">
            {[
              [admin ? 'Organizations' : 'Organizations checked', stats.totalOrganizations, Building2],
              [admin ? 'Verified organizations' : 'Internships analyzed', admin ? stats.verifiedOrganizations : stats.internshipsAnalyzed, admin ? CheckCircle2 : FileSearch],
              [admin ? 'Pending reviews' : 'Saved reports', admin ? stats.pendingReviews : stats.complaints, ClipboardList],
              [admin ? 'High-risk cases' : 'Requires review', stats.highRiskCases, AlertTriangle],
            ].map(([label, value, Icon]) => (
              <StatCard key={label} label={label} value={value} icon={Icon} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="panel panel-pad">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-extrabold">Risk distribution</h2>
                  <p className="mt-1 text-sm text-muted">Organizations by current screening level</p>
                </div>
                <ShieldCheck className="text-brand" />
              </div>
              <RiskDistributionChart data={data.riskDistribution} />
            </section>
            <section className="panel panel-pad">
              <div>
                <h2 className="font-extrabold">Reports by category</h2>
                <p className="mt-1 text-sm text-muted">Moderation context across platform reports</p>
              </div>
              <CategoryChart data={data.complaintsByCategory} />
            </section>
          </div>

          {admin && (
            <section className="panel panel-pad">
              <h2 className="font-extrabold">Report trend</h2>
              <p className="mt-1 text-sm text-muted">Reports submitted by month</p>
              <TrendChart data={data.monthlyReports} />
            </section>
          )}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-ink">Priority organizations</h2>
                <p className="mt-1 text-sm text-muted">
                  Representative synthetic records until the API is connected.
                </p>
              </div>
            </div>
            <div className="grid-auto">
              {sampleOrganizations.map((organization) => (
                <OrganizationCard key={organization._id} organization={organization} />
              ))}
            </div>
          </section>
          <ScreeningNotice />
        </>
      )}
    </div>
  );
}
