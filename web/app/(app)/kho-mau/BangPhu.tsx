'use client';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { C } from '@/lib/theme';
import { formatDateTime, formatNumber, ma } from '@/lib/format';
import type { LichSuKhoRow, ViTriRow } from '@/lib/server/queries';
import { BloodGroup, Code, numSx, Status, tableWrapSx } from '@/components/ui';

function ThanhSucChua({ dang, sucChua }: { dang: number; sucChua: number }) {
  const pct = Math.min(100, Math.round((dang / sucChua) * 100));
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'flex-end' }}>
      <Box component="span" sx={numSx}>
        {formatNumber(dang)} / {formatNumber(sucChua)}
      </Box>
      <Box aria-hidden sx={{ width: 64, height: 4, bgcolor: C.sunken }}>
        <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: pct >= 100 ? C.warnDot : C.accent }} />
      </Box>
    </Box>
  );
}

export function BangViTri({ viTri }: { viTri: ViTriRow[] }) {
  return (
    <Box sx={{ ...tableWrapSx, maxHeight: '70vh' }}>
      <Table stickyHeader size="small" aria-label="Vị trí lưu trữ">
        <TableHead>
          <TableRow>
            <TableCell>Ngân hàng máu</TableCell>
            <TableCell>Vị trí</TableCell>
            <TableCell>Loại lưu trữ</TableCell>
            <TableCell sx={numSx}>Nhiệt độ</TableCell>
            <TableCell sx={numSx}>Đang chứa / Sức chứa</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ghi chú</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {viTri.map((v) => (
            <TableRow key={v.MaViTri} hover>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{v.TenNganHangMau}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{v.TenViTri}</TableCell>
              <TableCell>{v.LoaiLuuTru}</TableCell>
              <TableCell sx={numSx}>{v.NhietDoBaoQuan} °C</TableCell>
              <TableCell>
                <ThanhSucChua dang={v.LuongHienTai} sucChua={v.SucChua} />
              </TableCell>
              <TableCell>
                <Status value={v.TrangThai} />
              </TableCell>
              <TableCell sx={{ color: C.muted, minWidth: 200 }}>{v.GhiChu}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export function BangLichSuKho({ lichSu }: { lichSu: LichSuKhoRow[] }) {
  return (
    <>
      <Typography variant="caption" component="p" sx={{ mb: 1.5 }}>
        Chỉ đọc. Lịch sử kho được ghi tự động khi nhập kho, xuất kho, kiểm kê và cập nhật hết hạn.
      </Typography>
      <Box sx={{ ...tableWrapSx, maxHeight: '70vh' }}>
        <Table stickyHeader size="small" aria-label="Lịch sử kho">
          <TableHead>
            <TableRow>
              <TableCell>Thời gian</TableCell>
              <TableCell>Giao dịch</TableCell>
              <TableCell>Chế phẩm</TableCell>
              <TableCell>Nhóm máu</TableCell>
              <TableCell>Từ → Đến</TableCell>
              <TableCell sx={numSx}>Thay đổi</TableCell>
              <TableCell>Người thực hiện</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lichSu.map((l) => (
              <TableRow key={l.MaGiaoDich} hover>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(l.NgayGioGiaoDich)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{l.LoaiGiaoDich}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Code>{ma.chePham(l.MaChePham)}</Code>
                  <Box component="span" sx={{ color: C.muted, ml: 1 }}>{l.LoaiChePham}</Box>
                </TableCell>
                <TableCell>
                  <BloodGroup value={l.TenNhomMau} />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {l.TenViTriCu ?? '—'} → {l.TenViTriMoi ?? '—'}
                </TableCell>
                <TableCell sx={numSx}>{formatNumber(l.SoLuongThayDoi)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{l.NguoiThucHien ?? '—'}</TableCell>
                <TableCell>
                  <Status value={l.TrangThai} />
                </TableCell>
                <TableCell sx={{ color: C.muted, minWidth: 220 }}>{l.GhiChu}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
