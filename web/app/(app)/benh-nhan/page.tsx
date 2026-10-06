import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { requireSession } from '@/lib/server/db';
import { dsBenhNhan } from '@/lib/server/queries-nghiepvu';
import { ROUTE_ROLES } from '@/lib/roles';
import { formatDate, ma } from '@/lib/format';
import { C } from '@/lib/colors';
import { BloodGroup, Code, PageHeader } from '@/components/ui';
import { numSx, stick1Sx, stick2Sx, tableWrapSx } from '@/lib/styles';

export const metadata = { title: 'Bệnh nhân · Ngân hàng máu' };

export default async function BenhNhanPage() {
  const s = await requireSession(ROUTE_ROLES['/benh-nhan']);
  const rows = await dsBenhNhan(s);

  return (
    <Box>
      <PageHeader title="Bệnh nhân" caption={`${rows.length} bệnh nhân · tuổi tính bằng fn_TinhTuoi`} />
      <Box sx={{ ...tableWrapSx, maxHeight: '75vh' }}>
        <Table stickyHeader size="small" aria-label="Danh sách bệnh nhân">
          <TableHead>
            <TableRow>
              <TableCell sx={stick1Sx}>Mã</TableCell>
              <TableCell sx={stick2Sx}>Nhóm máu</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell sx={numSx}>Tuổi</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Khoa</TableCell>
              <TableCell>Chẩn đoán</TableCell>
              <TableCell sx={numSx}>Yêu cầu cấp máu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((b) => (
              <TableRow key={b.MaBenhNhan} hover>
                <TableCell sx={stick1Sx}><Code>{ma.benhNhan(b.MaBenhNhan)}</Code></TableCell>
                <TableCell sx={stick2Sx}><BloodGroup value={b.TenNhomMau} /></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{b.HoTen}</TableCell>
                <TableCell sx={numSx}>{b.Tuoi ?? '—'}</TableCell>
                <TableCell>{b.GioiTinh}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(b.NgaySinh)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {b.TenKhoa}
                  <Box component="span" sx={{ display: 'block', fontSize: 12.5, color: C.muted }}>{b.TenBenhVien}</Box>
                </TableCell>
                <TableCell sx={{ minWidth: 220 }}>{b.ChanDoanBinhLy ?? '—'}</TableCell>
                <TableCell sx={numSx}>{b.SoYeuCau}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
