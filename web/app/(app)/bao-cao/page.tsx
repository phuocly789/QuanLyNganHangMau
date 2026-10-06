import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { requireSession } from '@/lib/server/db';
import {
  baoCaoDapUng,
  baoCaoKetQuaDot,
  baoCaoSapHetHan,
  baoCaoTruyenMau,
  dsDotDonGian,
  tonKhoTheoNganHang,
  tonKhoTheoNhom,
} from '@/lib/server/queries-baocao';
import { ROUTE_ROLES } from '@/lib/roles';
import { formatDate, formatDateTime, ma, ml } from '@/lib/format';
import { C } from '@/lib/colors';
import { BloodGroup, Code, Critical, HanDung, PageHeader, Status } from '@/components/ui';
import { numSx, tableWrapSx } from '@/lib/styles';
import LinkTabs from '@/components/LinkTabs';

export const metadata = { title: 'Báo cáo · Ngân hàng máu' };

const BAO_CAO = [
  { id: '1', ten: 'Tồn kho theo nhóm máu', nguon: 'Mục 3.1' },
  { id: '2', ten: 'Chế phẩm sắp hết hạn', nguon: 'sp_BaoCaoChePhamSapHetHan' },
  { id: '3', ten: 'Kết quả đợt hiến máu', nguon: 'sp_BaoCaoKetQuaDotHienMau' },
  { id: '4', ten: 'Yêu cầu và đáp ứng', nguon: 'Mục 3.4' },
  { id: '5', ten: 'Tình hình truyền máu', nguon: 'Mục 3.5' },
];

const H = ({ children, num }: { children: ReactNode; num?: boolean }) => <TableCell sx={num ? numSx : undefined}>{children}</TableCell>;

const selectSx = {
  height: 36,
  px: 1,
  border: `1px solid ${C.lineStrong}`,
  borderRadius: '3px',
  bgcolor: C.surface,
  font: 'inherit',
  fontSize: 14,
  color: C.ink,
} as const;

export default async function BaoCaoPage({ searchParams }: PageProps<'/bao-cao'>) {
  const s = await requireSession(ROUTE_ROLES['/bao-cao']);
  const sp = await searchParams;
  const bc = typeof sp.bc === 'string' && BAO_CAO.some((b) => b.id === sp.bc) ? sp.bc : '1';
  const soNgay = Math.min(365, Math.max(1, Number(sp.soNgay) || 7));
  const maDot = Number(sp.dot) || null;
  const hienTai = BAO_CAO.find((b) => b.id === bc)!;

  let noiDung: ReactNode = null;

  if (bc === '1') {
    const [a, b] = await Promise.all([tonKhoTheoNhom(s), tonKhoTheoNganHang(s)]);
    noiDung = (
      <>
        <Box component="h2" sx={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: C.ink2, mb: 1 }}>
          A. Theo nhóm máu và loại chế phẩm ({a.length} dòng)
        </Box>
        <Box sx={{ ...tableWrapSx, maxHeight: '55vh', mb: 4, maxWidth: 900 }}>
          <Table stickyHeader size="small">
            <TableHead><TableRow><H>Nhóm máu</H><H>Loại chế phẩm</H><H num>Số túi</H><H num>Thể tích</H></TableRow></TableHead>
            <TableBody>
              {a.map((r) => (
                <TableRow key={`${r.MaNhomMau}-${r.LoaiChePham}`} hover sx={r.SoTui > 0 ? { '& td': { bgcolor: C.okSoft, fontWeight: 600 } } : { '& td': { color: C.muted } }}>
                  <TableCell><BloodGroup value={r.TenNhomMau} /></TableCell>
                  <TableCell>{r.LoaiChePham}</TableCell>
                  <TableCell sx={numSx}>{r.SoTui}</TableCell>
                  <TableCell sx={numSx}>{ml(r.TheTich_ml)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box component="h2" sx={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: C.ink2, mb: 1 }}>
          B. Chi tiết theo ngân hàng máu
        </Box>
        <Box sx={{ ...tableWrapSx, maxWidth: 1100 }}>
          <Table size="small">
            <TableHead><TableRow><H>Ngân hàng máu</H><H>Nhóm máu</H><H>Loại chế phẩm</H><H num>Số túi</H><H num>Thể tích</H></TableRow></TableHead>
            <TableBody>
              {b.map((r, i) => (
                <TableRow key={i} hover>
                  <TableCell>{r.TenNganHangMau}</TableCell>
                  <TableCell><BloodGroup value={r.TenNhomMau} /></TableCell>
                  <TableCell>{r.LoaiChePham}</TableCell>
                  <TableCell sx={numSx}>{r.SoTui}</TableCell>
                  <TableCell sx={numSx}>{ml(r.TheTich_ml)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </>
    );
  } else if (bc === '2') {
    const rows = await baoCaoSapHetHan(s, soNgay);
    noiDung = (
      <>
        <Box component="form" method="get" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, fontSize: 14 }}>
          <input type="hidden" name="bc" value="2" />
          <label htmlFor="soNgay">Số ngày cảnh báo</label>
          <Box component="input" id="soNgay" name="soNgay" type="number" min={1} max={365} defaultValue={soNgay} sx={{ ...selectSx, width: 90 }} />
          <Button type="submit" variant="outlined">Xem</Button>
          <Box sx={{ ml: 'auto', color: C.muted, fontSize: 13 }}>{rows.length} chế phẩm</Box>
        </Box>
        <Box sx={tableWrapSx}>
          <Table size="small">
            <TableHead><TableRow><H>Mã</H><H>Nhóm máu</H><H>Loại chế phẩm</H><H num>Thể tích</H><H>Ngày tách</H><H>Hạn dùng</H><H num>Số ngày còn lại</H><H>Vị trí</H></TableRow></TableHead>
            <TableBody>
              {rows.length === 0 && <TableRow><TableCell colSpan={8} sx={{ py: 3, textAlign: 'center', color: C.muted }}>Không có chế phẩm hết hạn trong {soNgay} ngày tới.</TableCell></TableRow>}
              {rows.map((r) => (
                <TableRow key={r.MaChePham} hover>
                  <TableCell><Code>{ma.chePham(r.MaChePham)}</Code></TableCell>
                  <TableCell><BloodGroup value={r.TenNhomMau} /></TableCell>
                  <TableCell>{r.LoaiChePham}</TableCell>
                  <TableCell sx={numSx}>{ml(r.TheTich)}</TableCell>
                  <TableCell>{formatDate(r.NgayTachChePham)}</TableCell>
                  <TableCell><HanDung value={r.HanSuDung} /></TableCell>
                  <TableCell sx={numSx}>{r.SoNgayConLai}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}><Box component="span" sx={{ color: C.muted }}>{r.TenNganHangMau} → </Box>{r.TenViTri}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </>
    );
  } else if (bc === '3') {
    const [rows, dot] = await Promise.all([baoCaoKetQuaDot(s, maDot), dsDotDonGian(s)]);
    const nhom: [string, keyof (typeof rows)[number]][] = [
      ['O+', 'Nhom_O_Pos_ml'], ['A+', 'Nhom_A_Pos_ml'], ['B+', 'Nhom_B_Pos_ml'], ['AB+', 'Nhom_AB_Pos_ml'],
      ['O-', 'Nhom_O_Neg_ml'], ['A-', 'Nhom_A_Neg_ml'], ['B-', 'Nhom_B_Neg_ml'], ['AB-', 'Nhom_AB_Neg_ml'],
    ];
    noiDung = (
      <>
        <Box component="form" method="get" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, fontSize: 14 }}>
          <input type="hidden" name="bc" value="3" />
          <label htmlFor="dot">Đợt hiến máu</label>
          <Box component="select" id="dot" name="dot" defaultValue={maDot ?? ''} sx={{ ...selectSx, minWidth: 320 }}>
            <option value="">Tất cả các đợt</option>
            {dot.map((d) => <option key={d.MaDot} value={d.MaDot}>{d.TenDot}</option>)}
          </Box>
          <Button type="submit" variant="outlined">Xem</Button>
        </Box>
        <Box sx={tableWrapSx}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <H>Đợt</H><H>Trạng thái</H><H num>Đăng ký</H><H num>Thành công</H><H num>Không đạt</H><H num>Tổng thu được</H>
                {nhom.map(([g]) => <TableCell key={g} sx={{ ...numSx, fontFamily: 'var(--font-roboto-mono)' }}>{g}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.MaDot} hover>
                  <TableCell sx={{ minWidth: 220 }}>
                    {r.TenDot}
                    <Box component="span" sx={{ display: 'block', fontSize: 12.5, color: C.muted }}>{formatDate(r.NgayBD)} · {r.DiaDiem}</Box>
                  </TableCell>
                  <TableCell><Status value={r.TrangThaiDot} /></TableCell>
                  <TableCell sx={numSx}>{r.TongLuotDangKy}</TableCell>
                  <TableCell sx={numSx}>{r.SoLuotHienThanhCong}</TableCell>
                  <TableCell sx={numSx}>{r.SoLuotKhongDat}</TableCell>
                  <TableCell sx={{ ...numSx, fontWeight: 500 }}>{ml(r.TongLuongMauThuDuoc_ml)}</TableCell>
                  {nhom.map(([g, k]) => (
                    <TableCell key={g} sx={{ ...numSx, color: r[k] ? C.ink : C.muted }}>{r[k] ? ml(r[k] as number) : '0'}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </>
    );
  } else if (bc === '4') {
    const rows = await baoCaoDapUng(s);
    noiDung = (
      <Box sx={tableWrapSx}>
        <Table size="small">
          <TableHead><TableRow><H>Yêu cầu</H><H>Bệnh nhân</H><H>Khoa</H><H>Nhóm</H><H>Loại chế phẩm</H><H num>Yêu cầu</H><H num>Số túi</H><H num>Đã phân bổ</H><H num>Còn thiếu</H><H>Ưu tiên</H><H>Trạng thái</H></TableRow></TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.MaYeuCau} hover>
                <TableCell><Code>{ma.yeuCau(r.MaYeuCau)}</Code></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.TenBenhNhan}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.TenKhoa}</TableCell>
                <TableCell><BloodGroup value={r.TenNhomMau} /></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.LoaiChePhamYeuCau}</TableCell>
                <TableCell sx={numSx}>{ml(r.TheTichYeuCau_ml)}</TableCell>
                <TableCell sx={numSx}>{r.SoTuiDaPhanBo}</TableCell>
                <TableCell sx={numSx}>{ml(r.TheTichDaPhanBo_ml)}</TableCell>
                <TableCell sx={{ ...numSx, color: r.TheTichConThieu_ml > 0 && r.TrangThai !== 'Từ chối' ? C.danger : C.muted, fontWeight: r.TheTichConThieu_ml > 0 ? 500 : 400 }}>
                  {ml(r.TheTichConThieu_ml)}
                </TableCell>
                <TableCell>{r.MucDoUuTien === 'Cấp cứu' ? <Critical>Cấp cứu</Critical> : 'Bình thường'}</TableCell>
                <TableCell><Status value={r.TrangThai} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  } else {
    const rows = await baoCaoTruyenMau(s);
    noiDung = (
      <Box sx={tableWrapSx}>
        <Table size="small">
          <TableHead><TableRow><H>Yêu cầu</H><H>Nhóm</H><H>Loại chế phẩm</H><H num>Yêu cầu</H><H>Phân bổ</H><H>Chế phẩm</H><H>Ca truyền</H><H>Thời gian truyền</H><H num>Thể tích</H><H>Truyền máu</H><H>Phản ứng phụ</H></TableRow></TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i} hover>
                <TableCell><Code>{ma.yeuCau(r.MaYeuCau)}</Code></TableCell>
                <TableCell><BloodGroup value={r.TenNhomMau} /></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.LoaiChePhamYeuCau}</TableCell>
                <TableCell sx={numSx}>{ml(r.TheTichYeuCau_ml)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {r.MaPhanBo ? <><Code>{ma.phanBo(r.MaPhanBo)}</Code> <Status value={r.TrangThaiPhanBo ?? ''} /></> : '—'}
                  {r.LyDoHuy && <Box component="span" sx={{ display: 'block', fontSize: 12.5, color: C.muted }}>Lý do hủy: {r.LyDoHuy}</Box>}
                </TableCell>
                <TableCell>{r.MaChePham ? <Code>{ma.chePham(r.MaChePham)}</Code> : '—'}</TableCell>
                <TableCell>{r.MaTruyenMau ? <Code>{r.MaTruyenMau}</Code> : '—'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {r.NgayGioBatDau ? (
                    <>
                      {formatDateTime(r.NgayGioBatDau)}
                      <Box component="span" sx={{ display: 'block', fontSize: 12.5, color: C.muted }}>
                        đến {r.NgayGioKetThuc ? formatDateTime(r.NgayGioKetThuc) : 'chưa kết thúc'}
                      </Box>
                    </>
                  ) : '—'}
                </TableCell>
                <TableCell sx={numSx}>{r.TheTichTruyen != null ? ml(r.TheTichTruyen) : '—'}</TableCell>
                <TableCell><Status value={r.TrangThaiTruyen} /></TableCell>
                <TableCell sx={{ minWidth: 110, color: r.PhanUngPhu ? C.ink : C.muted }}>{r.PhanUngPhu || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Báo cáo" caption={`${hienTai.ten} · nguồn: ${hienTai.nguon}`} />
      <LinkTabs label="Chọn báo cáo" current={bc} items={BAO_CAO.map((b) => ({ id: b.id, href: `/bao-cao?bc=${b.id}`, text: b.ten }))} />
      {noiDung}
    </Box>
  );
}
