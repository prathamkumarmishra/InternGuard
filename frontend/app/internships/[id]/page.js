import { InternshipDetail } from '../../../components/InternshipDetail';
export default async function InternshipPage({ params }) { const { id } = await params; return <InternshipDetail id={id} />; }
