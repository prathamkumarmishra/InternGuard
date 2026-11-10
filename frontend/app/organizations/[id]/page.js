import { OrganizationDetail } from '../../../components/OrganizationDetail';
export default async function OrganizationPage({ params }) { const { id } = await params; return <OrganizationDetail id={id} />; }
