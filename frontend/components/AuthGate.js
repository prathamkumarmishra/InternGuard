'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
export function AuthGate({ children, roles }) { const { user, ready } = useAuth(); const router = useRouter(); useEffect(() => { if (ready && (!user || (roles && !roles.includes(user.role)))) router.replace('/login'); }, [ready, user, roles, router]); if (!ready) return <main className="container-page py-16"><div className="panel panel-pad animate-pulse"><div className="h-5 w-36 rounded bg-slate-200" /></div></main>; if (!user || (roles && !roles.includes(user.role))) return null; return children; }
