import { Sidebar } from '../../components/Sidebar';
import { AuthGate } from '../../components/AuthGate';
export default function DashboardLayout({ children }) { return <AuthGate><div className="lg:grid lg:grid-cols-[244px_1fr]"><Sidebar /> <main className="min-w-0 px-4 py-7 sm:px-7 lg:px-10">{children}</main></div></AuthGate>; }
