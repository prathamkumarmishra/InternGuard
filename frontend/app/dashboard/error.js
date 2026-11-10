'use client';
import { ErrorState } from '../../components/ErrorState';
export default function DashboardError({ error, reset }) { return <ErrorState title="Dashboard unavailable" message={error?.message || 'An error occurred loading the dashboard.'} onRetry={reset} />; }
