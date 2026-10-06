import { requireSession } from '@/lib/server/db';
import { dsPhanBoChoTruyen, dsTruyenMau, maTruyenMauKeTiep } from '@/lib/server/queries-nghiepvu';
import { hoTenCua, ROUTE_ROLES } from '@/lib/roles';
import { toIsoDateTime } from '@/lib/format';
import TruyenMauView from './TruyenMauView';

export const metadata = { title: 'Truyền máu · Ngân hàng máu' };

export default async function TruyenMauPage({ searchParams }: PageProps<'/truyen-mau'>) {
  const s = await requireSession(ROUTE_ROLES['/truyen-mau']);
  const { phanBo } = await searchParams;
  const [choTruyen, truyenMau, maKeTiep] = await Promise.all([dsPhanBoChoTruyen(s), dsTruyenMau(s), maTruyenMauKeTiep(s)]);

  return (
    <TruyenMauView
      role={s.role}
      choTruyen={choTruyen}
      truyenMau={truyenMau}
      maPhanBoChon={Number(phanBo) || null}
      nguoiThucHien={hoTenCua(s.username)}
      bayGio={toIsoDateTime(new Date()).slice(0, 16)}
      maKeTiep={maKeTiep}
    />
  );
}
