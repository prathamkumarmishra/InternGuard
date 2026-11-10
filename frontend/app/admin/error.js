'use client';
import { ErrorState } from '../../components/ErrorState';
export default function AdminError({ error, reset }) { return <ErrorState title="Console unavailable" message={error?.message || 'An error occurred loading the admin console.'} onRetry={reset} />; }
