import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/server/db';
import { chiTietYeuCau } from '@/lib/server/queries';
import { ROUTE_ROLES } from '@/lib/roles';
import { ma } from '@/lib/format';
import YeuCauDetail from './YeuCauDetail';

export async function generateMetadata({ params }: PageProps<'/yeu-cau/[id]'>) {
  const { id } = await params;
  return { title: `${ma.yeuCau(Number(id) || 0)} · Ngân hàng máu` };
}

export default async function ChiTietYeuCauPage({ params }: PageProps<'/yeu-cau/[id]'>) {
  const { id } = await params;
  const maYeuCau = Number(id);
  if (!Number.isInteger(maYeuCau) || maYeuCau <= 0) notFound();

  const s = await requireSession(ROUTE_ROLES['/yeu-cau']);
  const data = await chiTietYeuCau(s, maYeuCau);
  if (!data) notFound();

  return <YeuCauDetail role={s.role} {...data} />;
}
