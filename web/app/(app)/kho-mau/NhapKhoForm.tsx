'use client';

import { useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { C } from '@/lib/theme';
import { ma } from '@/lib/format';
import type { KetQua } from '@/lib/types';
import type { ChePhamRow, ViTriRow } from '@/lib/server/queries';
import { Field } from '@/components/ui';
import { nhapKhoAction } from '@/app/actions/kho';

/** Gọi sp_NhapKhoChePham. Lỗi "Vị trí lưu trữ đã đầy!" do procedure trả về hiện ngay dưới trường Vị trí. */
export default function NhapKhoForm({
  chePham,
  viTri,
  onDone,
  onClose,
}: {
  chePham: ChePhamRow[];
  viTri: ViTriRow[];
  onDone: (r: KetQua) => void;
  onClose: () => void;
}) {
  // Chế phẩm chờ nhập: đang lưu trữ nhưng chưa có vị trí
  const choNhap = chePham.filter((c) => c.TrangThai === 'Đang lưu trữ' && c.MaViTri === null);
  const [maChePham, setMaChePham] = useState<number | ''>('');
  const [maViTri, setMaViTri] = useState<number | ''>('');
  const [ghiChu, setGhiChu] = useState('');
  const [loi, setLoi] = useState<KetQua | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (maChePham === '' || maViTri === '') return;
    setLoi(null);
    startTransition(async () => {
      const r = await nhapKhoAction({ maChePham, maViTri, ghiChu });
      if (r.ok) onDone(r);
      else setLoi(r);
    });
  };

  return (
    <Box component="section" aria-labelledby="nhap-kho-title" sx={{ borderTop: `2px solid ${C.accent}`, borderBottom: `1px solid ${C.line}`, bgcolor: C.surface, px: { xs: 2, md: 3 }, py: 2.5, mb: 3 }}>
      <Typography id="nhap-kho-title" variant="h3" component="h2" sx={{ mb: 2 }}>Nhập kho chế phẩm</Typography>

      {choNhap.length === 0 ? (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Không có chế phẩm nào đang chờ nhập kho (chế phẩm Đang lưu trữ chưa có vị trí).
          </Typography>
          <Button variant="outlined" onClick={onClose}>Đóng</Button>
        </Box>
      ) : (
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1.2fr 1fr' }, gap: 2.5, alignItems: 'start' }}>
            <Field id="nk-chepham" label="Chế phẩm">
              <TextField id="nk-chepham" select value={maChePham} onChange={(e) => setMaChePham(Number(e.target.value))} slotProps={{ select: { displayEmpty: true } }}>
                <MenuItem value="" disabled>Chọn chế phẩm chờ nhập</MenuItem>
                {choNhap.map((c) => (
                  <MenuItem key={c.MaChePham} value={c.MaChePham}>
                    {ma.chePham(c.MaChePham)} · {c.TenNhomMau} · {c.LoaiChePham} · {c.TheTich} ml
                  </MenuItem>
                ))}
              </TextField>
            </Field>
            <Field id="nk-vitri" label="Vị trí lưu trữ" error={loi?.field === 'viTri' ? loi.message : null}>
              <TextField
                id="nk-vitri"
                select
                value={maViTri}
                onChange={(e) => { setMaViTri(Number(e.target.value)); setLoi(null); }}
                error={loi?.field === 'viTri'}
                slotProps={{ select: { displayEmpty: true } }}
              >
                <MenuItem value="" disabled>Chọn vị trí</MenuItem>
                {viTri.map((v) => (
                  <MenuItem key={v.MaViTri} value={v.MaViTri}>
                    {v.TenNganHangMau} → {v.TenViTri} ({v.LuongHienTai}/{v.SucChua}, {v.TrangThai.toLowerCase()})
                  </MenuItem>
                ))}
              </TextField>
            </Field>
            <Field id="nk-ghichu" label="Ghi chú (không bắt buộc)">
              <TextField id="nk-ghichu" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} slotProps={{ htmlInput: { maxLength: 500 } }} />
            </Field>
          </Box>

          {loi && loi.field !== 'viTri' && (
            <Box role="alert" sx={{ mt: 2, color: C.danger, fontSize: 14 }}>{loi.message}</Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2.5 }}>
            <Button type="submit" variant="contained" disabled={maChePham === '' || maViTri === '' || pending}>
              {pending ? 'Đang lưu…' : 'Lưu nhập kho'}
            </Button>
            <Button variant="text" onClick={onClose}>Hủy bỏ</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
