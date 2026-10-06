'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { C, FONT_MONO } from '@/lib/theme';
import { Field } from '@/components/ui';
import ScriptBox from '@/components/ScriptBox';

// Chạy một lần: bật xp_cmdshell; bcp (-T) chạy dưới tài khoản dịch vụ nên cấp quyền đọc view cho tài khoản đó.
// Viết để chạy lại nhiều lần không lỗi.
const SCRIPT_CHUAN_BI = `-- Chuẩn bị export (chạy MỘT LẦN, tài khoản quản trị)
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1;
RECONFIGURE;
GO
USE QuanLyNganHangMau;
GO
IF USER_ID(N'NT Service\\MSSQLSERVER') IS NULL
    CREATE USER [NT Service\\MSSQLSERVER] FOR LOGIN [NT Service\\MSSQLSERVER];
GRANT SELECT ON dbo.v_ExportTonKhoChePham TO [NT Service\\MSSQLSERVER];
GO`;

const SCRIPT_TAT = `EXEC sp_configure 'xp_cmdshell', 0;
RECONFIGURE;`;

const sqlChuoi = (s: string) => s.replace(/'/g, "''");

/** Export tồn kho (sp_ExportTonKhoChePhamCSV) chạy trong SSMS: xp_cmdshell chỉ dành cho sysadmin */
export default function ExportSSMS({ tenFileMacDinh }: { tenFileMacDinh: string }) {
  const [duongDan, setDuongDan] = useState(tenFileMacDinh);

  const scriptExport = `-- Export tồn kho chế phẩm ra CSV (tài khoản quản trị)
EXEC QuanLyNganHangMau.dbo.sp_ExportTonKhoChePhamCSV
     @OutputFilePath = N'${sqlChuoi(duongDan.trim())}';
-- Thành công khi kết quả có dòng "N rows copied."`;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Field id="exportPath" label="File CSV đầu ra" hint="Đường dẫn trên máy SQL Server; mặc định dùng thư mục sao lưu của SQL Server (đã có quyền ghi).">
          <TextField id="exportPath" value={duongDan} onChange={(e) => setDuongDan(e.target.value)} />
        </Field>
      </Box>

      <Box sx={{ borderLeft: `3px solid ${C.accent}`, bgcolor: C.accentSoft, px: 2, py: 1.25, mb: 2, fontSize: 14, color: C.ink2 }}>
        <Box component="ol" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.25 } }}>
          <li>Mở SSMS bằng tài khoản quản trị (Windows Authentication hoặc sa), mở New Query.</li>
          <li>Lần đầu tiên: chạy script <b>Chuẩn bị</b> (bật xp_cmdshell, cấp quyền đọc view cho tài khoản dịch vụ).</li>
          <li>Chạy script <b>Export</b>. File CSV dạng Unicode, mở bằng Excel hiển thị đúng tiếng Việt.</li>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5 }}>
        <ScriptBox title="1. Chuẩn bị (chạy một lần)" script={SCRIPT_CHUAN_BI} />
        <ScriptBox title="2. Export" script={scriptExport} />
      </Box>

      <Box sx={{ mt: 1.5, fontSize: 13, color: C.muted }}>
        xp_cmdshell cho phép chạy lệnh Windows từ SQL Server; nên tắt lại sau khi export:{' '}
        <Box component="code" sx={{ fontFamily: FONT_MONO, color: C.ink2 }}>{SCRIPT_TAT.replace('\n', ' ')}</Box>
      </Box>
    </Box>
  );
}
