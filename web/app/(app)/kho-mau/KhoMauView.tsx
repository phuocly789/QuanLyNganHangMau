'use client';

import { useMemo, useState, useTransition } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { C } from '@/lib/theme';
import { can, type Role } from '@/lib/roles';
import { formatDate, ma } from '@/lib/format';
import { LOAI_CHE_PHAM, NHOM_MAU, type KetQua, type LoaiChePham } from '@/lib/types';
import type { ChePhamRow, LichSuKhoRow, TonKhoRow, ViTriRow } from '@/lib/server/queries';
import { BloodGroup, Code, HanDung, Notice, numSx, Status, stick1Sx, stick2Sx, tableWrapSx } from '@/components/ui';
import { capNhatHetHanAction, dongBoViTriAction } from '@/app/actions/kho';
import MaTranTonKho from './MaTranTonKho';
import NhapKhoForm from './NhapKhoForm';
import { BangLichSuKho, BangViTri } from './BangPhu';

const TRANG_THAI_CP = ['Đang lưu trữ', 'Đã cấp phát', 'Đã sử dụng', 'Hết hạn', 'Đã hủy'];

interface Props {
  role: Role;
  tonKho: TonKhoRow[];
  chePham: ChePhamRow[];
  nganHang: { MaNganHangMau: number; TenNganHangMau: string }[];
  viTri: ViTriRow[];
  lichSu: LichSuKhoRow[];
}

export default function KhoMauView({ role, tonKho, chePham, nganHang, viTri, lichSu }: Props) {
  const [tab, setTab] = useState(0);
  const [nhom, setNhom] = useState('');
  const [loai, setLoai] = useState('');
  const [trangThai, setTrangThai] = useState('Đang lưu trữ');
  const [maNganHang, setMaNganHang] = useState<number | ''>('');
  const [moNhapKho, setMoNhapKho] = useState(false);
  const [ketQua, setKetQua] = useState<KetQua | null>(null);
  const [pending, startTransition] = useTransition();

  const coTab = can(role, 'xemViTri');
  const nganHangCoHang = nganHang.filter((n) => chePham.some((c) => c.MaNganHangMau === n.MaNganHangMau));

  const loc = useMemo(
    () =>
      chePham.filter(
        (cp) =>
          (!nhom || cp.TenNhomMau === nhom) &&
          (!loai || cp.LoaiChePham === loai) &&
          (!trangThai || cp.TrangThai === trangThai) &&
          (maNganHang === '' || cp.MaNganHangMau === maNganHang),
      ),
    [chePham, nhom, loai, trangThai, maNganHang],
  );
  const dangLoc = !!(nhom || loai || maNganHang !== '' || trangThai !== 'Đang lưu trữ');

  const xoaLoc = () => {
    setNhom('');
    setLoai('');
    setMaNganHang('');
    setTrangThai('Đang lưu trữ');
  };

  const chonO = (g: string, l: LoaiChePham) => {
    setTrangThai('Đang lưu trữ');
    if (nhom === g && loai === l) {
      setNhom('');
      setLoai('');
    } else {
      setNhom(g);
      setLoai(l);
    }
    document.getElementById('ds-che-pham')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const chay = (fn: () => Promise<KetQua>) =>
    startTransition(async () => {
      setKetQua(await fn());
    });

  const soDangLuuTru = chePham.filter((c) => c.TrangThai === 'Đang lưu trữ').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h1">Kho máu</Typography>
          <Typography variant="caption" component="p" sx={{ mt: 0.5 }}>
            {soDangLuuTru} chế phẩm đang lưu trữ · sắp xếp theo hạn dùng gần nhất trước (FIFO)
          </Typography>
        </Box>
        {can(role, 'nhapKho') && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button variant="text" onClick={() => chay(capNhatHetHanAction)} disabled={pending}>
              Cập nhật chế phẩm hết hạn
            </Button>
            {!moNhapKho && (
              <Button variant="contained" onClick={() => { setMoNhapKho(true); setKetQua(null); }}>Nhập kho</Button>
            )}
          </Box>
        )}
      </Box>

      <Notice result={ketQua} sx={{ mb: ketQua ? 2 : 0 }} />

      {moNhapKho && (
        <NhapKhoForm
          chePham={chePham}
          viTri={viTri}
          onClose={() => setMoNhapKho(false)}
          onDone={(r) => { setMoNhapKho(false); setKetQua(r); }}
        />
      )}

      {coTab && (
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Nội dung kho máu" sx={{ mb: 3 }}>
          <Tab label="Chế phẩm" id="tab-0" aria-controls="panel-0" />
          <Tab label={`Vị trí lưu trữ (${viTri.length})`} id="tab-1" aria-controls="panel-1" />
          <Tab label="Lịch sử kho" id="tab-2" aria-controls="panel-2" />
        </Tabs>
      )}

      {tab === 0 && (
        <Box role={coTab ? 'tabpanel' : undefined} id="panel-0" aria-labelledby={coTab ? 'tab-0' : undefined}>
          <Box component="section" aria-labelledby="ma-tran-title" sx={{ mb: 4, maxWidth: 980 }}>
            <Typography id="ma-tran-title" variant="h3" component="h2" sx={{ mb: 1 }}>Tồn kho theo nhóm máu</Typography>
            <MaTranTonKho rows={tonKho} selected={nhom && loai ? { nhom, loai } : null} onSelect={chonO} />
          </Box>

          <Box component="section" id="ds-che-pham" aria-labelledby="ds-title" sx={{ scrollMarginTop: 110 }}>
            <Typography id="ds-title" variant="h3" component="h2" sx={{ mb: 1.5 }}>Danh sách chế phẩm</Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <TextField select value={nhom} onChange={(e) => setNhom(e.target.value)} sx={{ width: 150 }} slotProps={{ select: { displayEmpty: true }, htmlInput: { 'aria-label': 'Lọc theo nhóm máu' } }}>
                <MenuItem value="">Mọi nhóm máu</MenuItem>
                {NHOM_MAU.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </TextField>
              <TextField select value={loai} onChange={(e) => setLoai(e.target.value)} sx={{ width: 240 }} slotProps={{ select: { displayEmpty: true }, htmlInput: { 'aria-label': 'Lọc theo loại chế phẩm' } }}>
                <MenuItem value="">Mọi loại chế phẩm</MenuItem>
                {LOAI_CHE_PHAM.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </TextField>
              <TextField select value={trangThai} onChange={(e) => setTrangThai(e.target.value)} sx={{ width: 180 }} slotProps={{ select: { displayEmpty: true }, htmlInput: { 'aria-label': 'Lọc theo trạng thái' } }}>
                <MenuItem value="">Mọi trạng thái</MenuItem>
                {TRANG_THAI_CP.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
              <TextField select value={maNganHang} onChange={(e) => setMaNganHang(e.target.value === '' ? '' : Number(e.target.value))} sx={{ width: 260 }} slotProps={{ select: { displayEmpty: true }, htmlInput: { 'aria-label': 'Lọc theo ngân hàng máu' } }}>
                <MenuItem value="">Mọi ngân hàng máu</MenuItem>
                {nganHangCoHang.map((n) => <MenuItem key={n.MaNganHangMau} value={n.MaNganHangMau}>{n.TenNganHangMau}</MenuItem>)}
              </TextField>
              {dangLoc && <Button variant="text" onClick={xoaLoc}>Xóa bộ lọc</Button>}
              <Box sx={{ ml: 'auto', fontSize: 13, color: C.muted }}>{loc.length} / {chePham.length} chế phẩm</Box>
            </Box>

            <Box sx={{ ...tableWrapSx, maxHeight: '70vh' }}>
              <Table stickyHeader size="small" aria-label="Danh sách chế phẩm">
                <TableHead>
                  <TableRow>
                    <TableCell sx={stick1Sx}>Mã</TableCell>
                    <TableCell sx={stick2Sx}>Nhóm máu</TableCell>
                    <TableCell>Loại chế phẩm</TableCell>
                    <TableCell sx={numSx}>Thể tích</TableCell>
                    <TableCell>Ngày tách</TableCell>
                    <TableCell>Hạn dùng</TableCell>
                    <TableCell>Vị trí</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loc.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 3, color: C.muted, textAlign: 'center' }}>Không có chế phẩm khớp bộ lọc.</TableCell>
                    </TableRow>
                  )}
                  {loc.map((cp) => (
                    <TableRow key={cp.MaChePham} hover>
                      <TableCell sx={stick1Sx}><Code>{ma.chePham(cp.MaChePham)}</Code></TableCell>
                      <TableCell sx={stick2Sx}><BloodGroup value={cp.TenNhomMau} /></TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{cp.LoaiChePham}</TableCell>
                      <TableCell sx={numSx}>{cp.TheTich} ml</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(cp.NgayTachChePham)}</TableCell>
                      <TableCell><HanDung value={cp.HanSuDung} active={cp.TrangThai === 'Đang lưu trữ' || cp.TrangThai === 'Đã cấp phát'} /></TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {cp.TenViTri ? (
                          <>
                            <Box component="span" sx={{ color: C.muted }}>{cp.TenNganHangMau} → </Box>
                            {cp.TenViTri}
                          </>
                        ) : (
                          <Box component="span" sx={{ color: C.muted }}>Chưa xếp vị trí</Box>
                        )}
                      </TableCell>
                      <TableCell><Status value={cp.TrangThai} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      )}

      {coTab && tab === 1 && (
        <Box role="tabpanel" id="panel-1" aria-labelledby="tab-1">
          {can(role, 'dongBoViTri') && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 1.5 }}>
              <Typography variant="caption">
                Đếm lại số chế phẩm Đang lưu trữ ở từng vị trí và đánh giá lại trạng thái Đầy / Còn chỗ (bỏ qua vị trí Bảo trì, Không sử dụng).
              </Typography>
              <Button variant="outlined" disabled={pending} onClick={() => chay(dongBoViTriAction)}>Đồng bộ trạng thái vị trí</Button>
            </Box>
          )}
          <BangViTri viTri={viTri} />
        </Box>
      )}
      {coTab && tab === 2 && (
        <Box role="tabpanel" id="panel-2" aria-labelledby="tab-2">
          <BangLichSuKho lichSu={lichSu} />
        </Box>
      )}
    </Box>
  );
}
