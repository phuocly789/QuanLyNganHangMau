import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { C } from '@/lib/colors';

// Hiện ngay khi chuyển trang, trong lúc server lấy dữ liệu từ SQL Server
export default function Loading() {
  return (
    <Box role="status" aria-live="polite">
      <LinearProgress sx={{ height: 2, bgcolor: C.line }} />
      <Box sx={{ mt: 1.5, fontSize: 14, color: C.muted }}>Đang tải dữ liệu…</Box>
    </Box>
  );
}
