'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { C, FONT_MONO } from '@/lib/theme';

/** Khối script T-SQL kèm nút sao chép – dùng cho các thao tác phải chạy trong SSMS bằng tài khoản quản trị */
export default function ScriptBox({ title, script }: { title: string; script: string }) {
  const [daChep, setDaChep] = useState(false);

  const chep = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setDaChep(true);
      setTimeout(() => setDaChep(false), 2500);
    } catch {
      setDaChep(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
        <Box component="span" sx={{ fontSize: 13, fontWeight: 600, color: C.ink2 }}>{title}</Box>
        <Button variant="outlined" onClick={chep}>{daChep ? 'Đã sao chép' : 'Sao chép script'}</Button>
      </Box>
      <Box
        component="pre"
        aria-label={title}
        sx={{ m: 0, p: 1.5, bgcolor: C.sunken, border: `1px solid ${C.line}`, fontFamily: FONT_MONO, fontSize: 12.5, lineHeight: 1.55, overflowX: 'auto', whiteSpace: 'pre' }}
      >
        {script}
      </Box>
    </Box>
  );
}
