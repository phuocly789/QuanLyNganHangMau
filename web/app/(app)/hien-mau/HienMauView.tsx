'use client';

import NextLink from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { C, FONT_MONO } from '@/lib/theme';
import { can, type Role } from '@/lib/roles';
import { formatDate, formatTime, ma, ml } from '@/lib/format';
import type { KetQua } from '@/lib/types';
import type { DotRow, LanHienRow, NguoiHienRow } from '@/lib/server/queries-nghiepvu';
import { BloodGroup, Code, Field, Notice, numSx, PageHeader, Status, stick1Sx, stick2Sx, tableWrapSx } from '@/components/ui';
import { importNguoiHienAction } from '@/app/actions/nghiepVu';
import TiepNhanForm from './TiepNhanForm';


interface Props {
  role: Role;
  nguoiHien: NguoiHienRow[];
  lanHien: LanHienRow[];
  dot: DotRow[];
}

export default function HienMauView({ role, nguoiHien, lanHien, dot }: Props) {
  const [tab, setTab] = useState(0);
  const [moForm, setMoForm] = useState(false);
  const [ketQua, setKetQua] = useState<KetQua | null>(null);
  const [tim, setTim] = useState('');
  const [filePath, setFilePath] = useState('');
  const [loiImport, setLoiImport] = useState<KetQua | null>(null);
  const [pending, startTransition] = useTransition();

  const nguoiHienLoc = useMemo(() => {
    const q = tim.trim().toLowerCase();
    if (!q) return nguoiHien;
    return nguoiHien.filter((n) => n.HoTen.toLowerCase().includes(q) || n.CCCD.includes(q) || (n.SoDienThoai ?? '').includes(q));
  }, [nguoiHien, tim]);

  const importCsv = () =>
    startTransition(async () => {
      const r = await importNguoiHienAction(filePath);
      setLoiImport(r.ok ? null : r);
      if (r.ok) setKetQua(r);
    });

  return (
    <Box>
      <PageHeader
        title="Hiến máu"
        caption={`${nguoiHien.length} người hiến · ${lanHien.length} lần hiến · ${dot.length} đợt`}
        actions={
          can(role, 'tiepNhanHienMau') && !moForm ? (
            <Button variant="contained" onClick={() => { setMoForm(true); setKetQua(null); }}>Tiếp nhận lần hiến</Button>
          ) : null
        }
      />

      <Notice result={ketQua} sx={{ mb: ketQua ? 2 : 0 }} />

      {moForm && (
        <TiepNhanForm
          nguoiHien={nguoiHien}
          dot={dot}
          onClose={() => setMoForm(false)}
          onDone={(r) => { setMoForm(false); setKetQua(r); setTab(0); }}
        />
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Nội dung hiến máu" sx={{ mb: 3 }}>
        <Tab label="Lần hiến" id="hm-tab-0" aria-controls="hm-panel-0" />
        <Tab label="Người hiến" id="hm-tab-1" aria-controls="hm-panel-1" />
        <Tab label="Đợt hiến máu" id="hm-tab-2" aria-controls="hm-panel-2" />
      </Tabs>

      {tab === 0 && (
        <Box role="tabpanel" id="hm-panel-0" aria-labelledby="hm-tab-0" sx={{ ...tableWrapSx, maxHeight: '70vh' }}>
          <Table stickyHeader size="small" aria-label="Các lần hiến máu">
            <TableHead>
              <TableRow>
                <TableCell sx={stick1Sx}>Mã</TableCell>
                <TableCell sx={stick2Sx}>Nhóm máu</TableCell>
                <TableCell>Người hiến</TableCell>
                <TableCell>Đợt</TableCell>
                <TableCell>Ngày hiến</TableCell>
                <TableCell sx={numSx}>Lượng máu</TableCell>
                <TableCell>Loại hiến</TableCell>
                <TableCell>Kết quả khám</TableCell>
                <TableCell>Đơn vị máu</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lanHien.map((l) => (
                <TableRow key={l.MaLanHien} hover>
                  <TableCell sx={stick1Sx}><Code>LH-{String(l.MaLanHien).padStart(4, '0')}</Code></TableCell>
                  <TableCell sx={stick2Sx}><BloodGroup value={l.TenNhomMau} /></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{l.HoTen}</TableCell>
                  <TableCell sx={{ minWidth: 220 }}>{l.TenDot}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {formatDate(l.NgayHien)}
                    {l.ThoiGianHien && <Box component="span" sx={{ color: C.muted }}> {formatTime(l.ThoiGianHien)}</Box>}
                  </TableCell>
                  <TableCell sx={numSx}>{ml(l.LuongMau)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{l.LoaiHienMau}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', color: l.KetQuaKham === 'Đủ điều kiện' ? C.ink : C.muted }}>{l.KetQuaKham ?? '—'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {l.MaDonViMau ? (
                      <Link component={NextLink} href={`/xet-nghiem?dv=${l.MaDonViMau}`} sx={{ fontFamily: FONT_MONO, fontSize: 13 }}>{ma.donViMau(l.MaDonViMau)}</Link>
                    ) : (
                      <Box component="span" sx={{ color: C.muted }}>—</Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box component="span">
                      <Status value={l.TrangThai} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {tab === 1 && (
        <Box role="tabpanel" id="hm-panel-1" aria-labelledby="hm-tab-1">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <TextField
              value={tim}
              onChange={(e) => setTim(e.target.value)}
              placeholder="Tìm theo tên, CCCD, số điện thoại"
              sx={{ maxWidth: 360 }}
              slotProps={{ htmlInput: { 'aria-label': 'Tìm người hiến' } }}
            />
            <Box sx={{ ml: 'auto', fontSize: 13, color: C.muted }}>{nguoiHienLoc.length} / {nguoiHien.length} người hiến · tuổi tính bằng fn_TinhTuoi</Box>
          </Box>
          <Box sx={{ ...tableWrapSx, maxHeight: '60vh' }}>
            <Table stickyHeader size="small" aria-label="Người hiến máu">
              <TableHead>
                <TableRow>
                  <TableCell sx={stick1Sx}>Mã</TableCell>
                  <TableCell sx={stick2Sx}>Nhóm máu</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell sx={numSx}>Tuổi</TableCell>
                  <TableCell>Giới tính</TableCell>
                  <TableCell>CCCD</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Lần hiến gần nhất</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nguoiHienLoc.map((n) => (
                  <TableRow key={n.MaNguoiHien} hover>
                    <TableCell sx={stick1Sx}><Code>NH-{String(n.MaNguoiHien).padStart(4, '0')}</Code></TableCell>
                    <TableCell sx={stick2Sx}><BloodGroup value={n.TenNhomMau} /></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{n.HoTen}</TableCell>
                    <TableCell sx={numSx}>{n.Tuoi ?? '—'}</TableCell>
                    <TableCell>{n.GioiTinh}</TableCell>
                    <TableCell><Code>{n.CCCD}</Code></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{n.SoDienThoai ?? '—'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{n.NgayHienGanNhat ? formatDate(n.NgayHienGanNhat) : '—'}</TableCell>
                    <TableCell sx={{ color: C.muted, minWidth: 220 }}>{n.DiaChi ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {can(role, 'importNguoiHien') && (
            <Box component="section" aria-labelledby="import-title" sx={{ mt: 4, maxWidth: 760 }}>
              <Typography id="import-title" variant="h3" component="h2" sx={{ mb: 1 }}>Import người hiến từ file CSV</Typography>
              <Typography variant="body2" sx={{ color: C.ink2, mb: 2 }}>
                File UTF-8, dòng đầu là tiêu đề, các cột: MaNguoiHien, HoTen, NgaySinh, GioiTinh, CCCD, SoDienThoai, DiaChi, MaNhomMau.
                Đường dẫn là đường dẫn trên máy chủ SQL Server. Bản ghi trùng mã hoặc CCCD được bỏ qua.
              </Typography>
              <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); importCsv(); }} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: '1 1 360px' }}>
                  <Field id="filePath" label="Đường dẫn file CSV" error={loiImport?.message}>
                    <TextField id="filePath" value={filePath} placeholder="D:\Import\NguoiHienMau.csv" error={!!loiImport} onChange={(e) => { setFilePath(e.target.value); setLoiImport(null); }} />
                  </Field>
                </Box>
                <Button type="submit" variant="outlined" disabled={pending} sx={{ mt: 3 }}>{pending ? 'Đang import…' : 'Import'}</Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {tab === 2 && (
        <Box role="tabpanel" id="hm-panel-2" aria-labelledby="hm-tab-2" sx={tableWrapSx}>
          <Table size="small" aria-label="Đợt hiến máu">
            <TableHead>
              <TableRow>
                <TableCell>Đợt</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell sx={numSx}>Số lượt</TableCell>
                <TableCell sx={numSx}>Tổng thu được</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dot.map((d) => (
                <TableRow key={d.MaDot} hover>
                  <TableCell sx={{ fontWeight: 500, minWidth: 240 }}>{d.TenDot}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {formatDate(d.NgayBD)}{d.NgayKT !== d.NgayBD && ` – ${formatDate(d.NgayKT)}`}
                  </TableCell>
                  <TableCell>{d.DiaDiem ?? '—'}</TableCell>
                  <TableCell sx={numSx}>{d.SoLuot}</TableCell>
                  <TableCell sx={numSx}>{ml(d.TongMl)}</TableCell>
                  <TableCell><Status value={d.TrangThai} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {role === 'quanly' && (
            <Typography variant="caption" component="p" sx={{ p: 1.5 }}>
              Thống kê ml theo 8 nhóm máu xem ở Báo cáo › Kết quả đợt hiến máu.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
