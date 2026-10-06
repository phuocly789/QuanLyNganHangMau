'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { can, type Role } from '@/lib/roles';
import { formatDateTime, ma, ml } from '@/lib/format';
import type { KetQua } from '@/lib/types';
import type { PhanBoChoTruyenRow, TruyenMauRow } from '@/lib/server/queries-nghiepvu';
import { BloodGroup, Code, Field, FormSection, Notice, numSx, PageHeader, Status, stick1Sx, stick2Sx, tableWrapSx } from '@/components/ui';
import { ghiNhanTruyenMauAction } from '@/app/actions/nghiepVu';

// Các trạng thái ghi trong chú thích tham số @TrangThai của sp_GhiNhanTruyenMau
const TRANG_THAI = ['Hoàn thành', 'Đang thực hiện', 'Dừng do sốc phản vệ', 'Đã hủy'];

interface Props {
  role: Role;
  choTruyen: PhanBoChoTruyenRow[];
  truyenMau: TruyenMauRow[];
  maPhanBoChon: number | null;
  nguoiThucHien: string;
  bayGio: string;
  maKeTiep: string;
}

export default function TruyenMauView({ role, choTruyen, truyenMau, maPhanBoChon, nguoiThucHien, bayGio, maKeTiep }: Props) {
  const [ketQua, setKetQua] = useState<KetQua | null>(null);
  const [maPhanBo, setMaPhanBo] = useState<number | ''>(choTruyen.some((p) => p.MaPhanBo === maPhanBoChon) ? maPhanBoChon! : '');

  return (
    <Box>
      <PageHeader title="Truyền máu" caption={`${choTruyen.length} phân bổ chờ ghi nhận truyền · ${truyenMau.length} ca đã ghi nhận`} />
      <Notice result={ketQua} sx={{ mb: ketQua ? 2 : 0 }} />

      {can(role, 'ghiNhanTruyenMau') && choTruyen.length > 0 && (
        <GhiNhanForm
          key={maPhanBo}
          choTruyen={choTruyen}
          maPhanBo={maPhanBo}
          setMaPhanBo={setMaPhanBo}
          nguoiThucHienMacDinh={nguoiThucHien}
          bayGio={bayGio}
          maKeTiep={maKeTiep}
          onDone={(r) => { setKetQua(r); setMaPhanBo(''); }}
        />
      )}

      <Box component="section" aria-labelledby="cho-title" sx={{ mb: 4 }}>
        <Typography id="cho-title" variant="h3" component="h2" sx={{ mb: 1 }}>Phân bổ chờ truyền</Typography>
        {choTruyen.length === 0 ? (
          <Typography variant="body2" sx={{ color: C.muted, borderTop: `1px solid ${C.line}`, pt: 1.25 }}>Không có phân bổ nào đang chờ ghi nhận truyền máu.</Typography>
        ) : (
          <Box sx={tableWrapSx}>
            <Table size="small" aria-label="Phân bổ chờ truyền">
              <TableHead>
                <TableRow>
                  <TableCell sx={stick1Sx}>Phân bổ</TableCell>
                  <TableCell sx={stick2Sx}>Nhóm máu</TableCell>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Chế phẩm</TableCell>
                  <TableCell sx={numSx}>Thể tích</TableCell>
                  <TableCell>Yêu cầu</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  {can(role, 'ghiNhanTruyenMau') && <TableCell aria-label="Hành động" />}
                </TableRow>
              </TableHead>
              <TableBody>
                {choTruyen.map((p) => (
                  <TableRow key={p.MaPhanBo} hover>
                    <TableCell sx={stick1Sx}><Code>{ma.phanBo(p.MaPhanBo)}</Code></TableCell>
                    <TableCell sx={stick2Sx}><BloodGroup value={p.TenNhomMau} /></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {p.HoTenBenhNhan}
                      <Box component="span" sx={{ display: 'block', fontSize: 12.5, color: C.muted }}>{p.TenKhoa}</Box>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Code>{ma.chePham(p.MaChePham)}</Code> {p.LoaiChePham}</TableCell>
                    <TableCell sx={numSx}>{ml(p.TheTich)}</TableCell>
                    <TableCell><Link component={NextLink} href={`/yeu-cau/${p.MaYeuCau}`} sx={{ fontSize: 14 }}>{ma.yeuCau(p.MaYeuCau)}</Link></TableCell>
                    <TableCell><Status value={p.TrangThai} /></TableCell>
                    {can(role, 'ghiNhanTruyenMau') && (
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button variant="text" onClick={() => { setMaPhanBo(p.MaPhanBo); setKetQua(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                          Ghi nhận
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>

      <Box component="section" aria-labelledby="ls-title">
        <Typography id="ls-title" variant="h3" component="h2" sx={{ mb: 1 }}>Các ca truyền máu</Typography>
        <Box sx={{ ...tableWrapSx, maxHeight: '60vh' }}>
          <Table stickyHeader size="small" aria-label="Các ca truyền máu">
            <TableHead>
              <TableRow>
                <TableCell sx={stick1Sx}>Mã ca</TableCell>
                <TableCell sx={stick2Sx}>Nhóm máu</TableCell>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Bắt đầu</TableCell>
                <TableCell>Kết thúc</TableCell>
                <TableCell sx={numSx}>Thể tích</TableCell>
                <TableCell>Người thực hiện</TableCell>
                <TableCell>Phản ứng phụ</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {truyenMau.map((t) => (
                <TableRow key={t.MaTruyenMau} hover>
                  <TableCell sx={stick1Sx}><Code>{t.MaTruyenMau}</Code></TableCell>
                  <TableCell sx={stick2Sx}><BloodGroup value={t.TenNhomMau} /></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {t.HoTenBenhNhan}
                    <Box component="span" sx={{ display: 'block', fontSize: 12.5, color: C.muted }}>{ma.yeuCau(t.MaYeuCau)} · {t.LoaiChePham}</Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(t.NgayGioBatDau)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(t.NgayGioKetThuc)}</TableCell>
                  <TableCell sx={numSx}>{t.TheTichTruyen != null ? ml(t.TheTichTruyen) : '—'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{t.NguoiThucHien}</TableCell>
                  <TableCell sx={{ color: t.PhanUngPhu ? C.ink : C.muted, minWidth: 180 }}>{t.PhanUngPhu || 'Không ghi nhận'}</TableCell>
                  <TableCell><Status value={t.TrangThai} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

/** Form gọi sp_GhiNhanTruyenMau. Giờ kết thúc phải sau giờ bắt đầu (procedure kiểm tra). */
function GhiNhanForm({
  choTruyen,
  maPhanBo,
  setMaPhanBo,
  nguoiThucHienMacDinh,
  bayGio,
  maKeTiep,
  onDone,
}: {
  choTruyen: PhanBoChoTruyenRow[];
  maPhanBo: number | '';
  setMaPhanBo: (v: number | '') => void;
  nguoiThucHienMacDinh: string;
  bayGio: string;
  maKeTiep: string;
  onDone: (r: KetQua) => void;
}) {
  const pb = choTruyen.find((p) => p.MaPhanBo === maPhanBo);
  // Mã do hệ thống cấp (chỉ đọc) – luôn lấy theo dữ liệu mới nhất từ server
  const maTruyenMau = maKeTiep;
  const router = useRouter();
  const [batDau, setBatDau] = useState(bayGio);
  const [ketThuc, setKetThuc] = useState('');
  const [nguoiThucHien, setNguoiThucHien] = useState(nguoiThucHienMacDinh);
  const [theTich, setTheTich] = useState(pb ? String(pb.TheTich) : '');
  const [phanUngPhu, setPhanUngPhu] = useState('');
  const [trangThai, setTrangThai] = useState('Hoàn thành');
  const [loi, setLoi] = useState<KetQua | null>(null);
  const [pending, startTransition] = useTransition();

  // Kiểm tra ngay khi nhập, cùng điều kiện với procedure
  const loiKetThuc = ketThuc && batDau && ketThuc <= batDau ? 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu.' : loi?.field === 'ketThuc' ? loi.message : null;
  const loiMa = loi?.field === 'maTruyenMau' ? 'Mã vừa được dùng cho ca khác. Hệ thống đã cấp mã mới, bấm Lưu ca truyền lại.' : null;
  const hopLe = maPhanBo !== '' && maTruyenMau.trim() && batDau && nguoiThucHien.trim() && !loiKetThuc;

  const submit = () => {
    if (!hopLe) return;
    setLoi(null);
    startTransition(async () => {
      const r = await ghiNhanTruyenMauAction({ maTruyenMau, maPhanBo, batDau, ketThuc, nguoiThucHien, theTich, phanUngPhu, trangThai });
      if (r.ok) onDone(r);
      else {
        setLoi(r);
        // Trùng mã do người khác vừa lưu: tải lại để lấy mã kế tiếp mới
        if (r.field === 'maTruyenMau') router.refresh();
      }
    });
  };

  return (
    <FormSection id="gn-title" title="Ghi nhận ca truyền máu">
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '2fr 1fr 1fr 1fr' }, gap: 2.5, alignItems: 'start' }}>
          <Field id="gn-pb" label="Phân bổ" hint={pb ? `${pb.HoTenBenhNhan} · ${pb.TenNhomMau} · ${pb.LoaiChePham} ${pb.TheTich} ml` : null}>
            <TextField id="gn-pb" select value={maPhanBo} onChange={(e) => setMaPhanBo(Number(e.target.value))} slotProps={{ select: { displayEmpty: true } }}>
              <MenuItem value="" disabled>Chọn phân bổ</MenuItem>
              {choTruyen.map((p) => (
                <MenuItem key={p.MaPhanBo} value={p.MaPhanBo}>
                  {ma.phanBo(p.MaPhanBo)} · {p.HoTenBenhNhan} · {ma.chePham(p.MaChePham)}
                </MenuItem>
              ))}
            </TextField>
          </Field>
          <Field id="gn-ma" label="Mã ca truyền" error={loiMa} hint="Hệ thống tự cấp mã kế tiếp">
            <TextField id="gn-ma" value={maTruyenMau} error={!!loiMa} sx={{ '& .MuiOutlinedInput-root': { bgcolor: C.sunken } }} slotProps={{ htmlInput: { readOnly: true, 'aria-readonly': true } }} />
          </Field>
          <Field id="gn-bd" label="Bắt đầu">
            <TextField id="gn-bd" type="datetime-local" value={batDau} onChange={(e) => setBatDau(e.target.value)} />
          </Field>
          <Field id="gn-kt" label="Kết thúc" error={loiKetThuc}>
            <TextField id="gn-kt" type="datetime-local" value={ketThuc} error={!!loiKetThuc} onChange={(e) => { setKetThuc(e.target.value); setLoi(null); }} />
          </Field>
          <Field id="gn-nguoi" label="Người thực hiện">
            <TextField id="gn-nguoi" value={nguoiThucHien} onChange={(e) => setNguoiThucHien(e.target.value)} slotProps={{ htmlInput: { maxLength: 100 } }} />
          </Field>
          <Field id="gn-tt" label="Thể tích thực tế (ml)">
            <TextField id="gn-tt" type="number" value={theTich} onChange={(e) => setTheTich(e.target.value)} slotProps={{ htmlInput: { min: 0 } }} />
          </Field>
          <Field id="gn-trangthai" label="Trạng thái">
            <TextField id="gn-trangthai" select value={trangThai} onChange={(e) => setTrangThai(e.target.value)}>
              {TRANG_THAI.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Field>
          <Field id="gn-pu" label="Phản ứng phụ">
            <TextField id="gn-pu" value={phanUngPhu} placeholder="Không có" onChange={(e) => setPhanUngPhu(e.target.value)} slotProps={{ htmlInput: { maxLength: 500 } }} />
          </Field>
        </Box>
        {loi && !loi.field && <Box role="alert" sx={{ mt: 2, color: C.danger, fontSize: 14 }}>{loi.message}</Box>}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, mt: 2.5 }}>
          <Button type="submit" variant="contained" disabled={!hopLe || pending}>{pending ? 'Đang lưu…' : 'Lưu ca truyền'}</Button>
          {trangThai === 'Hoàn thành' && (
            <Box component="span" sx={{ fontSize: 13, color: C.muted }}>Khi lưu Hoàn thành: chế phẩm chuyển Đã sử dụng, yêu cầu chuyển Hoàn tất.</Box>
          )}
        </Box>
      </Box>
    </FormSection>
  );
}
