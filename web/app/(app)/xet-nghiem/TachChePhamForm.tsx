'use client';

import { useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { C } from '@/lib/theme';
import { ma, ml } from '@/lib/format';
import { LOAI_CHE_PHAM, type KetQua, type LoaiChePham } from '@/lib/types';
import type { ChePhamCuaDonViRow, DonViMauRow } from '@/lib/server/queries-nghiepvu';
import { Field, FormSection } from '@/components/ui';
import { tachChePhamAction } from '@/app/actions/nghiepVu';

// Gợi ý theo loại hiến: máu toàn phần tách hồng cầu + huyết tương; gạn tách thì chỉ một loại
const GOI_Y: Record<string, LoaiChePham[]> = {
  'Máu toàn phần': ['Khối hồng cầu', 'Huyết tương tươi đông lạnh'],
  'Huyết tương': ['Huyết tương tươi đông lạnh'],
  'Tiểu cầu': ['Khối tiểu cầu'],
};

// Thể tích điển hình của từng loại (ml) khi tách từ máu toàn phần
const THE_TICH_DIEN_HINH: Record<LoaiChePham, number> = {
  'Khối hồng cầu': 250,
  'Huyết tương tươi đông lạnh': 150,
  'Khối tiểu cầu': 50,
  'Tủa lạnh': 30,
};

/** Form gọi sp_TachChePham. Ràng buộc (đạt chuẩn, trùng loại, tổng thể tích, hạn bảo quản) do procedure kiểm tra. */
export default function TachChePhamForm({
  dv,
  daTach,
  onDone,
}: {
  dv: DonViMauRow;
  daTach: ChePhamCuaDonViRow[];
  onDone: (r: KetQua) => void;
}) {
  const conLai = dv.TheTich - daTach.reduce((a, c) => a + c.TheTich, 0);
  const goiY = GOI_Y[dv.LoaiHienMau] ?? [];
  const chuaTach = LOAI_CHE_PHAM.filter((l) => !daTach.some((c) => c.LoaiChePham === l));
  const macDinh = goiY.find((l) => chuaTach.includes(l)) ?? chuaTach[0] ?? '';

  const theTichGoiY = (loai: LoaiChePham | '') =>
    !loai ? '' : String(dv.LoaiHienMau === 'Máu toàn phần' ? Math.min(THE_TICH_DIEN_HINH[loai], conLai) : conLai);

  const [loai, setLoai] = useState<LoaiChePham | ''>(macDinh);
  const [theTich, setTheTich] = useState(theTichGoiY(macDinh));
  const [ghiChu, setGhiChu] = useState('');
  const [loi, setLoi] = useState<KetQua | null>(null);
  const [pending, startTransition] = useTransition();

  const loiTruong = (f: string) => (loi?.field === f ? loi.message : null);
  const soTheTich = Number(theTich);
  const loiTheTichNgay = theTich && (soTheTich <= 0 || soTheTich > conLai) ? `Thể tích phải từ 1 đến ${conLai} ml (phần còn lại của túi).` : null;

  if (chuaTach.length === 0 || conLai <= 0) {
    return (
      <FormSection id="tach-title" title={`Tách chế phẩm từ ${ma.donViMau(dv.MaDonViMau)}`}>
        <Box sx={{ fontSize: 14, color: C.muted }}>Đơn vị máu đã tách hết (còn lại {ml(Math.max(0, conLai))}).</Box>
      </FormSection>
    );
  }

  const submit = () => {
    if (!loai || !soTheTich || loiTheTichNgay) return;
    setLoi(null);
    startTransition(async () => {
      const r = await tachChePhamAction({ maDonViMau: dv.MaDonViMau, loaiChePham: loai, theTich: soTheTich, ghiChu });
      if (r.ok) onDone(r);
      else setLoi(r);
    });
  };

  return (
    <FormSection id="tach-title" title={`Tách chế phẩm từ ${ma.donViMau(dv.MaDonViMau)}`}>
      <Box sx={{ fontSize: 14, color: C.ink2, mb: 2 }}>
        {dv.LoaiHienMau} · {ml(dv.TheTich)} · còn lại <b>{ml(conLai)}</b>
        {goiY.length > 0 && <> · gợi ý: {goiY.join(' + ')}</>}
      </Box>
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.4fr 0.8fr 1.2fr' }, gap: 2.5, alignItems: 'start' }}>
          <Field id="tach-loai" label="Loại chế phẩm" error={loiTruong('loaiChePham')}>
            <TextField
              id="tach-loai"
              select
              value={loai}
              error={!!loiTruong('loaiChePham')}
              onChange={(e) => {
                const v = e.target.value as LoaiChePham;
                setLoai(v);
                setTheTich(theTichGoiY(v));
                setLoi(null);
              }}
            >
              {chuaTach.map((l) => (
                <MenuItem key={l} value={l}>{l}{goiY.includes(l) ? ' (gợi ý)' : ''}</MenuItem>
              ))}
            </TextField>
          </Field>
          <Field id="tach-tt" label="Thể tích thực tế (ml)" error={loiTheTichNgay ?? loiTruong('theTich')}>
            <TextField
              id="tach-tt"
              type="number"
              value={theTich}
              error={!!(loiTheTichNgay ?? loiTruong('theTich'))}
              onChange={(e) => { setTheTich(e.target.value); setLoi(null); }}
              slotProps={{ htmlInput: { min: 1, max: conLai } }}
            />
          </Field>
          <Field id="tach-gc" label="Ghi chú">
            <TextField id="tach-gc" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} slotProps={{ htmlInput: { maxLength: 500 } }} />
          </Field>
        </Box>
        {loi && !loi.field && <Box role="alert" sx={{ mt: 2, color: C.danger, fontSize: 14 }}>{loi.message}</Box>}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, mt: 2.5 }}>
          <Button type="submit" variant="contained" disabled={!loai || !soTheTich || !!loiTheTichNgay || pending}>
            {pending ? 'Đang tách…' : 'Tách chế phẩm'}
          </Button>
          <Box component="span" sx={{ fontSize: 13, color: C.muted }}>
            Hạn dùng tự tính từ ngày thu thập; chế phẩm mới chờ nhập kho ở màn hình Kho máu.
          </Box>
        </Box>
      </Box>
    </FormSection>
  );
}
