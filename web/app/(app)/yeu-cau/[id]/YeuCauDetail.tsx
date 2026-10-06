'use client';

import NextLink from 'next/link';
import { Fragment, useState, useTransition, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { C } from '@/lib/theme';
import { can, type Role } from '@/lib/roles';
import { formatDate, formatDateTime, ma, ml } from '@/lib/format';
import type { KetQua, TenNhomMau, TrangThaiYeuCau, TruyenMau } from '@/lib/types';
import type { BenhNhanChiTiet, PhanBoRow, YeuCauRow } from '@/lib/server/queries';
import { BloodGroup, Code, Critical, HanDung, Notice, numSx, Status, stick1Sx, stick2Sx, tableWrapSx } from '@/components/ui';
import { duyetYeuCauAction, phanBoTuDongAction } from '@/app/actions/yeuCau';

interface Props {
  role: Role;
  yc: YeuCauRow;
  benhNhan: BenhNhanChiTiet | null;
  phanBo: PhanBoRow[];
  truyenMau: TruyenMau[];
  nhomChoPhuHop: TenNhomMau[];
}

/** Dòng tiến trình chữ nhỏ – không dùng stepper to */
function TienTrinh({ trangThai }: { trangThai: TrangThaiYeuCau }) {
  const steps: TrangThaiYeuCau[] = trangThai === 'Từ chối' ? ['Chờ xử lý', 'Từ chối'] : ['Chờ xử lý', 'Đã duyệt', 'Đã phân bổ', 'Hoàn tất'];
  const cur = steps.indexOf(trangThai);
  return (
    <Box component="ol" aria-label="Tiến trình yêu cầu" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, listStyle: 'none', m: 0, p: 0, fontSize: 13 }}>
      {steps.map((s, i) => (
        <Box component="li" key={s} aria-current={i === cur ? 'step' : undefined} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: i < cur ? C.ink2 : i === cur ? C.ink : C.muted, fontWeight: i === cur ? 600 : 400 }}>
          {i > 0 && <Box component="span" aria-hidden sx={{ color: C.lineStrong }}>→</Box>}
          <Box component="span" sx={i === cur ? { borderBottom: `2px solid ${s === 'Từ chối' ? C.muted : C.accent}` } : undefined}>{s}</Box>
        </Box>
      ))}
    </Box>
  );
}

function Dl({ items }: { items: [string, ReactNode][] }) {
  return (
    <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: '116px 1fr', rowGap: 1, columnGap: 2, fontSize: 14 }}>
      {items.map(([k, v]) => (
        <Fragment key={k}>
          <Box component="dt" sx={{ color: C.muted }}>{k}</Box>
          <Box component="dd" sx={{ m: 0 }}>{v}</Box>
        </Fragment>
      ))}
    </Box>
  );
}

export default function YeuCauDetail({ role, yc, benhNhan, phanBo, truyenMau, nhomChoPhuHop }: Props) {
  const [ketQua, setKetQua] = useState<KetQua | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<KetQua>) =>
    startTransition(async () => {
      setKetQua(await fn());
    });

  // DaPhanBoMl = dbo.fn_TongTheTichDaPhanBo(MaYeuCau)
  const daPhanBo = yc.DaPhanBoMl;
  const thieu = Math.max(0, yc.SoLuongYeuCau - daPhanBo);
  const pct = Math.min(100, Math.round((daPhanBo / yc.SoLuongYeuCau) * 100));
  const bacSi = can(role, 'ghiNhanTruyenMau');

  return (
    <Box>
      <Box component="nav" aria-label="Đường dẫn" sx={{ fontSize: 13, mb: 1.5 }}>
        <Link component={NextLink} href="/yeu-cau">Yêu cầu cấp máu</Link>
        <Box component="span" sx={{ color: C.muted, mx: 1 }}>/</Box>
        <Box component="span" sx={{ color: C.muted }}>{ma.yeuCau(yc.MaYeuCau)}</Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Typography variant="h1">Yêu cầu {ma.yeuCau(yc.MaYeuCau)}</Typography>
        {yc.MucDoUuTien === 'Cấp cứu' && <Critical>Cấp cứu</Critical>}
      </Box>
      <Box sx={{ mb: 3 }}>
        <TienTrinh trangThai={yc.TrangThai} />
      </Box>

      <Notice result={ketQua} sx={{ mb: ketQua ? 2.5 : 0 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 340px' }, gap: { xs: 4, lg: 6 } }}>
        <Box>
          {/* Cần cấp + tiến độ phân bổ theo ml */}
          <Box component="section" aria-label="Lượng máu cần cấp" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 6, rowGap: 2, px: 3, py: 2.5, mb: 4, bgcolor: C.surface, border: `1px solid ${C.line}`, borderLeft: `4px solid ${thieu > 0 && yc.TrangThai !== 'Từ chối' ? C.danger : C.ok}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BloodGroup value={yc.TenNhomMau} size="xl" />
              <Box>
                <Box sx={{ fontWeight: 600, fontSize: 16 }}>{yc.LoaiChePhamYeuCau}</Box>
                <Box sx={{ fontSize: 14, color: C.ink2 }}>Yêu cầu <b>{ml(yc.SoLuongYeuCau)}</b></Box>
              </Box>
            </Box>
            <Box sx={{ minWidth: 260, flex: 1, maxWidth: 440 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 15, mb: 1 }}>
                <span>Đã phân bổ <b>{ml(daPhanBo)}</b></span>
                {yc.TrangThai === 'Từ chối' ? null : thieu > 0 ? (
                  <Box component="span" sx={{ color: C.danger, fontWeight: 700 }}>Còn thiếu {ml(thieu)}</Box>
                ) : (
                  <Box component="span" sx={{ color: C.ok, fontWeight: 700 }}>Đủ lượng yêu cầu</Box>
                )}
              </Box>
              <Box aria-hidden sx={{ height: 10, bgcolor: C.sunken, borderRadius: '3px', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: thieu > 0 ? C.accent : C.ok }} />
              </Box>
            </Box>
          </Box>

          {/* Duyệt (nhân viên) */}
          {can(role, 'duyetYeuCau') && yc.TrangThai === 'Chờ xử lý' && (
            <Box component="section" aria-labelledby="duyet-title" sx={{ mb: 4 }}>
              <Typography id="duyet-title" variant="h3" component="h2" sx={{ mb: 1 }}>Duyệt yêu cầu</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Yêu cầu cần được duyệt trước khi phân bổ chế phẩm.</Typography>
              <Button variant="contained" disabled={pending} onClick={() => run(() => duyetYeuCauAction(yc.MaYeuCau))}>Duyệt yêu cầu</Button>
            </Box>
          )}

          {/* Tự động phân bổ – sp_PhanBoMauChoYeuCau */}
          {can(role, 'phanBo') && yc.TrangThai === 'Đã duyệt' && (
            <Box component="section" aria-labelledby="pb-title" sx={{ mb: 4 }}>
              <Typography id="pb-title" variant="h3" component="h2" sx={{ mb: 1 }}>Tự động phân bổ</Typography>
              <Typography variant="body2" sx={{ color: C.ink2, mb: 2, maxWidth: 720 }}>
                Hệ thống chọn một chế phẩm {yc.LoaiChePhamYeuCau.toLowerCase()} tương thích với nhóm {yc.TenNhomMau} theo bảng quy tắc tương thích
                (Điều 44 TT 26/2013/TT-BYT), đang lưu trữ, còn hạn; hạn dùng gần nhất được chọn trước (FIFO).
              </Typography>
              <Button variant="contained" disabled={pending} onClick={() => run(() => phanBoTuDongAction(yc.MaYeuCau))}>
                {pending ? 'Đang phân bổ…' : 'Tự động phân bổ'}
              </Button>
            </Box>
          )}

          {/* Danh sách phân bổ */}
          <Box component="section" aria-labelledby="ds-pb-title" sx={{ mb: 4 }}>
            <Typography id="ds-pb-title" variant="h3" component="h2" sx={{ mb: 1 }}>Chế phẩm đã phân bổ</Typography>
            {phanBo.length === 0 ? (
              <Typography variant="body2" sx={{ color: C.muted, borderTop: `1px solid ${C.line}`, pt: 1.25 }}>Chưa có chế phẩm nào được phân bổ.</Typography>
            ) : (
              <Box sx={tableWrapSx}>
                <Table size="small" aria-label="Chế phẩm đã phân bổ">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={stick1Sx}>Chế phẩm</TableCell>
                      <TableCell sx={stick2Sx}>Nhóm máu</TableCell>
                      <TableCell>Tương thích</TableCell>
                      <TableCell sx={numSx}>Thể tích</TableCell>
                      <TableCell>Hạn dùng</TableCell>
                      <TableCell>Vị trí</TableCell>
                      <TableCell>Phân bổ lúc</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      {bacSi && <TableCell aria-label="Hành động" />}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {phanBo.map((p) => {
                      const daTruyen = truyenMau.some((t) => t.MaPhanBo === p.MaPhanBo);
                      return (
                        <TableRow key={p.MaPhanBo} hover>
                          <TableCell sx={stick1Sx}><Code>{ma.chePham(p.MaChePham)}</Code></TableCell>
                          <TableCell sx={stick2Sx}><BloodGroup value={p.TenNhomMau} /></TableCell>
                          {/* dbo.fn_KiemTraTuongThich */}
                          <TableCell>{p.TuongThich ? 'Có' : <Critical>Không</Critical>}</TableCell>
                          <TableCell sx={numSx}>{ml(p.TheTich)}</TableCell>
                          <TableCell><HanDung value={p.HanSuDung} active={p.TrangThai === 'Đã phân bổ'} /></TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap', color: p.TenViTri ? C.ink : C.muted }}>{p.TenViTri ? `${p.TenNganHangMau} → ${p.TenViTri}` : '—'}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(p.ThoiGianPhanBo)}</TableCell>
                          <TableCell>
                            <Status value={p.TrangThai} />
                            {p.TrangThai === 'Đã hủy' && p.LyDoHuy && (
                              <Box sx={{ fontSize: 12.5, color: C.muted, mt: 0.25, minWidth: 160 }}>Lý do: {p.LyDoHuy}</Box>
                            )}
                          </TableCell>
                          {bacSi && (
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                              {p.TrangThai !== 'Đã hủy' && !daTruyen && (
                                <Link component={NextLink} href={`/truyen-mau?phanBo=${p.MaPhanBo}`} sx={{ fontSize: 14 }}>Ghi nhận truyền máu</Link>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Box>

          {/* Truyền máu (bác sĩ, quản lý) */}
          {can(role, 'xemTruyenMau') && truyenMau.length > 0 && (
            <Box component="section" aria-labelledby="tm-title">
              <Typography id="tm-title" variant="h3" component="h2" sx={{ mb: 1 }}>Truyền máu</Typography>
              <Box sx={tableWrapSx}>
                <Table size="small" aria-label="Các ca truyền máu">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã ca</TableCell>
                      <TableCell>Phân bổ</TableCell>
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
                        <TableCell><Code>{t.MaTruyenMau}</Code></TableCell>
                        <TableCell><Code>{ma.phanBo(t.MaPhanBo)}</Code></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(t.NgayGioBatDau)}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(t.NgayGioKetThuc)}</TableCell>
                        <TableCell sx={numSx}>{t.TheTichTruyen != null ? ml(t.TheTichTruyen) : '—'}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{t.NguoiThucHien}</TableCell>
                        <TableCell sx={{ color: t.PhanUngPhu ? C.ink : C.muted }}>{t.PhanUngPhu ?? 'Không ghi nhận'}</TableCell>
                        <TableCell><Status value={t.TrangThai} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}
        </Box>

        <Box component="aside" aria-labelledby="tt-title" sx={{ borderTop: { xs: `1px solid ${C.line}`, lg: 'none' }, borderLeft: { lg: `1px solid ${C.line}` }, pl: { lg: 3 }, pt: { xs: 2, lg: 0 } }}>
          <Typography id="tt-title" variant="h3" component="h2" sx={{ mb: 1.5 }}>Thông tin yêu cầu</Typography>
          <Dl
            items={[
              [
                'Bệnh nhân',
                benhNhan ? (
                  <>
                    <Box sx={{ fontWeight: 500 }}>{benhNhan.HoTen}</Box>
                    <Box sx={{ fontSize: 13, color: C.muted }}>
                      {ma.benhNhan(benhNhan.MaBenhNhan)} · {benhNhan.GioiTinh} · {benhNhan.Tuoi} tuổi (sinh {formatDate(benhNhan.NgaySinh)})
                    </Box>
                  </>
                ) : (
                  <Code>{ma.benhNhan(yc.MaBenhNhan)}</Code>
                ),
              ],
              ...(benhNhan
                ? ([
                    ['Nhóm máu BN', <BloodGroup key="g" value={benhNhan.TenNhomMau} />],
                    ['Chẩn đoán', benhNhan.ChanDoanBinhLy ?? '—'],
                  ] as [string, ReactNode][])
                : []),
              ['Khoa', yc.TenKhoa],
              ['Bệnh viện', yc.TenBenhVien],
              ['Bác sĩ chỉ định', yc.BacSiChiDinh ?? '—'],
              ['Ngày yêu cầu', formatDateTime(yc.NgayYeuCau)],
              ['Mức ưu tiên', yc.MucDoUuTien === 'Cấp cứu' ? <Critical key="cc">Cấp cứu</Critical> : 'Bình thường'],
              [
                'Nhóm cho phù hợp',
                <Box key="ncp" sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1 }}>
                  {nhomChoPhuHop.map((g) => <BloodGroup key={g} value={g} />)}
                </Box>,
              ],
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
}
