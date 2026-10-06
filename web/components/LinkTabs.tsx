'use client';

import NextLink from 'next/link';
import Box from '@mui/material/Box';
import { C } from '@/lib/theme';

/** Thanh tab dạng liên kết (mỗi tab là một URL) – dùng được từ server component */
export default function LinkTabs({ label, items, current }: { label: string; items: { href: string; text: string; id: string }[]; current: string }) {
  return (
    <Box component="nav" aria-label={label} sx={{ display: 'flex', gap: 3, borderBottom: `1px solid ${C.line}`, mb: 3, overflowX: 'auto' }}>
      {items.map((it) => {
        const active = it.id === current;
        return (
          <Box
            key={it.id}
            component={NextLink}
            href={it.href}
            aria-current={active ? 'page' : undefined}
            sx={{
              py: 1.25,
              fontSize: 14,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              color: active ? C.ink : C.muted,
              fontWeight: active ? 500 : 400,
              borderBottom: `2px solid ${active ? C.accent : 'transparent'}`,
              mb: '-1px',
              '&:hover': { color: C.ink },
            }}
          >
            {it.text}
          </Box>
        );
      })}
    </Box>
  );
}
