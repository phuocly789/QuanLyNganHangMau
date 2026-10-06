// Hằng số màu và font – không có 'use client' để dùng được cả ở server component lẫn client component.

/** Bảng màu: nền xám lạnh rất nhạt để bảng trắng tách khỏi nền, chữ xám đậm,
 *  một màu nhấn xanh lam (đạt WCAG AA trên nền trắng).
 *  Đỏ chỉ dành cho thông tin nguy cấp: Cấp cứu, hết hạn, thiếu máu, dương tính. */
export const C = {
  bg: '#eef1f4',
  surface: '#ffffff',
  sunken: '#e6eaef',
  hover: '#f4f8fc',
  ink: '#14181c',
  ink2: '#2c3238',
  muted: '#59616a',
  line: '#dce1e7',
  lineStrong: '#c2c9d2',
  accent: '#1a5c96',
  accentStrong: '#124574',
  accentSoft: '#e4eef8',
  danger: '#b42318',
  dangerSoft: '#fde8e6',
  dangerFaint: '#fef4f3',
  warn: '#8f4700',
  warnDot: '#d97706',
  warnSoft: '#fdefd8',
  ok: '#1e7a3d',
  okSoft: '#e3f3e8',
  mutedDot: '#a1a8b0',
} as const;

export const FONT_MONO = 'var(--font-roboto-mono), ui-monospace, "Cascadia Mono", monospace';
