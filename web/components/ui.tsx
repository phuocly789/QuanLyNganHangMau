'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import type { SxProps, Theme } from '@mui/material/styles';
import { C, FONT_MONO } from '@/lib/theme';
import { daysUntil, formatDate } from '@/lib/format';

/** Nhóm máu: chữ đơn cách, cùng độ rộng để dễ dò cột. Không làm pill màu. */
export function BloodGroup({ value, size = 'md' }: { value: string | null; size?: 'md' | 'lg' | 'xl' }) {
  const fontSize = { md: 15, lg: 18, xl: 30 }[size];
  return (
    <Box
      component="span"
      sx={{ display: 'inline-block', width: '3ch', fontFamily: FONT_MONO, fontWeight: 600, fontSize, lineHeight: size === 'xl' ? 1 : 'inherit', color: C.ink }}
    >
      {value ?? '?'}
    </Box>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <Box component="span" sx={{ fontFamily: FONT_MONO, fontSize: 13, color: C.ink2, whiteSpace: 'nowrap' }}>
      {children}
    </Box>
  );
}

type Tone = 'ok' | 'info' | 'warn' | 'muted' | 'danger';

const TONE_BY_STATUS: Record<string, Tone> = {
  // Chế phẩm
  'Đang lưu trữ': 'ok',
  'Đã cấp phát': 'info',
  'Đã sử dụng': 'muted',
  'Hết hạn': 'danger',
  // Yêu cầu
  'Chờ xử lý': 'warn',
  'Đã duyệt': 'info',
  'Đã phân bổ': 'info',
  'Hoàn tất': 'ok',
  'Từ chối': 'muted',
  // Phân bổ
  'Đã xuất': 'ok',
  // Vị trí lưu trữ
  'Còn chỗ': 'ok',
  'Đầy': 'warn',
  'Bảo trì': 'muted',
  'Không sử dụng': 'muted',
  // Truyền máu
  'Đang thực hiện': 'info',
  'Hoàn thành': 'ok',
  'Dừng do sốc phản vệ': 'danger',
  'Chưa truyền': 'warn',
  // Lịch sử kho
  'Đang xử lý': 'warn',
  // Lần hiến, đợt hiến máu
  'Đã hiến': 'ok',
  'Đã đăng ký': 'info',
  'Sắp diễn ra': 'info',
  'Đang diễn ra': 'ok',
  'Đã kết thúc': 'muted',
  // Đơn vị máu, xét nghiệm
  'Chờ xét nghiệm': 'warn',
  'Đạt chuẩn': 'ok',
  'Không đạt': 'danger',
  'Đã tách chế phẩm': 'muted',
  'Dương tính': 'danger',
  'Âm tính': 'ok',
  'Không xác định': 'warn',
  'Đạt': 'ok',
  // Sao lưu, phục hồi
  'Thành công': 'ok',
  'Thất bại': 'danger',
  // Chung
  'Đã hủy': 'muted',
  'Cấp cứu': 'danger',
};

const DOT: Record<Tone, string> = { ok: C.ok, info: C.accent, warn: C.warnDot, muted: C.mutedDot, danger: C.danger };

/** Chữ nền đỏ nhạt – chỉ dùng cho thông tin nguy cấp */
export function Critical({ children }: { children: ReactNode }) {
  return (
    <Box component="span" sx={{ borderRadius: '3px', bgcolor: C.dangerSoft, color: C.danger, fontWeight: 600, px: 0.75, py: '1px', whiteSpace: 'nowrap' }}>
      {children}
    </Box>
  );
}

// Màu chữ theo nhóm: đang chờ / đang xử lý tô màu để dễ quét cột; đã đóng để mờ
const TEXT: Record<Exclude<Tone, 'danger'>, { color: string; fontWeight: number }> = {
  warn: { color: C.warn, fontWeight: 600 },
  info: { color: C.accent, fontWeight: 600 },
  ok: { color: C.ink, fontWeight: 500 },
  muted: { color: C.muted, fontWeight: 400 },
};

/** Trạng thái = chữ + chấm màu. Chỉ trạng thái nguy cấp mới có nền màu. */
export function Status({ value }: { value: string }) {
  const tone = TONE_BY_STATUS[value] ?? 'muted';
  const dot = <Box component="span" aria-hidden sx={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, bgcolor: DOT[tone] }} />;
  if (tone === 'danger') {
    return (
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, borderRadius: '3px', bgcolor: C.dangerSoft, color: C.danger, fontWeight: 600, px: 0.75, py: '1px', whiteSpace: 'nowrap' }}>
        {dot}
        {value}
      </Box>
    );
  }
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, whiteSpace: 'nowrap', ...TEXT[tone] }}>
      {dot}
      {value}
    </Box>
  );
}

/** Hạn dùng: ngày + "còn N ngày". Quá hạn / hết hạn hôm nay là thông tin nguy cấp. */
export function HanDung({ value, active = true }: { value: string; active?: boolean }) {
  const n = daysUntil(value);
  let note: ReactNode = null;
  if (active) {
    if (n < 0) note = <Critical>quá hạn {-n} ngày</Critical>;
    else if (n === 0) note = <Critical>hết hạn hôm nay</Critical>;
    else if (n <= 7)
      // Sắp hết hạn: cảnh báo có nền cam nhạt (mức dưới nguy cấp)
      note = (
        <Box component="span" sx={{ borderRadius: '3px', bgcolor: C.warnSoft, color: C.warn, fontWeight: 600, px: 0.75, py: '1px' }}>
          còn {n} ngày
        </Box>
      );
    else note = <Box component="span" sx={{ color: C.ink2 }}>còn {n} ngày</Box>;
  }
  return (
    <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
      {formatDate(value)}
      {note && (
        <Box component="span" sx={{ ml: 1, fontSize: 13 }}>
          {note}
        </Box>
      )}
    </Box>
  );
}

export type KetQuaThaoTac = { ok: boolean; message: string } | null;

/** Dòng thông báo kết quả thao tác, đặt ngay trên trang (không popup) */
export function Notice({ result, sx }: { result: KetQuaThaoTac; sx?: SxProps<Theme> }) {
  return (
    <Box role="status" aria-live="polite" sx={sx}>
      {result && (
        <Box
          sx={{
            borderLeft: '4px solid',
            borderColor: result.ok ? C.ok : C.danger,
            bgcolor: result.ok ? C.okSoft : C.dangerSoft,
            color: result.ok ? C.ink : C.danger,
            fontWeight: 500,
            py: 1,
            pl: 1.5,
            fontSize: 14,
          }}
        >
          {result.message}
        </Box>
      )}
    </Box>
  );
}

/** Tiêu đề màn hình: tên + một dòng mô tả, hành động bên phải */
export function PageHeader({ title, caption, actions }: { title: string; caption?: ReactNode; actions?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 2 }}>
      <Box>
        <Box component="h1" sx={{ m: 0, fontSize: '1.375rem', fontWeight: 600, lineHeight: 1.3 }}>{title}</Box>
        {caption && <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 13, color: C.muted }}>{caption}</Box>}
      </Box>
      {actions && <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>{actions}</Box>}
    </Box>
  );
}

/** Nhóm form: tiêu đề nhỏ + đường kẻ, không dùng card */
export function FormSection({ id, title, children, onClose }: { id: string; title: string; children: ReactNode; onClose?: () => void }) {
  return (
    <Box component="section" aria-labelledby={id} sx={{ borderTop: `2px solid ${C.accent}`, borderBottom: `1px solid ${C.line}`, bgcolor: C.surface, px: { xs: 2, md: 3 }, py: 2.5, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
        <Box component="h2" id={id} sx={{ m: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.ink }}>{title}</Box>
        {onClose && (
          <Box component="button" type="button" onClick={onClose} sx={{ border: 0, bgcolor: 'transparent', color: C.accent, cursor: 'pointer', fontSize: 14, fontWeight: 500, p: 0, '&:hover': { textDecoration: 'underline' } }}>
            Đóng
          </Box>
        )}
      </Box>
      {children}
    </Box>
  );
}

/** Trường form: nhãn cố định phía trên, lỗi ngay dưới trường */
export function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string | null; hint?: ReactNode; children: ReactNode }) {
  return (
    <Box>
      <Box component="label" htmlFor={id} sx={{ display: 'block', mb: 0.5, fontSize: 13, fontWeight: 500, color: C.ink2 }}>
        {label}
      </Box>
      {children}
      {error ? (
        <FormHelperText id={`${id}-error`} error>
          {error}
        </FormHelperText>
      ) : hint ? (
        <FormHelperText id={`${id}-hint`} sx={{ color: C.muted }}>
          {hint}
        </FormHelperText>
      ) : null}
    </Box>
  );
}

export { numSx, stick1Sx, stick2Sx, tableWrapSx } from '@/lib/styles';
