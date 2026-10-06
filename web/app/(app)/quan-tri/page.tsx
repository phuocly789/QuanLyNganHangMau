import { requireSession } from '@/lib/server/db';
import { dsLichSuBackup, dsLichSuRestore, thuMucSaoLuuMacDinh, xemTruocExport } from '@/lib/server/queries-baocao';
import { hoTenCua, ROUTE_ROLES } from '@/lib/roles';
import QuanTriView from './QuanTriView';

export const metadata = { title: 'Quản trị · Ngân hàng máu' };

const pad = (n: number) => String(n).padStart(2, '0');

export default async function QuanTriPage() {
  const s = await requireSession(ROUTE_ROLES['/quan-tri']);
  const [backup, restore, exportRows, thuMuc] = await Promise.all([
    dsLichSuBackup(s),
    dsLichSuRestore(s),
    xemTruocExport(s),
    thuMucSaoLuuMacDinh(s),
  ]);

  // Quy tắc đặt tên trong mục 2.5: QuanLyNganHangMau_YYYYMMDD_HHMMSS.bak
  const d = new Date();
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  // Dùng thư mục sao lưu mặc định của SQL Server: luôn tồn tại, dịch vụ SQL Server có sẵn quyền ghi
  const dir = (thuMuc ?? 'D:\\Backup').replace(/\\+$/, '');

  return (
    <QuanTriView
      backup={backup}
      restore={restore}
      exportRows={exportRows}
      thuMucMacDinh={thuMuc}
      nguoiThucHien={hoTenCua(s.username)}
      tenFileBackup={`${dir}\\QuanLyNganHangMau_${stamp}.bak`}
      tenFileExport={`${dir}\\TonKhoChePham_${stamp}.csv`}
    />
  );
}
