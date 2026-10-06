import { requireSession } from '@/lib/server/db';
import { dsDot, dsLanHien, dsNguoiHien } from '@/lib/server/queries-nghiepvu';
import { ROUTE_ROLES } from '@/lib/roles';
import HienMauView from './HienMauView';

export const metadata = { title: 'Hiến máu · Ngân hàng máu' };

export default async function HienMauPage() {
  const s = await requireSession(ROUTE_ROLES['/hien-mau']);
  const [nguoiHien, lanHien, dot] = await Promise.all([dsNguoiHien(s), dsLanHien(s), dsDot(s)]);
  return <HienMauView role={s.role} nguoiHien={nguoiHien} lanHien={lanHien} dot={dot} />;
}
