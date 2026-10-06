'use client';

import { createTheme, type Shadows } from '@mui/material/styles';

import { C } from './colors';

export { C, FONT_MONO } from './colors';

export const theme = createTheme({
  palette: {
    primary: { main: C.accent, dark: C.accentStrong, contrastText: '#fff' },
    error: { main: C.danger },
    warning: { main: C.warnDot },
    success: { main: C.ok },
    background: { default: C.bg, paper: C.surface },
    text: { primary: C.ink, secondary: C.muted },
    divider: C.line,
  },
  shape: { borderRadius: 3 },
  shadows: Array(25).fill('none') as Shadows,
  typography: {
    fontFamily: 'var(--font-be-vietnam), system-ui, sans-serif',
    fontSize: 14,
    h1: { fontSize: '1.375rem', fontWeight: 600, lineHeight: 1.3 },
    h2: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
    h3: { fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.ink },
    body1: { fontSize: '0.9375rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.8125rem', color: C.muted },
    button: { textTransform: 'none', fontWeight: 500, fontSize: '0.875rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { fontFeatureSettings: '"tnum" 1' },
        ':focus-visible': { outline: `2px solid ${C.accent}`, outlineOffset: 2 },
      },
    },
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 36, paddingInline: 14, whiteSpace: 'nowrap' },
        outlined: { borderColor: C.lineStrong, color: C.ink, backgroundColor: C.surface, '&:hover': { backgroundColor: C.sunken, borderColor: C.lineStrong } },
        text: { minHeight: 0, padding: 0, minWidth: 0, fontWeight: 600, '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } },
      },
    },
    MuiLink: { defaultProps: { underline: 'hover' }, styleOverrides: { root: { fontWeight: 600 } } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiMenu: { styleOverrides: { paper: { border: `1px solid ${C.lineStrong}` } } },
    MuiPopover: { styleOverrides: { paper: { border: `1px solid ${C.lineStrong}` } } },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40, borderBottom: `1px solid ${C.line}` },
        indicator: { height: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { minHeight: 40, minWidth: 0, paddingInline: 2, marginRight: 24, fontSize: '0.875rem', color: C.muted, '&.Mui-selected': { color: C.accent, fontWeight: 600 } },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: C.line, padding: '8px 12px', fontSize: '0.875rem', backgroundColor: C.surface },
        head: { backgroundColor: C.sunken, color: C.ink2, fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap', borderBottomColor: C.lineStrong },
      },
    },
    MuiTableRow: {
      styleOverrides: { root: { '&.MuiTableRow-hover:hover > td': { backgroundColor: C.hover } } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: C.surface, fontSize: '0.875rem' },
        notchedOutline: { borderColor: C.lineStrong },
      },
    },
    MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
    MuiSelect: { defaultProps: { size: 'small' } },
    MuiFormHelperText: { styleOverrides: { root: { marginInline: 0, fontSize: '0.8125rem' } } },
  },
});
