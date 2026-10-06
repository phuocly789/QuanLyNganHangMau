'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { C } from '@/lib/theme';
import { formatDateTime } from '@/lib/format';
import type { LichSuBackupRow } from '@/lib/server/queries-baocao';
import { Field } from '@/components/ui';
import ScriptBox from '@/components/ScriptBox';

const sqlChuoi = (s: string) => s.replace(/'/g, "''");

/** Script phục hồi chạy trong SSMS từ database master (không chạy được từ bên trong chính CSDL cần phục hồi).
 *  Cuối script ghi LichSuRestore để lịch sử trên web vẫn đầy đủ. */
function taoScript(duongDan: string, nguoi: string, ghiChu: string) {
  const f = sqlChuoi(duongDan);
  return `-- Phục hồi QuanLyNganHangMau – chạy trong SSMS bằng tài khoản quản trị (sysadmin)
USE master;
GO
ALTER DATABASE QuanLyNganHangMau SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO
RESTORE DATABASE QuanLyNganHangMau
FROM DISK = N'${f}'
WITH REPLACE, RECOVERY, STATS = 10;
GO
ALTER DATABASE QuanLyNganHangMau SET MULTI_USER;
GO
-- Ghi lịch sử phục hồi (bảng LichSuRestore)
INSERT INTO QuanLyNganHangMau.dbo.LichSuRestore (NguoiThucHien, DuongDanFileNguon, TrangThai, GhiChu)
VALUES (N'${sqlChuoi(nguoi)}', N'${f}', N'Thành công', N'${sqlChuoi(ghiChu.trim() || 'Phục hồi trong SSMS')}');
GO`;
}

export default function PhucHoiSSMS({ banSaoLuu, nguoiThucHien }: { banSaoLuu: LichSuBackupRow[]; nguoiThucHien: string }) {
  const [maBackup, setMaBackup] = useState<number | ''>(banSaoLuu[0]?.MaBackup ?? '');
  const [ghiChu, setGhiChu] = useState('');

  if (banSaoLuu.length === 0) {
    return <Box sx={{ fontSize: 14, color: C.muted }}>Chưa có bản sao lưu thành công nào. Hãy sao lưu trước.</Box>;
  }

  const ban = banSaoLuu.find((b) => b.MaBackup === maBackup) ?? banSaoLuu[0];
  const script = taoScript(ban.DuongDanFile, nguoiThucHien, ghiChu);

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5, mb: 2 }}>
        <Field id="rs-ban" label="Bản sao lưu dùng để phục hồi">
          <TextField id="rs-ban" select value={ban.MaBackup} onChange={(e) => setMaBackup(Number(e.target.value))}>
            {banSaoLuu.map((b) => (
              <MenuItem key={b.MaBackup} value={b.MaBackup}>
                {formatDateTime(b.ThoiGianBackup)} · {b.DuongDanFile.split(/[\\/]/).pop()}
              </MenuItem>
            ))}
          </TextField>
        </Field>
        <Field id="rs-gc" label="Lý do phục hồi">
          <TextField id="rs-gc" value={ghiChu} placeholder="Phục hồi trong SSMS" onChange={(e) => setGhiChu(e.target.value)} />
        </Field>
      </Box>

      {/* Cảnh báo – thao tác không hoàn tác được */}
      <Box sx={{ borderLeft: `3px solid ${C.danger}`, bgcolor: C.dangerFaint, px: 2, py: 1.25, mb: 2, fontSize: 14, color: C.ink2 }}>
        <Box sx={{ fontWeight: 600, color: C.danger, mb: 0.5 }}>Trước khi chạy</Box>
        <Box component="ol" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.25 } }}>
          <li>Dữ liệu phát sinh sau {formatDateTime(ban.ThoiGianBackup)} sẽ mất và không khôi phục lại được.</li>
          <li>Mở SSMS, đăng nhập bằng tài khoản quản trị (Windows Authentication hoặc sa), mở New Query.</li>
          <li>Dán script bên dưới và bấm Execute. Mọi người dùng đang mở web sẽ bị ngắt và cần đăng nhập lại.</li>
        </Box>
      </Box>

      <ScriptBox title="Script phục hồi" script={script} />
    </Box>
  );
}
