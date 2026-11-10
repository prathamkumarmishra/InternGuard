'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({ user: null, token: null, ready: false, setSession: () => {}, logout: () => {} });
export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setSessionState(JSON.parse(localStorage.getItem('internguard_session'))); } catch {} finally { setReady(true); } }, []);
  const setSession = (value) => { setSessionState(value); localStorage.setItem('internguard_session', JSON.stringify(value)); };
  const logout = () => { setSessionState(null); localStorage.removeItem('internguard_session'); };
  return <AuthContext.Provider value={{ user: session?.user || null, token: session?.token || null, ready, setSession, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
