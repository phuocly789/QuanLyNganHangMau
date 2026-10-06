import { requireSession } from '@/lib/server/db';
import { dsYeuCau } from '@/lib/server/queries';
import { KHOA_BAC_SI_DEMO, ROUTE_ROLES } from '@/lib/roles';
import YeuCauList from './YeuCauList';

export const metadata = { title: 'Yêu cầu cấp máu · Ngân hàng máu' };

export default async function YeuCauPage() {
  const s = await requireSession(ROUTE_ROLES['/yeu-cau']);
  const rows = await dsYeuCau(s);
  return <YeuCauList role={s.role} rows={rows} khoaMacDinh={s.role === 'bacsi' ? KHOA_BAC_SI_DEMO : null} />;
}
