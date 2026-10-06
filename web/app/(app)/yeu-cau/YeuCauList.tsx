'use client';

import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { C } from '@/lib/theme';
import { formatDateTime, ma, ml } from '@/lib/format';
import type { Role } from '@/lib/roles';
import type { YeuCauRow } from '@/lib/server/queries';
import { BloodGroup, Code, Critical, numSx, Status, stick1Sx, stick2Sx, tableWrapSx } from '@/components/ui';

const TRANG_THAI = ['Chờ xử lý', 'Đã duyệt', 'Đã phân bổ', 'Hoàn tất', 'Từ chối'];

export default function YeuCauList({ role, rows, khoaMacDinh }: { role: Role; rows: YeuCauRow[]; khoaMacDinh: number | null }) {
  const [trangThai, setTrangThai] = useState('');
  const [maKhoa, setMaKhoa] = useState<number | ''>(khoaMacDinh ?? '');

  const khoaList = useMemo(() => {
    const m = new Map<number, string>();
    rows.forEach((r) => m.set(r.MaKhoa, `${r.TenKhoa} – ${r.TenBenhVien}`));
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1], 'vi'));
  }, [rows]);

  const loc = rows.filter((r) => (!trangThai || r.TrangThai === trangThai) && (maKhoa === '' || r.MaKhoa === maKhoa));
  const choPhanBo = rows.filter((r) => r.TrangThai === 'Đã duyệt').length;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h1">Yêu cầu cấp máu</Typography>
        <Typography variant="caption" component="p" sx={{ mt: 0.5 }}>
          {role === 'nhanvien'
            ? `${choPhanBo} yêu cầu đã duyệt đang chờ phân bổ · Cấp cứu xếp trước`
            : 'Cấp cứu xếp trước, sau đó theo thời gian yêu cầu mới nhất'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <TextField select value={trangThai} onChange={(e) => setTrangThai(e.target.value)} sx={{ width: 190 }} slotProps={{ select: { displayEmpty: true }, htmlInput: { 'aria-label': 'Lọc theo trạng thái' } }}>
          <MenuItem value="">Mọi trạng thái</MenuItem>
          {TRANG_THAI.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField select value={maKhoa} onChange={(e) => setMaKhoa(e.target.value === '' ? '' : Number(e.target.value))} sx={{ width: 320 }} slotProps={{ select: { displayEmpty: true }, htmlInput: { 'aria-label': 'Lọc theo khoa' } }}>
          <MenuItem value="">Mọi khoa</MenuItem>
          {khoaList.map(([id, ten]) => <MenuItem key={id} value={id}>{ten}{id === khoaMacDinh ? ' (khoa của tôi)' : ''}</MenuItem>)}
        </TextField>
        <Box sx={{ ml: 'auto', fontSize: 13, color: C.muted }}>{loc.length} / {rows.length} yêu cầu</Box>
      </Box>

      <Box sx={{ ...tableWrapSx, maxHeight: '75vh' }}>
        <Table stickyHeader size="small" aria-label="Danh sách yêu cầu cấp máu">
          <TableHead>
            <TableRow>
              <TableCell sx={stick1Sx}>Mã</TableCell>
              <TableCell sx={stick2Sx}>Nhóm máu</TableCell>
              <TableCell>Bệnh nhân</TableCell>
              <TableCell>Khoa</TableCell>
              <TableCell>Loại chế phẩm</TableCell>
              <TableCell sx={numSx}>Yêu cầu</TableCell>
              <TableCell sx={numSx}>Đã phân bổ</TableCell>
              <TableCell>Ưu tiên</TableCell>
              <TableCell>Ngày yêu cầu</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell aria-label="Hành động" />
            </TableRow>
          </TableHead>
          <TableBody>
            {loc.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} sx={{ py: 3, textAlign: 'center', color: C.muted }}>Không có yêu cầu khớp bộ lọc.</TableCell>
              </TableRow>
            )}
            {loc.map((r) => {
              const dangMo = !['Hoàn tất', 'Từ chối'].includes(r.TrangThai);
              const thieu = Math.max(0, r.SoLuongYeuCau - r.DaPhanBoMl);
              const canXuLy = role === 'nhanvien' && (r.TrangThai === 'Đã duyệt' || r.TrangThai === 'Chờ xử lý');
              const hanhDong =
                role === 'nhanvien' && r.TrangThai === 'Đã duyệt' ? 'Phân bổ' : role === 'nhanvien' && r.TrangThai === 'Chờ xử lý' ? 'Xét duyệt' : 'Xem';
              return (
                // Yêu cầu đã đóng hiện mờ để các dòng cần xử lý nổi lên
                <TableRow key={r.MaYeuCau} hover sx={dangMo ? undefined : { '& td': { color: C.muted } }}>
                  <TableCell sx={stick1Sx}><Code>{ma.yeuCau(r.MaYeuCau)}</Code></TableCell>
                  <TableCell sx={stick2Sx}><BloodGroup value={r.TenNhomMau} /></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {r.HoTenBenhNhan ?? <Code>{ma.benhNhan(r.MaBenhNhan)}</Code>}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {r.TenKhoa}
                    <Box component="span" sx={{ display: 'block', fontSize: 12.5, color: C.muted }}>{r.TenBenhVien}</Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.LoaiChePhamYeuCau}</TableCell>
                  <TableCell sx={numSx}>{ml(r.SoLuongYeuCau)}</TableCell>
                  <TableCell sx={numSx}>
                    {ml(r.DaPhanBoMl)}
                    {dangMo && thieu > 0 && r.TrangThai !== 'Chờ xử lý' && (
                      <Box component="span" sx={{ display: 'block', fontSize: 12.5, color: C.danger, fontWeight: 600 }}>thiếu {ml(thieu)}</Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.MucDoUuTien === 'Cấp cứu' && dangMo ? <Critical>Cấp cứu</Critical> : <Box component="span" sx={{ color: C.muted, whiteSpace: 'nowrap' }}>{r.MucDoUuTien}</Box>}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(r.NgayYeuCau)}</TableCell>
                  <TableCell><Status value={r.TrangThai} /></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                    <Link component={NextLink} href={`/yeu-cau/${r.MaYeuCau}`} aria-label={`${hanhDong} ${ma.yeuCau(r.MaYeuCau)}`} sx={{ fontSize: 14, fontWeight: canXuLy ? 700 : 400 }}>
                      {hanhDong}{canXuLy && ' →'}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
