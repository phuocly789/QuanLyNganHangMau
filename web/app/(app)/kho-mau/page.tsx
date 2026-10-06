import { requireSession } from '@/lib/server/db';
import { dsChePham, dsLichSuKho, dsNganHang, dsViTri, tonKhoTheoNhom } from '@/lib/server/queries';
import { can, ROUTE_ROLES } from '@/lib/roles';
import KhoMauView from './KhoMauView';

export const metadata = { title: 'Kho máu · Ngân hàng máu' };

export default async function KhoMauPage() {
  const s = await requireSession(ROUTE_ROLES['/kho-mau']);

  const [tonKho, chePham, nganHang, viTri, lichSu] = await Promise.all([
    tonKhoTheoNhom(s),
    dsChePham(s),
    dsNganHang(s),
    can(s.role, 'xemViTri') ? dsViTri(s) : Promise.resolve([]),
    can(s.role, 'xemLichSuKho') ? dsLichSuKho(s) : Promise.resolve([]),
  ]);

  return <KhoMauView role={s.role} tonKho={tonKho} chePham={chePham} nganHang={nganHang} viTri={viTri} lichSu={lichSu} />;
}
