import './globals.css';
import { AuthProvider } from '../components/AuthProvider';
import { Navbar } from '../components/Navbar';
import { ToastProvider } from '../components/Toast';

export const metadata = {
  title: 'InternGuard — Verify Before You Apply.',
  description: 'AI-assisted internship verification and risk screening for students and institutions.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><AuthProvider><ToastProvider><Navbar />{children}</ToastProvider></AuthProvider></body></html>;
}
