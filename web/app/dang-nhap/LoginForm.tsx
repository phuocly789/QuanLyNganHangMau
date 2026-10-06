'use client';

import { useActionState, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { C, FONT_MONO } from '@/lib/theme';
import { DEMO_ACCOUNTS, ROLE_INFO } from '@/lib/roles';
import { Field } from '@/components/ui';
import HuongDanDrawer from '@/components/HuongDanDrawer';
import { loginAction, type LoginState } from '@/app/actions/auth';

// Mật khẩu demo đã có trong QuanLyNganHangMau.sql (CREATE LOGIN ...)
const DEMO_PASSWORDS: Record<string, string> = {
  nhanvien01: 'NhanVien@2026',
  bacsi01: 'BacSi@2026',
  quanly01: 'QuanLy@2026',
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [username, setUsername] = useState(state.username ?? '');
  const [password, setPassword] = useState('');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(360px, 440px) 1fr' },
        columnGap: 8,
        alignContent: 'center',
        maxWidth: 1040,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        py: 6,
      }}
    >
      <Box>
        <Typography variant="caption" component="p" sx={{ mb: 0.5 }}>
          Hệ thống Quản lý Ngân hàng, Điều chuyển và Hiến máu
        </Typography>
        <Typography variant="h1" sx={{ mb: 4 }}>
          Đăng nhập
        </Typography>

        <Box component="form" action={formAction} noValidate sx={{ display: 'grid', gap: 2.5 }}>
          <Field id="username" label="Tên đăng nhập">
            <TextField
              id="username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
          <Field id="password" label="Mật khẩu" error={state.error}>
            <TextField
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!state.error}
              slotProps={{ htmlInput: { 'aria-describedby': state.error ? 'password-error' : undefined } }}
            />
          </Field>
          <Box>
            <Button type="submit" variant="contained" disabled={pending}>
              {pending ? 'Đang kết nối SQL Server…' : 'Đăng nhập'}
            </Button>
          </Box>
        </Box>
        <Typography variant="caption" component="p" sx={{ mt: 3 }}>
          Mỗi tài khoản là một SQL login. Quyền xem và thao tác do SQL Server kiểm soát.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <HuongDanDrawer role={null} />
        </Box>
      </Box>

      {/* Tài khoản demo: chọn để điền sẵn */}
      <Box
        sx={{
          mt: { xs: 6, md: 0 },
          pl: { md: 6 },
          borderLeft: { md: `1px solid ${C.line}` },
          alignSelf: 'center',
        }}
      >
        <Typography variant="h3" component="h2" sx={{ mb: 1.5 }}>
          Tài khoản demo
        </Typography>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {DEMO_ACCOUNTS.map((a) => (
            <Box component="li" key={a.username} sx={{ borderTop: `1px solid ${C.line}`, '&:last-of-type': { borderBottom: `1px solid ${C.line}` } }}>
              <ButtonBase
                onClick={() => {
                  setUsername(a.username);
                  setPassword(DEMO_PASSWORDS[a.username]);
                }}
                sx={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left', py: 1.25, px: 1, '&:hover': { bgcolor: C.hover } }}
              >
                <Box sx={{ display: 'grid', gridTemplateColumns: '108px 1fr', columnGap: 2, width: '100%' }}>
                  <Box component="span" sx={{ fontFamily: FONT_MONO, fontSize: 13, color: C.accent, pt: '2px' }}>
                    {a.username}
                  </Box>
                  <Box component="span">
                    <Box component="span" sx={{ display: 'block', fontSize: 14, fontWeight: 500 }}>
                      {ROLE_INFO[a.role].ten}
                    </Box>
                    <Box component="span" sx={{ display: 'block', fontSize: 13, color: C.muted }}>
                      {a.ghiChu}
                    </Box>
                  </Box>
                </Box>
              </ButtonBase>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
