'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { C } from '@/lib/theme';
import { DEMO_ACCOUNTS, NAV, ROLE_INFO, type Role } from '@/lib/roles';
import { logoutAction, switchRoleAction } from '@/app/actions/auth';
import HuongDanDrawer from './HuongDanDrawer';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

export default function TopNav({ username, hoTen, role }: { username: string; hoTen: string; role: Role }) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 20 }}>
      {/* Dải demo: chuyển nhanh giữa 3 SQL login để xem phân quyền */}
      <Box
        sx={{
          bgcolor: C.accentSoft,
          borderBottom: `1px solid ${C.line}`,
          px: { xs: 2, md: 3 },
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          fontSize: 13,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <Box component="span" sx={{ color: C.ink2 }}>
          Bản demo · xem với vai trò
        </Box>
        <Box role="group" aria-label="Chuyển vai trò demo" sx={{ display: 'flex', gap: 2 }}>
          {DEMO_ACCOUNTS.map((a) => {
            const current = a.username === username;
            return (
              <ButtonBase
                key={a.username}
                aria-pressed={current}
                disabled={current || pending}
                onClick={() => startTransition(() => switchRoleAction(a.username))}
                sx={{
                  fontSize: 13,
                  color: current ? C.ink : C.accent,
                  fontWeight: current ? 600 : 500,
                  borderBottom: current ? `2px solid ${C.ink}` : '2px solid transparent',
                  '&:hover': { textDecoration: current ? 'none' : 'underline' },
                }}
              >
                {ROLE_INFO[a.role].ten}
              </ButtonBase>
            );
          })}
        </Box>
        {pending && (
          <Box component="span" sx={{ color: C.muted }}>
            Đang đăng nhập lại…
          </Box>
        )}
      </Box>

      <Box
        sx={{
          bgcolor: C.surface,
          borderBottom: `1px solid ${C.lineStrong}`,
          px: { xs: 2, md: 3 },
          display: 'flex',
          alignItems: 'stretch',
          gap: { xs: 2, md: 4 },
          minHeight: 52,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', color: C.ink }}>
          Ngân hàng máu
        </Box>

        <Box component="nav" aria-label="Điều hướng chính" sx={{ display: 'flex', gap: 0.5, overflowX: 'auto', flex: 1 }}>
          {NAV[role].map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Box
                key={item.href}
                component={NextLink}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  fontSize: 14,
                  textDecoration: 'none',
                  px: 1.5,
                  color: active ? C.accent : C.ink2,
                  fontWeight: active ? 600 : 400,
                  bgcolor: active ? C.accentSoft : 'transparent',
                  borderBottom: `3px solid ${active ? C.accent : 'transparent'}`,
                  pt: '3px',
                  '&:hover': { color: C.accent, bgcolor: active ? C.accentSoft : C.hover },
                }}
              >
                {item.label}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap' }}>
          <HuongDanDrawer role={role} />
          <Box sx={{ textAlign: 'right', lineHeight: 1.25, display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ fontSize: 14, fontWeight: 500 }}>{hoTen}</Box>
            <Box sx={{ fontSize: 12, color: C.muted }}>
              {ROLE_INFO[role].ten} · {username}
            </Box>
          </Box>
          <form action={logoutAction}>
            <ButtonBase type="submit" sx={{ fontSize: 14, color: C.accent, fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
              Đăng xuất
            </ButtonBase>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
