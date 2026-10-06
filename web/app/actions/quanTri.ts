'use server';

import { chayProc } from '@/lib/server/action';
import { hoTenCua } from '@/lib/roles';

/** sp_BackupDuLieu – sao lưu toàn bộ CSDL, ghi LichSuBackup (kể cả khi thất bại) */
export async function backupAction(duongDan: string, ghiChu: string) {
  if (!duongDan.trim()) return { ok: false, message: 'Nhập đường dẫn file .bak.', field: 'backupPath' };
  return chayProc(
    'quanTri',
    'sp_BackupDuLieu',
    (s) => ({ DuongDanFile: duongDan.trim(), NguoiThucHien: hoTenCua(s.username), GhiChu: ghiChu.trim() || null }),
    {
      paths: ['/quan-tri'],
      thanhCong: () => `Sao lưu thành công: ${duongDan.trim()}`,
      // ERROR_MESSAGE() trong procedure chỉ giữ lỗi cuối ("terminating abnormally"), nên gợi ý nguyên nhân thường gặp
      ghiChuLoi:
        'Thường do thư mục không tồn tại trên máy SQL Server hoặc dịch vụ SQL Server (NT Service\\MSSQLSERVER) không có quyền ghi. Hãy dùng thư mục mặc định đã điền sẵn.',
    },
  );
}

// Phục hồi (sp_RestoreDuLieu) không gọi từ web: RESTORE cần quyền sysadmin/dbcreator và không chạy được
// từ bên trong chính CSDL cần phục hồi. Trang Quản trị tạo script để chạy trong SSMS.

// Export (sp_ExportTonKhoChePhamCSV) không gọi từ web: xp_cmdshell chỉ dành cho sysadmin
// (tài khoản thường phải có proxy Windows). Trang Quản trị tạo script để chạy trong SSMS.
