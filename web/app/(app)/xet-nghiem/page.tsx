import { requireSession } from '@/lib/server/db';
import { chePhamCuaDonVi, dsDonViMau, dsLoaiXetNghiem, ketQuaCuaDonVi } from '@/lib/server/queries-nghiepvu';
import { ROUTE_ROLES } from '@/lib/roles';
import { toIsoDateTime } from '@/lib/format';
import XetNghiemView from './XetNghiemView';

export const metadata = { title: 'Xét nghiệm · Ngân hàng máu' };

export default async function XetNghiemPage({ searchParams }: PageProps<'/xet-nghiem'>) {
  const s = await requireSession(ROUTE_ROLES['/xet-nghiem']);
  const { dv } = await searchParams;
  const [donVi, loaiXN] = await Promise.all([dsDonViMau(s), dsLoaiXetNghiem(s)]);

  // Mặc định chọn đơn vị đầu tiên (ưu tiên Chờ xét nghiệm)
  const maChon = Number(dv) || donVi[0]?.MaDonViMau || null;
  const [ketQua, chePham] = maChon ? await Promise.all([ketQuaCuaDonVi(s, maChon), chePhamCuaDonVi(s, maChon)]) : [[], []];

  return <XetNghiemView role={s.role} donVi={donVi} loaiXN={loaiXN} maChon={maChon} ketQua={ketQua} chePham={chePham} bayGio={toIsoDateTime(new Date()).slice(0, 16)} />;
}
