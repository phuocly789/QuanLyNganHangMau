'use client';

import { useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { C } from '@/lib/theme';
import { formatDate, startOfToday, toIsoDate } from '@/lib/format';
import type { KetQua } from '@/lib/types';
import type { DotRow, NguoiHienRow } from '@/lib/server/queries-nghiepvu';
import { Field, FormSection } from '@/components/ui';
import { tiepNhanHienMauAction } from '@/app/actions/nghiepVu';

// Giá trị hợp lệ theo CHECK constraint của bảng LanHienMau
const LUONG_MAU = [250, 350, 450];
const LOAI_HIEN = ['Máu toàn phần', 'Huyết tương', 'Tiểu cầu'];
const KET_QUA_KHAM = ['Đủ điều kiện', 'Không đủ điều kiện'];

/** Form gọi sp_TiepNhanLanHienMau. Điều kiện 18 tuổi và 84 ngày do procedure (và trigger) kiểm tra;
 *  lỗi trả về hiện ngay dưới trường tương ứng. */
export default function TiepNhanForm({ nguoiHien, dot, onDone, onClose }: { nguoiHien: NguoiHienRow[]; dot: DotRow[]; onDone: (r: KetQua) => void; onClose: () => void }) {
  const [maNguoiHien, setMaNguoiHien] = useState<number | ''>('');
  const [maDot, setMaDot] = useState<number | ''>(dot.find((d) => d.TrangThai === 'Đang diễn ra')?.MaDot ?? '');
  const [ngayHien, setNgayHien] = useState(toIsoDate(startOfToday()));
  const [gioHien, setGioHien] = useState('');
  const [luongMau, setLuongMau] = useState(350);
  const [loaiHienMau, setLoaiHienMau] = useState(LOAI_HIEN[0]);
  const [ketQuaKham, setKetQuaKham] = useState(KET_QUA_KHAM[0]);
  const [ghiChu, setGhiChu] = useState('');
  const [loi, setLoi] = useState<KetQua | null>(null);
  const [pending, startTransition] = useTransition();

  const nh = nguoiHien.find((n) => n.MaNguoiHien === maNguoiHien);
  const loiTruong = (f: string) => (loi && !loi.ok && loi.field === f ? loi.message : null);

  const submit = () => {
    if (maNguoiHien === '' || maDot === '' || !ngayHien) return;
    setLoi(null);
    startTransition(async () => {
      const r = await tiepNhanHienMauAction({ maNguoiHien, maDot, ngayHien, gioHien, luongMau, loaiHienMau, ketQuaKham, ghiChu });
      if (r.ok) onDone(r);
      else setLoi(r);
    });
  };

  return (
    <FormSection id="tiep-nhan-title" title="Tiếp nhận lần hiến" onClose={onClose}>
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1.4fr 1fr 0.8fr' }, gap: 2.5, alignItems: 'start' }}>
          <Field
            id="th-nguoihien"
            label="Người hiến"
            error={loiTruong('nguoiHien')}
            hint={nh ? `${nh.Tuoi ?? '?'} tuổi · lần hiến gần nhất: ${nh.NgayHienGanNhat ? formatDate(nh.NgayHienGanNhat) : 'chưa có'}` : null}
          >
            <TextField id="th-nguoihien" select value={maNguoiHien} error={!!loiTruong('nguoiHien')} onChange={(e) => { setMaNguoiHien(Number(e.target.value)); setLoi(null); }} slotProps={{ select: { displayEmpty: true } }}>
              <MenuItem value="" disabled>Chọn người hiến</MenuItem>
              {nguoiHien.map((n) => (
                <MenuItem key={n.MaNguoiHien} value={n.MaNguoiHien}>
                  {n.HoTen} · {n.TenNhomMau ?? '?'} · CCCD {n.CCCD}
                </MenuItem>
              ))}
            </TextField>
          </Field>
          <Field id="th-dot" label="Đợt hiến máu">
            <TextField id="th-dot" select value={maDot} onChange={(e) => setMaDot(Number(e.target.value))} slotProps={{ select: { displayEmpty: true } }}>
              <MenuItem value="" disabled>Chọn đợt</MenuItem>
              {dot.map((d) => (
                <MenuItem key={d.MaDot} value={d.MaDot}>{d.TenDot} ({d.TrangThai.toLowerCase()})</MenuItem>
              ))}
            </TextField>
          </Field>
          <Field id="th-ngay" label="Ngày hiến" error={loiTruong('ngayHien')}>
            <TextField id="th-ngay" type="date" value={ngayHien} error={!!loiTruong('ngayHien')} onChange={(e) => { setNgayHien(e.target.value); setLoi(null); }} />
          </Field>
          <Field id="th-gio" label="Giờ hiến">
            <TextField id="th-gio" type="time" value={gioHien} onChange={(e) => setGioHien(e.target.value)} />
          </Field>
          <Field id="th-luong" label="Lượng máu">
            <TextField id="th-luong" select value={luongMau} onChange={(e) => setLuongMau(Number(e.target.value))}>
              {LUONG_MAU.map((v) => <MenuItem key={v} value={v}>{v} ml</MenuItem>)}
            </TextField>
          </Field>
          <Field id="th-loai" label="Loại hiến">
            <TextField id="th-loai" select value={loaiHienMau} onChange={(e) => setLoaiHienMau(e.target.value)}>
              {LOAI_HIEN.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Field>
          <Field id="th-kham" label="Kết quả khám">
            <TextField id="th-kham" select value={ketQuaKham} onChange={(e) => setKetQuaKham(e.target.value)}>
              {KET_QUA_KHAM.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Field>
          <Field id="th-ghichu" label="Ghi chú">
            <TextField id="th-ghichu" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} slotProps={{ htmlInput: { maxLength: 500 } }} />
          </Field>
        </Box>

        {loi && !loi.ok && !loi.field && <Box role="alert" sx={{ mt: 2, color: C.danger, fontSize: 14 }}>{loi.message}</Box>}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2.5 }}>
          <Button type="submit" variant="contained" disabled={maNguoiHien === '' || maDot === '' || !ngayHien || pending}>
            {pending ? 'Đang lưu…' : 'Tiếp nhận'}
          </Button>
          <Box component="span" sx={{ fontSize: 13, color: C.muted }}>
            Người hiến phải đủ 18 tuổi, cách lần hiến trước ít nhất 84 ngày. Khám đủ điều kiện thì tạo luôn đơn vị máu chờ xét nghiệm.
          </Box>
        </Box>
      </Box>
    </FormSection>
  );
}
