import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#10213c] py-10 text-slate-300">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <Link href="/" className="flex items-center gap-2 no-underline">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white">
                <ShieldCheck size={18} />
              </span>
              <span className="font-extrabold text-white">InternGuard</span>
            </Link>
            <p className="mt-2 text-sm">Verify Before You Apply.</p>
          </div>
          <div className="grid gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="font-bold text-white">Platform</p>
              <nav className="mt-3 flex flex-col gap-2">
                <Link href="/verify/company" className="text-slate-400 no-underline hover:text-white">Verify Organization</Link>
                <Link href="/analyze/internship" className="text-slate-400 no-underline hover:text-white">Analyze Internship</Link>
                <Link href="/organizations" className="text-slate-400 no-underline hover:text-white">Organizations</Link>
                <Link href="/report" className="text-slate-400 no-underline hover:text-white">Report Experience</Link>
              </nav>
            </div>
            <div>
              <p className="font-bold text-white">Resources</p>
              <nav className="mt-3 flex flex-col gap-2">
                <Link href="/about" className="text-slate-400 no-underline hover:text-white">About</Link>
                <Link href="/dashboard" className="text-slate-400 no-underline hover:text-white">Dashboard</Link>
                <Link href="/settings" className="text-slate-400 no-underline hover:text-white">Settings</Link>
              </nav>
            </div>
            <div>
              <p className="font-bold text-white">Legal</p>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Automated signals support review; they are not legal fraud determinations. Synthetic demo data is clearly marked throughout this project.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} InternGuard — Smart India Hackathon Prototype</p>
          <p className="text-xs text-slate-500">Built for AICTE internship verification</p>
        </div>
      </div>
    </footer>
  );
}
