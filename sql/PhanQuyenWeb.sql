/* =====================================================================
   CẤP QUYỀN CHO 3 NHÓM NGƯỜI DÙNG – PHỤC VỤ GIAO DIỆN WEB
   Bổ sung cho mục 2.2 trong QuanLyNganHangMau.sql (mới cài role_BacSi).
   Chạy sau QuanLyNganHangMau.sql. Chạy lại nhiều lần không lỗi.

   Nguyên tắc: giao diện chỉ GHI dữ liệu qua các procedure có trong script gốc
   (procedure cùng chủ sở hữu dbo nên chạy được dù bảng không cấp INSERT/UPDATE).
   Vì vậy ở đây chỉ cấp: SELECT để hiển thị, EXECUTE procedure/function, và DENY.
   Ngoại lệ duy nhất: nhân viên duyệt yêu cầu cấp máu (mục kiểm tra 2.2).
   ===================================================================== */
USE QuanLyNganHangMau;
GO

-- =====================================================================
-- 1. role_NhanVienNganHangMau – Nhân viên ngân hàng máu
-- =====================================================================
GRANT SELECT ON dbo.NhomMau          TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.NguoiHienMau     TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.DotHienMau       TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.NganHangMau      TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.ViTriLuuTru      TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.LanHienMau       TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.DonViMau         TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.LoaiXetNghiem    TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.KetQuaXetNghiem  TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.ChePhamMau       TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.LichSuKho        TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.BenhVien         TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.Khoa             TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.YeuCauCapMau     TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.QuyTacTuongThich TO role_NhanVienNganHangMau;
GRANT SELECT ON dbo.PhanBoMau        TO role_NhanVienNganHangMau;

-- Duyệt yêu cầu cấp máu: chỉ được đổi cột trạng thái
GRANT UPDATE (TrangThai) ON dbo.YeuCauCapMau TO role_NhanVienNganHangMau;

GRANT EXECUTE ON dbo.sp_TiepNhanLanHienMau          TO role_NhanVienNganHangMau;
GRANT EXECUTE ON dbo.sp_CapNhatKetQuaXetNghiem      TO role_NhanVienNganHangMau;
GRANT EXECUTE ON dbo.sp_NhapKhoChePham              TO role_NhanVienNganHangMau;
GRANT EXECUTE ON dbo.sp_PhanBoMauChoYeuCau          TO role_NhanVienNganHangMau;
GRANT EXECUTE ON dbo.sp_CapNhatChePhamHetHan        TO role_NhanVienNganHangMau;
GRANT EXECUTE ON dbo.sp_CapNhatTrangThaiViTriLuuTru TO role_NhanVienNganHangMau;
GRANT EXECUTE ON dbo.sp_ImportNguoiHienMau          TO role_NhanVienNganHangMau;
GRANT EXECUTE ON dbo.sp_TachChePham                 TO role_NhanVienNganHangMau;

GRANT EXECUTE ON dbo.fn_TinhTuoi             TO role_NhanVienNganHangMau;
GRANT EXECUTE ON dbo.fn_KiemTraTuongThich    TO role_NhanVienNganHangMau;
GRANT EXECUTE ON dbo.fn_TongTheTichDaPhanBo  TO role_NhanVienNganHangMau;

DENY SELECT ON dbo.BenhNhan  TO role_NhanVienNganHangMau;
DENY SELECT ON dbo.TruyenMau TO role_NhanVienNganHangMau;
DENY INSERT, UPDATE ON dbo.LichSuKho TO role_NhanVienNganHangMau;
DENY DELETE ON SCHEMA::dbo TO role_NhanVienNganHangMau;
GO

-- =====================================================================
-- 2. role_BacSi – Bác sĩ bệnh viện (bổ sung quyền xem còn thiếu)
--    Script gốc đã có: SELECT/INSERT/UPDATE BenhNhan, TruyenMau; SELECT/INSERT YeuCauCapMau;
--    EXECUTE sp_GhiNhanTruyenMau; DENY sửa ChePhamMau; DENY xem NguoiHienMau; DENY DELETE.
-- =====================================================================
GRANT SELECT ON dbo.NhomMau          TO role_BacSi;
GRANT SELECT ON dbo.BenhVien         TO role_BacSi;
GRANT SELECT ON dbo.Khoa             TO role_BacSi;
GRANT SELECT ON dbo.NganHangMau      TO role_BacSi;
GRANT SELECT ON dbo.ViTriLuuTru      TO role_BacSi;
GRANT SELECT ON dbo.DonViMau         TO role_BacSi;
GRANT SELECT ON dbo.ChePhamMau       TO role_BacSi;
GRANT SELECT ON dbo.PhanBoMau        TO role_BacSi;
GRANT SELECT ON dbo.QuyTacTuongThich TO role_BacSi;

GRANT EXECUTE ON dbo.fn_TinhTuoi             TO role_BacSi;
GRANT EXECUTE ON dbo.fn_KiemTraTuongThich    TO role_BacSi;
GRANT EXECUTE ON dbo.fn_TongTheTichDaPhanBo  TO role_BacSi;

DENY INSERT, UPDATE ON dbo.PhanBoMau TO role_BacSi;
-- Bác sĩ không tự đổi trạng thái yêu cầu (mục kiểm tra 2.2)
DENY UPDATE ON dbo.YeuCauCapMau TO role_BacSi;
GO

-- =====================================================================
-- 3. role_QuanLy – Cán bộ quản lý: xem toàn bộ, báo cáo, backup/restore, export.
--    Không sửa dữ liệu nghiệp vụ.
-- =====================================================================
GRANT SELECT ON SCHEMA::dbo TO role_QuanLy;

GRANT EXECUTE ON dbo.sp_BaoCaoChePhamSapHetHan  TO role_QuanLy;
GRANT EXECUTE ON dbo.sp_BaoCaoKetQuaDotHienMau  TO role_QuanLy;
GRANT EXECUTE ON dbo.sp_ExportTonKhoChePhamCSV  TO role_QuanLy;
GRANT EXECUTE ON dbo.sp_BackupDuLieu            TO role_QuanLy;
GRANT EXECUTE ON dbo.sp_RestoreDuLieu           TO role_QuanLy;
-- Lệnh BACKUP DATABASE bên trong sp_BackupDuLieu cần quyền riêng (không theo chuỗi sở hữu)
GRANT BACKUP DATABASE TO role_QuanLy;

GRANT EXECUTE ON dbo.fn_TinhTuoi             TO role_QuanLy;
GRANT EXECUTE ON dbo.fn_KiemTraTuongThich    TO role_QuanLy;
GRANT EXECUTE ON dbo.fn_TongTheTichDaPhanBo  TO role_QuanLy;

DENY INSERT, UPDATE ON dbo.NguoiHienMau    TO role_QuanLy;
DENY INSERT, UPDATE ON dbo.LanHienMau      TO role_QuanLy;
DENY INSERT, UPDATE ON dbo.DonViMau        TO role_QuanLy;
DENY INSERT, UPDATE ON dbo.KetQuaXetNghiem TO role_QuanLy;
DENY INSERT, UPDATE ON dbo.ChePhamMau      TO role_QuanLy;
DENY INSERT, UPDATE ON dbo.LichSuKho       TO role_QuanLy;
DENY INSERT, UPDATE ON dbo.BenhNhan        TO role_QuanLy;
DENY INSERT, UPDATE ON dbo.YeuCauCapMau    TO role_QuanLy;
DENY INSERT, UPDATE ON dbo.PhanBoMau       TO role_QuanLy;
DENY INSERT, UPDATE ON dbo.TruyenMau       TO role_QuanLy;
DENY DELETE ON SCHEMA::dbo TO role_QuanLy;
GO

-- Kiểm tra nhanh: liệt kê quyền của 3 nhóm
SELECT pr.name AS NhomQuyen, pe.state_desc AS Loai, pe.permission_name AS Quyen,
       CASE pe.class WHEN 0 THEN N'(database)' WHEN 3 THEN N'(schema dbo)' ELSE OBJECT_NAME(pe.major_id) END AS DoiTuong
FROM sys.database_permissions pe
JOIN sys.database_principals pr ON pr.principal_id = pe.grantee_principal_id
WHERE pr.name IN (N'role_NhanVienNganHangMau', N'role_BacSi', N'role_QuanLy')
ORDER BY pr.name, DoiTuong, pe.permission_name;
GO
