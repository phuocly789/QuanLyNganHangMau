'use client';

import NextLink from 'next/link';
import { useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { C } from '@/lib/theme';
import { can, type Role } from '@/lib/roles';
import { formatDate, formatDateTime, ma, ml } from '@/lib/format';
import type { KetQua } from '@/lib/types';
import type { ChePhamCuaDonViRow, DonViMauRow, KetQuaXNRow, LoaiXetNghiemRow } from '@/lib/server/queries-nghiepvu';
import { BloodGroup, Code, Field, FormSection, HanDung, Notice, numSx, PageHeader, Status, tableWrapSx } from '@/components/ui';
import { nhapKetQuaXetNghiemAction } from '@/app/actions/nghiepVu';
import TachChePhamForm from './TachChePhamForm';

interface Props {
  role: Role;
  donVi: DonViMauRow[];
  loaiXN: LoaiXetNghiemRow[];
  maChon: number | null;
  ketQua: KetQuaXNRow[];
  chePham: ChePhamCuaDonViRow[];
  bayGio: string;
}



export default function XetNghiemView({ role, donVi, loaiXN, maChon, ketQua, chePham, bayGio }: Props) {
  const batBuoc = loaiXN.filter((l) => l.BatBuoc && l.TrangThai === 'Đang áp dụng');
  const dv = donVi.find((d) => d.MaDonViMau === maChon) ?? null;
  const [ketQuaThaoTac, setKetQuaThaoTac] = useState<KetQua | null>(null);

  return (
    <Box>
      <PageHeader
        title="Xét nghiệm"
        caption={`${donVi.filter((d) => d.TrangThai === 'Chờ xét nghiệm').length} đơn vị máu chờ xét nghiệm · ${batBuoc.length} xét nghiệm bắt buộc đang áp dụng`}
      />
      <Notice result={ketQuaThaoTac} sx={{ mb: ketQuaThaoTac ? 2 : 0 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '530px minmax(0, 1fr)' }, gap: { xs: 4, lg: 5 }, alignItems: 'start' }}>
        {/* Danh sách đơn vị máu */}
        <Box component="section" aria-labelledby="dv-title">
          <Typography id="dv-title" variant="h3" component="h2" sx={{ mb: 1 }}>Đơn vị máu</Typography>
          <Box sx={{ ...tableWrapSx, maxHeight: '72vh' }}>
            <Table stickyHeader size="small" aria-label="Đơn vị máu">
              <TableHead>
                <TableRow>
                  <TableCell>Mã</TableCell>
                  <TableCell>Nhóm</TableCell>
                  <TableCell>Thu thập</TableCell>
                  <TableCell sx={numSx}>Bắt buộc đạt</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donVi.map((d) => {
                  const sel = d.MaDonViMau === maChon;
                  return (
                    <TableRow key={d.MaDonViMau} hover selected={sel} sx={sel ? { '& td': { bgcolor: `${C.accentSoft} !important` } } : undefined}>
                      <TableCell>
                        <Box
                          component={NextLink}
                          href={`/xet-nghiem?dv=${d.MaDonViMau}`}
                          scroll={false}
                          aria-current={sel ? 'true' : undefined}
                          sx={{ color: C.accent, textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                        >
                          <Code>{ma.donViMau(d.MaDonViMau)}</Code>
                        </Box>
                      </TableCell>
                      <TableCell><BloodGroup value={d.TenNhomMau} /></TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(d.NgayThuThap)}</TableCell>
                      <TableCell sx={numSx}>
                        {d.SoBatBuocDat} / {batBuoc.length}
                      </TableCell>
                      <TableCell><Status value={d.TrangThai} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Box>

        {/* Chi tiết đơn vị đang chọn */}
        {dv ? (
          <ChiTietDonVi key={dv.MaDonViMau} bayGio={bayGio} role={role} dv={dv} batBuoc={batBuoc} loaiXN={loaiXN} ketQua={ketQua} chePham={chePham} onDone={setKetQuaThaoTac} />
        ) : (
          <Typography variant="body2" sx={{ color: C.muted }}>Chưa có đơn vị máu.</Typography>
        )}
      </Box>
    </Box>
  );
}

function ChiTietDonVi({
  bayGio,
  role,
  dv,
  batBuoc,
  loaiXN,
  ketQua,
  chePham,
  onDone,
}: {
  bayGio: string;
  role: Role;
  dv: DonViMauRow;
  batBuoc: LoaiXetNghiemRow[];
  loaiXN: LoaiXetNghiemRow[];
  ketQua: KetQuaXNRow[];
  chePham: ChePhamCuaDonViRow[];
  onDone: (r: KetQua) => void;
}) {
  // Kết quả mới nhất của từng loại xét nghiệm bắt buộc
  const moiNhat = (maLoai: number) => ketQua.find((k) => k.MaLoaiXN === maLoai);

  return (
    <Box component="section" aria-labelledby="ct-title">
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 2.5, rowGap: 0.5, mb: 2 }}>
        <Typography id="ct-title" variant="h2">{ma.donViMau(dv.MaDonViMau)}</Typography>
        <BloodGroup value={dv.TenNhomMau} size="lg" />
        <Box component="span" sx={{ color: C.muted, fontSize: 14 }}>
          {ml(dv.TheTich)} · thu thập {formatDate(dv.NgayThuThap)} · hết hạn {formatDate(dv.NgayHetHan)}
        </Box>
        <Status value={dv.TrangThai} />
      </Box>

      <Typography variant="h3" component="h3" sx={{ mb: 1 }}>Xét nghiệm bắt buộc</Typography>
      <Box sx={{ ...tableWrapSx, mb: 1 }}>
        <Table size="small" aria-label="Xét nghiệm bắt buộc">
          <TableHead>
            <TableRow>
              <TableCell>Xét nghiệm</TableCell>
              <TableCell>Ngưỡng đạt</TableCell>
              <TableCell sx={numSx}>Giá trị đo</TableCell>
              <TableCell>Kết quả</TableCell>
              <TableCell>Kết luận</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batBuoc.map((l) => {
              const k = moiNhat(l.MaLoaiXN);
              return (
                <TableRow key={l.MaLoaiXN}>
                  <TableCell>{l.TenLoaiXN}</TableCell>
                  <TableCell sx={{ color: C.muted, whiteSpace: 'nowrap' }}>{l.NguongDat ?? '—'}</TableCell>
                  <TableCell sx={numSx}>{k?.GiaTriDo ?? '—'}</TableCell>
                  <TableCell>{k ? <Status value={k.KetQua} /> : <Box component="span" sx={{ color: C.muted }}>Chưa có</Box>}</TableCell>
                  <TableCell>{k ? <Status value={k.KetLuan} /> : '—'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Typography variant="caption" component="p" sx={{ mb: 3 }}>
        Đủ xét nghiệm bắt buộc và đều Đạt thì đơn vị chuyển Đạt chuẩn; chỉ cần một kết quả Dương tính hoặc Không đạt là đơn vị bị loại.
      </Typography>

      {/* Đơn vị đạt chuẩn: tách chế phẩm ngay tại đây (sp_TachChePham) */}
      {can(role, 'tachChePham') && (dv.TrangThai === 'Đạt chuẩn' || dv.TrangThai === 'Đã tách chế phẩm') && (
        <TachChePhamForm key={chePham.length} dv={dv} daTach={chePham} onDone={onDone} />
      )}

      {chePham.length > 0 && (
        <Box component="section" aria-labelledby="cp-title" sx={{ mb: 3 }}>
          <Typography id="cp-title" variant="h3" component="h3" sx={{ mb: 1 }}>Chế phẩm đã tách ({chePham.length})</Typography>
          <Box sx={tableWrapSx}>
            <Table size="small" aria-label="Chế phẩm đã tách">
              <TableHead>
                <TableRow>
                  <TableCell>Mã</TableCell>
                  <TableCell>Loại chế phẩm</TableCell>
                  <TableCell sx={numSx}>Thể tích</TableCell>
                  <TableCell>Ngày tách</TableCell>
                  <TableCell>Hạn dùng</TableCell>
                  <TableCell>Vị trí</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chePham.map((c) => (
                  <TableRow key={c.MaChePham} hover>
                    <TableCell><Code>{ma.chePham(c.MaChePham)}</Code></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{c.LoaiChePham}</TableCell>
                    <TableCell sx={numSx}>{ml(c.TheTich)}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(c.NgayTachChePham)}</TableCell>
                    <TableCell><HanDung value={c.HanSuDung} active={c.TrangThai === 'Đang lưu trữ'} /></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', color: c.TenViTri ? C.ink : C.muted }}>{c.TenViTri ?? (c.TrangThai === 'Đang lưu trữ' ? 'Chờ nhập kho' : '—')}</TableCell>
                    <TableCell><Status value={c.TrangThai} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}

      {can(role, 'nhapXetNghiem') && <NhapKetQuaForm bayGio={bayGio} dv={dv} loaiXN={loaiXN} onDone={onDone} />}

      <Typography variant="h3" component="h3" sx={{ mb: 1 }}>Lịch sử kết quả ({ketQua.length})</Typography>
      {ketQua.length === 0 ? (
        <Typography variant="body2" sx={{ color: C.muted, borderTop: `1px solid ${C.line}`, pt: 1.25 }}>Chưa có kết quả xét nghiệm.</Typography>
      ) : (
        <Box sx={tableWrapSx}>
          <Table size="small" aria-label="Lịch sử kết quả xét nghiệm">
            <TableHead>
              <TableRow>
                <TableCell>Xét nghiệm</TableCell>
                <TableCell>Ngày xét nghiệm</TableCell>
                <TableCell>Trả kết quả</TableCell>
                <TableCell sx={numSx}>Giá trị</TableCell>
                <TableCell>Kết quả</TableCell>
                <TableCell>Kết luận</TableCell>
                <TableCell>Người thực hiện</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ketQua.map((k) => (
                <TableRow key={k.MaXetNghiem} hover>
                  <TableCell sx={{ minWidth: 150 }}>{k.TenLoaiXN}{!k.BatBuoc && <Box component="span" sx={{ color: C.muted }}> (không bắt buộc)</Box>}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(k.NgayXetNghiem)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(k.ThoiGianTraKQ)}</TableCell>
                  <TableCell sx={numSx}>{k.GiaTriDo ?? '—'}</TableCell>
                  <TableCell><Status value={k.KetQua} /></TableCell>
                  <TableCell><Status value={k.KetLuan} /></TableCell>
                  <TableCell>{k.NguoiThucHien ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}

/** Form gọi sp_CapNhatKetQuaXetNghiem */
function NhapKetQuaForm({ bayGio, dv, loaiXN, onDone }: { bayGio: string; dv: DonViMauRow; loaiXN: LoaiXetNghiemRow[]; onDone: (r: KetQua) => void }) {
  const dangApDung = loaiXN.filter((l) => l.TrangThai === 'Đang áp dụng');
  const [maLoaiXN, setMaLoaiXN] = useState<number | ''>('');
  const [ngayXN, setNgayXN] = useState(bayGio);
  const [traKQ, setTraKQ] = useState(bayGio);
  const [giaTriDo, setGiaTriDo] = useState('');
  const [ketQua, setKetQua] = useState('Âm tính');
  const [ketLuan, setKetLuan] = useState('Đạt');
  const [loi, setLoi] = useState<KetQua | null>(null);
  const [pending, startTransition] = useTransition();

  const loiTruong = (f: string) => (loi?.field === f ? loi.message : null);

  const submit = () => {
    if (maLoaiXN === '' || !ngayXN || !traKQ) return;
    setLoi(null);
    startTransition(async () => {
      const r = await nhapKetQuaXetNghiemAction({ maDonViMau: dv.MaDonViMau, maLoaiXN, ngayXetNghiem: ngayXN, thoiGianTraKQ: traKQ, giaTriDo, ketQua, ketLuan });
      if (r.ok) {
        onDone(r);
        setMaLoaiXN('');
        setGiaTriDo('');
      } else setLoi(r);
    });
  };

  return (
    <FormSection id="nhap-kq-title" title={`Nhập kết quả cho ${ma.donViMau(dv.MaDonViMau)}`}>
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', xl: '1.6fr 1fr 1fr' }, gap: 2.5, alignItems: 'start' }}>
          <Field id="xn-loai" label="Loại xét nghiệm">
            <TextField id="xn-loai" select value={maLoaiXN} onChange={(e) => setMaLoaiXN(Number(e.target.value))} slotProps={{ select: { displayEmpty: true } }}>
              <MenuItem value="" disabled>Chọn loại xét nghiệm</MenuItem>
              {dangApDung.map((l) => (
                <MenuItem key={l.MaLoaiXN} value={l.MaLoaiXN}>{l.TenLoaiXN}{l.BatBuoc ? ' · bắt buộc' : ''}</MenuItem>
              ))}
            </TextField>
          </Field>
          <Field id="xn-ngay" label="Ngày xét nghiệm">
            <TextField id="xn-ngay" type="datetime-local" value={ngayXN} onChange={(e) => setNgayXN(e.target.value)} />
          </Field>
          <Field id="xn-tra" label="Thời gian trả kết quả" error={loiTruong('thoiGianTraKQ')}>
            <TextField id="xn-tra" type="datetime-local" value={traKQ} error={!!loiTruong('thoiGianTraKQ')} onChange={(e) => { setTraKQ(e.target.value); setLoi(null); }} />
          </Field>
          <Field id="xn-gt" label="Giá trị đo (không bắt buộc)">
            <TextField id="xn-gt" type="number" value={giaTriDo} onChange={(e) => setGiaTriDo(e.target.value)} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
          </Field>
          <Field id="xn-kq" label="Kết quả">
            <TextField id="xn-kq" select value={ketQua} onChange={(e) => setKetQua(e.target.value)}>
              {['Âm tính', 'Dương tính', 'Không xác định'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Field>
          <Field id="xn-kl" label="Kết luận">
            <TextField id="xn-kl" select value={ketLuan} onChange={(e) => setKetLuan(e.target.value)}>
              {['Đạt', 'Không đạt'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Field>
        </Box>
        {loi && !loi.field && <Box role="alert" sx={{ mt: 2, color: C.danger, fontSize: 14 }}>{loi.message}</Box>}
        <Box sx={{ mt: 2.5 }}>
          <Button type="submit" variant="contained" disabled={maLoaiXN === '' || pending}>{pending ? 'Đang lưu…' : 'Lưu kết quả'}</Button>
        </Box>
      </Box>
    </FormSection>
  );
}
