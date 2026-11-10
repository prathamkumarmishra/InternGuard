import { LoadingSkeleton } from '../../components/LoadingSkeleton';
export default function AdminLoading() { return <div className="space-y-6"><LoadingSkeleton variant="stats" count={4} /><LoadingSkeleton variant="table" count={5} /></div>; }
