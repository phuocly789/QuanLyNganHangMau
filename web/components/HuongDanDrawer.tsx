'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { C, FONT_MONO } from '@/lib/theme';
import { ROLE_INFO, ROUTE_ROLES, type Role } from '@/lib/roles';
import { huongDanCho, LUONG, TINH_HUONG_THU_HOI, type ChucNang, type LoaiDoiTuong } from '@/lib/huongDan';

const MAU_LOAI: Record<LoaiDoiTuong, string> = {
  Procedure: C.accent,
  Trigger: '#7a3e9d',
  Function: C.ok,
  View: C.warn,
  'Truy vấn': C.warn,
  Bảng: C.muted,
  Quyền: C.danger,
};

function TheChucNang({ cn, cuaToi }: { cn: ChucNang; cuaToi: boolean }) {
  return (
    <Box component="section" sx={{ borderTop: `1px solid ${C.line}`, py: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1, mb: 1 }}>
        <Box component="h3" sx={{ m: 0, fontSize: 15, fontWeight: 600, color: cuaToi ? C.ink : C.ink2 }}>{cn.ten}</Box>
        <Box component="span" sx={{ fontSize: 12.5, color: C.muted }}>
          {cn.ai.map((r) => ROLE_INFO[r].ten).join(' · ')}
        </Box>
      </Box>

      <Box component="ol" sx={{ m: 0, pl: 2.5, fontSize: 14, color: C.ink2, '& li': { mb: 0.5 } }}>
        {cn.buoc.map((b) => <li key={b}>{b}</li>)}
      </Box>

      <Box sx={{ mt: 1.5, fontSize: 12.5, fontWeight: 600, color: C.ink2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tác động trong SQL</Box>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 0.75, p: 0, display: 'grid', gap: 0.75 }}>
        {cn.sql.map((o) => (
          <Box component="li" key={o.ten + o.tacDung} sx={{ display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr)', columnGap: 1, fontSize: 13.5, lineHeight: 1.5 }}>
            <Box component="span" sx={{ fontSize: 11, fontWeight: 700, color: MAU_LOAI[o.loai], textTransform: 'uppercase', letterSpacing: '0.03em', pt: '2px' }}>
              {o.loai}
            </Box>
            <Box>
              <Box component="span" sx={{ fontFamily: FONT_MONO, fontSize: 12.5, color: C.ink, wordBreak: 'break-word' }}>{o.ten}</Box>
              {o.muc && <Box component="span" sx={{ color: C.muted }}> · {o.muc}</Box>}
              <Box sx={{ color: C.ink2 }}>{o.tacDung}</Box>
            </Box>
          </Box>
        ))}
      </Box>

      {cn.loi && cn.loi.length > 0 && (
        <>
          <Box sx={{ mt: 1.5, fontSize: 12.5, fontWeight: 600, color: C.ink2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lỗi có thể gặp</Box>
          <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5, fontSize: 13.5, color: C.danger, '& li': { mb: 0.25 } }}>
            {cn.loi.map((l) => <li key={l}>{l}</li>)}
          </Box>
        </>
      )}
      {cn.luuY && <Box sx={{ mt: 1.25, fontSize: 13.5, color: C.ink2, borderLeft: `3px solid ${C.lineStrong}`, pl: 1.25 }}>{cn.luuY}</Box>}
    </Box>
  );
}

/** Nút "Hướng dẫn" + khung trượt bên phải: chức năng của màn hình hiện tại và luồng nghiệp vụ */
export default function HuongDanDrawer({ role }: { role: Role | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [xemVaiTroKhac, setXemVaiTroKhac] = useState(false);

  const hd = huongDanCho(pathname);
  const cuaToi = hd?.chucNang.filter((c) => !role || c.ai.includes(role)) ?? [];
  const khac = hd?.chucNang.filter((c) => role && !c.ai.includes(role)) ?? [];

  return (
    <>
      <ButtonBase
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        sx={{ fontSize: 14, fontWeight: 600, color: C.accent, border: `1px solid ${C.accent}`, borderRadius: '3px', px: 1.25, py: 0.5, whiteSpace: 'nowrap', '&:hover': { bgcolor: C.accentSoft } }}
      >
        Hướng dẫn
      </ButtonBase>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: { xs: '100%', sm: 520 }, bgcolor: C.surface, borderLeft: `1px solid ${C.lineStrong}` } } }}
      >
        <Box role="document" aria-labelledby="hd-title" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ px: 3, pt: 2.5, borderBottom: `1px solid ${C.line}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Box component="h2" id="hd-title" sx={{ m: 0, fontSize: 18, fontWeight: 600 }}>Hướng dẫn sử dụng</Box>
              <ButtonBase onClick={() => setOpen(false)} sx={{ fontSize: 14, fontWeight: 600, color: C.accent, '&:hover': { textDecoration: 'underline' } }}>
                Đóng
              </ButtonBase>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 1, borderBottom: 'none' }}>
              <Tab label="Màn hình này" />
              <Tab label="Luồng nghiệp vụ" />
            </Tabs>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pb: 4 }}>
            {tab === 0 &&
              (hd ? (
                <>
                  <Box component="h2" sx={{ fontSize: 17, fontWeight: 600, mt: 2.5, mb: 0.75 }}>{hd.tieuDe}</Box>
                  <Box component="p" sx={{ m: 0, mb: 1, fontSize: 14, color: C.ink2 }}>{hd.moTa}</Box>
                  {cuaToi.map((cn) => <TheChucNang key={cn.ten} cn={cn} cuaToi />)}
                  {khac.length > 0 && (
                    <Box sx={{ borderTop: `1px solid ${C.line}`, pt: 1.5 }}>
                      <ButtonBase onClick={() => setXemVaiTroKhac((v) => !v)} sx={{ fontSize: 14, fontWeight: 600, color: C.accent }}>
                        {xemVaiTroKhac ? 'Ẩn' : 'Xem'} chức năng của vai trò khác ({khac.length})
                      </ButtonBase>
                      {xemVaiTroKhac && khac.map((cn) => <TheChucNang key={cn.ten} cn={cn} cuaToi={false} />)}
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ mt: 2.5, fontSize: 14, color: C.muted }}>Chưa có hướng dẫn cho màn hình này.</Box>
              ))}

            {tab === 1 && (
              <>
                <Box component="p" sx={{ mt: 2.5, mb: 2, fontSize: 14, color: C.ink2 }}>
                  Vòng đời một túi máu từ lúc hiến đến lúc truyền. Bấm tên màn hình để mở; dùng dải &quot;Bản demo&quot; để đổi vai trò.
                </Box>
                <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                  {LUONG.map((b, i) => (
                    <Box component="li" key={b.ten} sx={{ display: 'grid', gridTemplateColumns: '28px 1fr', columnGap: 1.5, py: 1.25, borderTop: `1px solid ${C.line}` }}>
                      <Box sx={{ fontFamily: FONT_MONO, fontWeight: 600, color: C.accent, fontSize: 14 }}>{String(i + 1).padStart(2, '0')}</Box>
                      <Box>
                        <Box sx={{ fontSize: 14.5, fontWeight: 600 }}>{b.ten}</Box>
                        <Box sx={{ fontSize: 13.5, color: C.ink2 }}>{b.moTa}</Box>
                        <Box sx={{ fontSize: 13, color: C.muted, mt: 0.25 }}>
                          {ROLE_INFO[b.ai].ten} ·{' '}
                          {role && ROUTE_ROLES[b.href]?.includes(role) ? (
                            <Link component={NextLink} href={b.href} onClick={() => setOpen(false)} sx={{ fontSize: 13 }}>{b.manHinh}</Link>
                          ) : (
                            <span>{b.manHinh}{role ? ` (đổi sang vai trò ${ROLE_INFO[b.ai].ten} trên dải demo)` : ''}</span>
                          )}{' '}
                          ·{' '}
                          <Box component="span" sx={{ fontFamily: FONT_MONO, fontSize: 12.5, color: C.ink2 }}>{b.sql}</Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mt: 2, borderLeft: `3px solid ${C.danger}`, bgcolor: C.dangerFaint, px: 1.5, py: 1, fontSize: 13.5, color: C.ink2 }}>
                  <Box component="span" sx={{ fontWeight: 600, color: C.danger }}>Tình huống thu hồi: </Box>
                  {TINH_HUONG_THU_HOI}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
