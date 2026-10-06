// Style dùng chung cho bảng – không có 'use client' để server component dùng được.
import type { SxProps, Theme } from '@mui/material/styles';
import { C } from './colors';

/** Khung bảng: cuộn trong khung để tiêu đề cột dính khi cuộn dọc và cột Mã/Nhóm máu dính khi cuộn ngang */
export const tableWrapSx: SxProps<Theme> = {
  // relative: giữ các phần tử position:absolute (chữ cho trình đọc màn hình) trong khung cuộn
  position: 'relative',
  overflow: 'auto',
  borderTop: `1px solid ${C.line}`,
  borderBottom: `1px solid ${C.line}`,
  bgcolor: C.surface,
  '& tbody tr:last-of-type td': { borderBottom: 0 },
};

const STICK1_W = 96;
/** Cột Mã: cố định khi cuộn ngang */
export const stick1Sx: SxProps<Theme> = { position: 'sticky', left: 0, zIndex: 2, width: STICK1_W, minWidth: STICK1_W, 'thead &': { zIndex: 4 } };
/** Cột Nhóm máu: cố định ngay sau cột Mã */
export const stick2Sx: SxProps<Theme> = { position: 'sticky', left: STICK1_W, zIndex: 2, borderRight: `1px solid ${C.line}`, 'thead &': { zIndex: 4 } };
export const numSx: SxProps<Theme> = { textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' };
