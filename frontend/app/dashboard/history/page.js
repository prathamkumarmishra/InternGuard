'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, SearchCheck } from 'lucide-react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../components/AuthProvider';
import { RiskBadge } from '../../../components/RiskBadge';

export default function DashboardHistoryPage() {
  const { token } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [message, setMessage] = useState('Loading your saved assessments…');

  useEffect(() => {
    if (!token) {
      setMessage('Sign in to view the assessments you have saved.');
      return;
    }
    api('/risk/history?limit=50', {}, token)
      .then((data) => {
        setAssessments(data.assessments);
        setMessage('');
      })
      .catch((error) => setMessage(error.message));
  }, [token]);

  return <div>
    <p className="eyebrow">Risk history</p>
    <h1 className="mt-2 text-3xl font-black tracking-tight">Keep track of your checks.</h1>
    <p className="mt-2 text-sm text-muted">Assessments you run from an organization profile are saved here for your account.</p>
    {assessments.length ? (
      <section className="panel mt-7 overflow-x-auto">
        <table className="data-table min-w-[650px]">
          <thead><tr><th>Organization</th><th>Score</th><th>Level</th><th>Internship</th><th>Saved</th></tr></thead>
          <tbody>{assessments.map((assessment) => (
            <tr key={assessment._id}>
              <td><Link className="font-bold text-brand" href={`/organizations/${assessment.organization?._id}`}>{assessment.organization?.name || 'Organization unavailable'}</Link></td>
              <td className="font-bold">{assessment.score}/100</td>
              <td><RiskBadge level={assessment.level} /></td>
              <td>{assessment.internship?.title || 'Organization check'}</td>
              <td>{new Date(assessment.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    ) : (
      <div className="panel panel-pad mt-7 text-center">
        <History className="mx-auto text-brand" size={28} />
        <h2 className="mt-4 font-extrabold">No saved checks yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{message || 'Open an organization profile and run an assessment to save it here.'}</p>
        <Link className="button-primary mt-5 inline-flex items-center gap-2 no-underline" href="/dashboard/organizations"><SearchCheck size={17} />Browse organizations</Link>
      </div>
    )}
  </div>;
}
