// Định dạng hiển thị dùng chung: ngày dd/mm/yyyy, thể tích luôn kèm "ml", mã có tiền tố.

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Chuỗi 'YYYY-MM-DD' theo giờ địa phương */
export function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toIsoDateTime(d: Date): string {
  return `${toIsoDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

/** Đọc 'YYYY-MM-DD' hoặc 'YYYY-MM-DDTHH:mm:ss' thành Date theo giờ địa phương */
export function parseDate(s: string): Date {
  const [datePart, timePart] = s.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh = 0, mm = 0] = (timePart ?? '').split(':').map(Number);
  return new Date(y, m - 1, d, hh || 0, mm || 0);
}

export function formatDate(s: string | null | undefined): string {
  if (!s) return '—';
  const d = parseDate(s);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatDateTime(s: string | null | undefined): string {
  if (!s) return '—';
  const d = parseDate(s);
  return `${formatDate(s)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatTime(s: string | null | undefined): string {
  if (!s) return '—';
  const d = parseDate(s);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Số ngày từ hôm nay đến ngày s (âm nếu đã qua) */
export function daysUntil(s: string): number {
  const ms = parseDate(s.split('T')[0]).getTime() - startOfToday().getTime();
  return Math.round(ms / 86_400_000);
}

const numberFmt = new Intl.NumberFormat('vi-VN');

export function formatNumber(n: number): string {
  return numberFmt.format(n);
}

export function ml(n: number): string {
  return `${numberFmt.format(n)} ml`;
}

export const ma = {
  chePham: (n: number) => `CP-${pad(n, 4)}`,
  donViMau: (n: number) => `DV-${pad(n, 4)}`,
  yeuCau: (n: number) => `YC-${pad(n, 4)}`,
  benhNhan: (n: number) => `BN-${pad(n, 4)}`,
  phanBo: (n: number) => `PB-${pad(n, 4)}`,
};
