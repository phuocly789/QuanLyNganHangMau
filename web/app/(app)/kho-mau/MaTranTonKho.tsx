'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { C } from '@/lib/theme';
import { formatNumber } from '@/lib/format';
import { LOAI_CHE_PHAM, NHOM_MAU, type LoaiChePham } from '@/lib/types';
import type { TonKhoRow } from '@/lib/server/queries';
import { BloodGroup, numSx } from '@/components/ui';

const TEN_NGAN: Record<LoaiChePham, string> = {
  'Khối hồng cầu': 'Khối hồng cầu',
  'Huyết tương tươi đông lạnh': 'Huyết tương TĐL',
  'Khối tiểu cầu': 'Khối tiểu cầu',
  'Tủa lạnh': 'Tủa lạnh',
};

type Cell = { tui: number; ml: number };

function CellText({ c }: { c: Cell }) {
  if (c.tui === 0) return <Box component="span" sx={{ color: C.muted }}>0</Box>;
  return (
    <>
      <Box component="span" sx={{ fontWeight: 700, color: C.ink }}>{c.tui} túi</Box>
      <Box component="span" sx={{ color: C.ink2 }}> · {formatNumber(c.ml)} ml</Box>
    </>
  );
}

/** Ma trận 8 nhóm máu × 4 loại chế phẩm – dữ liệu từ báo cáo 3.1 phần A.
 *  Bấm vào ô để lọc danh sách bên dưới. */
export default function MaTranTonKho({
  rows,
  selected,
  onSelect,
}: {
  rows: TonKhoRow[];
  selected: { nhom: string; loai: string } | null;
  onSelect: (nhom: string, loai: LoaiChePham) => void;
}) {
  const get = (nhom: string, loai: LoaiChePham): Cell => {
    const r = rows.find((x) => x.TenNhomMau === nhom && x.LoaiChePham === loai);
    return { tui: r?.SoTui ?? 0, ml: r?.TheTich_ml ?? 0 };
  };
  const tongCot = (loai: LoaiChePham): Cell =>
    rows.filter((x) => x.LoaiChePham === loai).reduce((a, x) => ({ tui: a.tui + x.SoTui, ml: a.ml + x.TheTich_ml }), { tui: 0, ml: 0 });

  return (
    <Box>
      <Box sx={{ overflowX: 'auto', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <Table size="small" aria-label="Tồn kho theo nhóm máu và loại chế phẩm">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 96 }}>Nhóm máu</TableCell>
              {LOAI_CHE_PHAM.map((l) => (
                <TableCell key={l} sx={numSx} title={l}>{TEN_NGAN[l]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {NHOM_MAU.map((g, i) => (
              <TableRow key={g} sx={i === 4 ? { '& td, & th': { borderTop: `1px solid ${C.lineStrong}` } } : undefined}>
                <TableCell component="th" scope="row" sx={{ py: 0.75 }}>
                  <BloodGroup value={g} size="lg" />
                </TableCell>
                {LOAI_CHE_PHAM.map((l) => {
                  const c = get(g, l);
                  const isSel = selected?.nhom === g && selected?.loai === l;
                  return (
                    <TableCell
                      key={l}
                      sx={{ p: 0, bgcolor: c.tui > 0 ? C.okSoft : C.surface, ...(isSel && { outline: `2px solid ${C.accent}`, outlineOffset: -2 }) }}
                    >
                      <ButtonBase
                        onClick={() => onSelect(g, l)}
                        aria-label={`${g}, ${l}: ${c.tui} túi, ${c.ml} ml${c.tui === 0 ? ', hết hàng' : ''}`}
                        aria-pressed={isSel}
                        sx={{ ...numSx, display: 'block', width: '100%', px: 1.5, py: 1, fontSize: 14, '&:hover': { textDecoration: 'underline' } }}
                      >
                        <CellText c={c} />
                      </ButtonBase>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow sx={{ '& td, & th': { borderTop: `1px solid ${C.lineStrong}`, bgcolor: C.sunken } }}>
              <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: C.ink2 }}>Tổng</TableCell>
              {LOAI_CHE_PHAM.map((l) => (
                <TableCell key={l} sx={{ ...numSx, px: 1.5 }}><CellText c={tongCot(l)} /></TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 1, fontSize: 13, color: C.muted }}>
        <span>Chỉ tính chế phẩm Đang lưu trữ, còn hạn (báo cáo 3.1).</span>
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          <Box component="span" aria-hidden sx={{ width: 14, height: 10, bgcolor: C.okSoft, border: `1px solid ${C.line}` }} />
          Còn hàng
        </Box>
        <span>Ô ghi 0: hết hàng</span>
      </Box>
    </Box>
  );
}
