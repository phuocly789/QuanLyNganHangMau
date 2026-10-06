/* =====================================================================
   ĐỒ ÁN QUẢN LÝ THÔNG TIN - NGÂN HÀNG, ĐIỀU CHUYỂN, HIẾN MÁU (NHÓM 4)
   Script tổng hợp từ Chương 3 (Cài đặt) và Chương 4 mục 1-3 của báo cáo
   ===================================================================== */
IF DB_ID(N'QuanLyNganHangMau') IS NOT NULL
BEGIN
    ALTER DATABASE QuanLyNganHangMau
    SET SINGLE_USER
    WITH ROLLBACK IMMEDIATE;

    DROP DATABASE QuanLyNganHangMau;
END
GO
IF DB_ID(N'QuanLyNganHangMau') IS NULL
    CREATE DATABASE QuanLyNganHangMau;
GO
USE QuanLyNganHangMau;
GO

-- =====================================================================
-- CHƯƠNG 3: CÀI ĐẶT
-- =====================================================================

-- =====================================================================
-- 1. NhomMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1.1. Tạo bảng
CREATE TABLE NhomMau (
    MaNhomMau BIGINT NOT NULL,
    TenNhomMau NVARCHAR(50) NOT NULL UNIQUE,
    MoTa NVARCHAR(255) NULL,
    PRIMARY KEY (MaNhomMau)
);
GO

-- ---------------------------------------------------------------------
-- 1.2. Thêm dữ liệu vào bảng
INSERT INTO NhomMau (MaNhomMau, TenNhomMau, MoTa)
VALUES
(1, N'O+', N'Nhóm máu O dương - phổ biến nhất'),
(2, N'A+', N'Nhóm máu A dương'),
(3, N'B+', N'Nhóm máu B dương'),
(4, N'AB+', N'Nhóm máu AB dương - nhận tất cả'),
(5, N'O-', N'Nhóm máu O âm - chuyên hiếm'),
(6, N'A-', N'Nhóm máu A âm'),
(7, N'B-', N'Nhóm máu B âm'),
(8, N'AB-', N'Nhóm máu AB âm - rất hiếm');
GO

-- =====================================================================
-- 2. NguoiHienMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 2.1. Tạo bảng
CREATE TABLE NguoiHienMau (
    MaNguoiHien BIGINT NOT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    NgaySinh DATE NOT NULL,
    GioiTinh NVARCHAR(10) NOT NULL CHECK (GioiTinh IN (N'Nam', N'Nữ')),
    CCCD VARCHAR(20) NOT NULL UNIQUE,
    SoDienThoai VARCHAR(15) NULL,
    DiaChi NVARCHAR(255) NULL,
    MaNhomMau BIGINT NULL,
    PRIMARY KEY (MaNguoiHien),
    FOREIGN KEY (MaNhomMau) REFERENCES NhomMau(MaNhomMau)
);
GO

-- ---------------------------------------------------------------------
-- 2.2. Thêm dữ liệu vào bảng
INSERT INTO NguoiHienMau (MaNguoiHien, HoTen, NgaySinh, GioiTinh, CCCD, SoDienThoai, DiaChi, MaNhomMau)
VALUES
(1, N'Nguyễn Văn An', '1990-05-15', N'Nam', '001090012345', '0901234567', N'123 Lê Lợi, Quận 1, TP.HCM', 1),
(2, N'Trần Thị Bình', '1995-08-20', N'Nữ', '001195023456', '0912345678', N'456 Nguyễn Huệ, Quận 1, TP.HCM', 2),
(3, N'Lê Hoàng Cường', '1988-12-10', N'Nam', '001088034567', '0923456789', N'789 Điện Biên Phủ, Quận 3, TP.HCM', 3),
(4, N'Phạm Dung Nhi', '2000-03-25', N'Nữ', '001200045678', NULL, N'12 Cách Mạng Tháng 8, Quận 10, TP.HCM', 4),
(5, N'Vũ Minh Đức', '1992-07-04', N'Nam', '001092056789', '0945678901', NULL, 5),
(6, N'Hoàng Thị Giang', '1997-11-30', N'Nữ', '001197067890', '0956789012', N'88 Trần Hưng Đạo, Quận 5, TP.HCM', 6),
(7, N'Đỗ Hải Nam', '2001-01-18', N'Nam', '001201078901', '0967890123', N'15 Nguyễn Trãi, Quận 5, TP.HCM', 7),
(8, N'Ngô Mai Phương', '1994-09-09', N'Nữ', '001194089012', NULL, NULL, 8),
(9, N'Bùi Khánh Vinh', '1985-04-12', N'Nam', '001085090123', '0989012345', N'102 Hai Bà Trưng, Quận 1, TP.HCM', 1),
(10, N'Đặng Thu Thảo', '1999-06-22', N'Nữ', '001199101234', '0990123456', N'54 Lê Văn Sỹ, Quận Phú Nhuận, TP.HCM', 2),
(11, N'Trịnh Quốc Bảo', '2003-10-05', N'Nam', '001203112345', '0909876543', N'23 Võ Thị Sáu, Quận 3, TP.HCM', 3),
(12, N'Lý Kim Anh', '1996-02-14', N'Nữ', '001196123456', '0918765432', N'67 Hoàng Văn Thụ, Quận Tân Bình, TP.HCM', 4);
GO

-- =====================================================================
-- 3. DotHienMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 3.1. Tạo bảng
CREATE TABLE DotHienMau (
    MaDot BIGINT PRIMARY KEY,
    TenDot NVARCHAR(200) NOT NULL,
    NgayBD DATE NOT NULL,
    NgayKT DATE NOT NULL,
    DiaDiem NVARCHAR(255) NULL,
    MoTa NVARCHAR(500) NULL,
    TrangThai NVARCHAR(30) NOT NULL,
    CONSTRAINT CK_DotHienMau_Ngay CHECK (NgayKT >= NgayBD),
    CONSTRAINT CK_DotHienMau_TrangThai CHECK (TrangThai IN (
        N'Sắp diễn ra', N'Đang diễn ra', N'Đã kết thúc'
    ))
);
GO

-- ---------------------------------------------------------------------
-- 3.2. Thêm dữ liệu vào bảng
INSERT INTO DotHienMau (MaDot, TenDot, NgayBD, NgayKT, DiaDiem, MoTa, TrangThai)
VALUES
(1, N'Hiến máu tình nguyện tháng 1/2026', '2026-01-10', '2026-01-10', N'Nhà văn hóa Thanh Niên', N'Chương trình hiến máu tình nguyện đầu năm', N'Đã kết thúc'),
(2, N'Ngày hội hiến máu Xuân 2026', '2026-02-15', '2026-02-15', N'Đại học Kinh tế TP.HCM', N'Ngày hội hiến máu nhân đạo đầu năm', N'Đã kết thúc'),
(3, N'Hiến máu vì cộng đồng tháng 3', '2026-03-20', '2026-03-20', N'Nhà văn hóa Quận 1', N'Chương trình hiến máu vì cộng đồng', N'Đã kết thúc'),
(4, N'Ngày hội hiến máu tháng 4', '2026-04-12', '2026-04-12', N'Bệnh viện Chợ Rẫy', N'Tiếp nhận máu phục vụ điều trị bệnh nhân', N'Đã kết thúc'),
(5, N'Hiến máu tình nguyện tháng 5', '2026-05-18', '2026-05-18', N'Trung tâm Hiến máu Nhân đạo', N'Chương trình vận động người dân tham gia hiến máu', N'Đã kết thúc'),
(6, N'Ngày hội hiến máu tháng 6', '2026-06-21', '2026-06-21', N'Đại học Quốc gia TP.HCM', N'Chương trình hiến máu dành cho sinh viên', N'Đã kết thúc'),
(7, N'Hiến máu tình nguyện tháng 7', '2026-07-11', '2026-07-11', N'Nhà văn hóa Thanh Niên', N'Chương trình bổ sung nguồn máu dự trữ', N'Đã kết thúc'),
(8, N'Ngày hội hiến máu tháng 8', '2026-08-16', '2026-08-16', N'Bệnh viện Nhân dân 115', N'Tiếp nhận máu phục vụ nhu cầu cấp cứu', N'Đã kết thúc'),
(9, N'Hiến máu tình nguyện tháng 9', '2026-09-05', '2026-09-05', N'Nhà văn hóa Thanh Niên', N'Chương trình hiến máu dành cho người dân', N'Đã kết thúc'),
(10, N'Ngày hội hiến máu vì cộng đồng', '2026-09-20', '2026-09-20', N'Đại học Kinh tế TP.HCM', N'Ngày hội hiến máu hưởng ứng phong trào nhân đạo', N'Đang diễn ra'),
(11, N'Hiến máu nhân đạo tháng 10', '2026-10-10', '2026-10-10', N'Bệnh viện Chợ Rẫy', N'Chương trình tiếp nhận máu phục vụ điều trị', N'Sắp diễn ra'),
(12, N'Hiến máu cuối năm 2026', '2026-12-05', '2026-12-05', N'Nhà văn hóa Quận 1', N'Chương trình bổ sung nguồn máu dự trữ cuối năm', N'Sắp diễn ra');
GO

-- =====================================================================
-- 4. NganHangMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 4.1. Tạo bảng
CREATE TABLE NganHangMau (
    MaNganHangMau INT PRIMARY KEY,
    TenNganHangMau NVARCHAR(200) NOT NULL,
    DiaChi NVARCHAR(300) NOT NULL,
    SoDienThoai VARCHAR(15) NOT NULL,
    Email VARCHAR(100),
    NguoiQuanLy NVARCHAR(100) NOT NULL,
    SucChuaToiDa INT NOT NULL,
    LuongMauHienTai INT NOT NULL,
    TrangThai NVARCHAR(30) NOT NULL,
    GhiChuNganHangMau NVARCHAR(500),

    CONSTRAINT CK_NHM_SucChua CHECK (SucChuaToiDa > 0),
    CONSTRAINT CK_NHM_LuongMau CHECK (LuongMauHienTai >= 0),
    CONSTRAINT CK_NHM_DungLuong CHECK (LuongMauHienTai <= SucChuaToiDa),
    CONSTRAINT CK_NHM_TrangThai CHECK (TrangThai IN (
        N'Hoạt động', N'Bảo trì', N'Ngừng hoạt động'
    ))
);
GO

-- ---------------------------------------------------------------------
-- 4.2. Thêm dữ liệu vào bảng
INSERT INTO NganHangMau (MaNganHangMau, TenNganHangMau, DiaChi, SoDienThoai, Email, NguoiQuanLy, SucChuaToiDa, LuongMauHienTai, TrangThai, GhiChuNganHangMau)
VALUES
(1, N'Ngân hàng máu Chợ Rẫy', N'201B Nguyễn Chí Thanh, Quận 5, TP.HCM', '02838554137', 'bank1@blood.vn', N'Nguyễn Văn An', 10000, 6500, N'Hoạt động', N'Trung tâm tiếp nhận máu khu vực phía Nam'),
(2, N'Ngân hàng máu Đại học Y Dược', N'215 Hồng Bàng, Quận 5, TP.HCM', '02838554200', 'bank2@blood.vn', N'Trần Thị Bình', 8000, 4200, N'Hoạt động', N'Phục vụ nhiều bệnh viện vệ tinh'),
(3, N'Ngân hàng máu Thống Nhất', N'1 Lý Thường Kiệt, Tân Bình, TP.HCM', '02838690277', 'bank3@blood.vn', N'Lê Hoàng Long', 7000, 3900, N'Hoạt động', N'Dự trữ máu cấp cứu'),
(4, N'Ngân hàng máu Nhân Dân 115', N'527 Sư Vạn Hạnh, Quận 10, TP.HCM', '02838653245', 'bank4@blood.vn', N'Võ Thị Mai', 9000, 5000, N'Hoạt động', N'Kho trung tâm'),
(5, N'Ngân hàng máu Gia Định', N'1 Nơ Trang Long, Bình Thạnh, TP.HCM', '02838994682', 'bank5@blood.vn', N'Phạm Minh Đức', 6000, 2800, N'Hoạt động', N'Lưu trữ hồng cầu'),
(6, N'Ngân hàng máu Nhi Đồng 1', N'341 Sư Vạn Hạnh, Quận 10, TP.HCM', '02839271119', 'bank6@blood.vn', N'Ngô Thanh Hương', 5000, 2200, N'Hoạt động', N'Ưu tiên cấp máu cho trẻ em'),
(7, N'Ngân hàng máu Nhi Đồng 2', N'14 Lý Tự Trọng, Quận 1, TP.HCM', '02838295723', 'bank7@blood.vn', N'Bùi Văn Hùng', 5000, 1800, N'Hoạt động', N'Kho huyết tương'),
(8, N'Ngân hàng máu Trung ương', N'Khu Công nghệ cao, TP.Thủ Đức', '02837360001', 'bank8@blood.vn', N'Đặng Quốc Việt', 15000, 9200, N'Hoạt động', N'Trung tâm điều phối máu'),
(9, N'Ngân hàng máu Bình Dương', N'Thủ Dầu Một, Bình Dương', '02743821234', 'bank9@blood.vn', N'Hoàng Hải Nam', 7000, 3400, N'Bảo trì', N'Đang nâng cấp hệ thống làm lạnh'),
(10, N'Ngân hàng máu Đồng Nai', N'Biên Hòa, Đồng Nai', '02513820111', 'bank10@blood.vn', N'Lý Thành Công', 6500, 3000, N'Hoạt động', N'Kho dự phòng'),
(11, N'Ngân hàng máu Long An', N'Tân An, Long An', '02723899000', 'bank11@blood.vn', N'Nguyễn Hoàng Sơn', 4500, 1500, N'Ngừng hoạt động', N'Tạm ngưng để cải tạo'),
(12, N'Ngân hàng máu Cần Thơ', N'Ninh Kiều, Cần Thơ', '02923888999', 'bank12@blood.vn', N'Trịnh Quang Khải', 8500, 4900, N'Hoạt động', N'Hỗ trợ khu vực Đồng bằng sông Cửu Long');
GO

-- =====================================================================
-- 5. ViTriLuuTru
-- =====================================================================

-- ---------------------------------------------------------------------
-- 5.1. Tạo bảng
CREATE TABLE ViTriLuuTru (
    MaViTri INT PRIMARY KEY,
    MaNganHangMau INT NOT NULL,
    TenViTri NVARCHAR(100) NOT NULL,
    LoaiLuuTru NVARCHAR(50) NOT NULL,
    NhietDoBaoQuan DECIMAL(5,2) NOT NULL,
    SucChua INT NOT NULL,
    LuongHienTai INT NOT NULL,
    TrangThai NVARCHAR(30) NOT NULL,
    GhiChu NVARCHAR(500),

    CONSTRAINT CK_VTLT_SucChua CHECK (SucChua > 0),
    CONSTRAINT CK_VTLT_Luong CHECK (LuongHienTai >= 0),
    CONSTRAINT CK_VTLT_DungLuong CHECK (LuongHienTai <= SucChua),
    CONSTRAINT CK_VTLT_LoaiLuuTru CHECK (LoaiLuuTru IN (
        N'Tủ lạnh', N'Ngăn đông', N'Kho huyết tương', N'Kho tiểu cầu'
    )),
    CONSTRAINT CK_VTLT_TrangThai CHECK (TrangThai IN (
        N'Còn chỗ', N'Đầy', N'Bảo trì', N'Không sử dụng'
    )),
    CONSTRAINT FK_VTLT_NganHangMau FOREIGN KEY (MaNganHangMau) REFERENCES NganHangMau(MaNganHangMau)
);
GO

-- ---------------------------------------------------------------------
-- 5.2. Thêm dữ liệu vào bảng
INSERT INTO ViTriLuuTru (MaViTri, MaNganHangMau, TenViTri, LoaiLuuTru, NhietDoBaoQuan, SucChua, LuongHienTai, TrangThai, GhiChu)
VALUES
(1, 1, N'Tủ lạnh A1', N'Tủ lạnh', 4.00, 500, 350, N'Còn chỗ', N'Lưu trữ hồng cầu'),
(2, 1, N'Tủ lạnh A2', N'Tủ lạnh', 4.00, 500, 500, N'Đầy', N'Đã đạt sức chứa tối đa'),
(3, 2, N'Kho Plasma B1', N'Kho huyết tương', -30.00, 1000, 650, N'Còn chỗ', N'Bảo quản huyết tương đông lạnh'),
(4, 2, N'Kho Plasma B2', N'Kho huyết tương', -35.00, 1000, 1000, N'Đầy', N'Đã đạt sức chứa tối đa'),
(5, 3, N'Kho Tiểu cầu C1', N'Kho tiểu cầu', 22.00, 300, 180, N'Còn chỗ', N'Yêu cầu lắc liên tục'),
(6, 3, N'Kho Tiểu cầu C2', N'Kho tiểu cầu', 22.00, 300, 300, N'Đầy', N'Đang sử dụng tối đa'),
(7, 4, N'Tủ đông D1', N'Ngăn đông', -40.00, 700, 500, N'Còn chỗ', N'Bảo quản huyết tương'),
(8, 4, N'Tủ đông D2', N'Ngăn đông', -40.00, 700, 0, N'Bảo trì', N'Đang thay cảm biến nhiệt'),
(9, 5, N'Tủ lạnh E1', N'Tủ lạnh', 4.00, 450, 250, N'Còn chỗ', N'Lưu trữ hồng cầu lắng'),
(10, 6, N'Tủ lạnh F1', N'Tủ lạnh', 4.00, 500, 0, N'Không sử dụng', N'Tạm dừng vận hành'),
(11, 8, N'Kho Trung tâm G1', N'Tủ lạnh', 4.00, 1500, 1200, N'Còn chỗ', N'Dự trữ điều phối khẩn cấp'),
(12, 12, N'Kho Miền Tây H1', N'Kho huyết tương', -30.00, 1200, 850, N'Còn chỗ', N'Hỗ trợ cấp cứu khu vực');
GO

-- =====================================================================
-- 6. LanHienMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 6.1. Tạo bảng
CREATE TABLE LanHienMau (
    MaLanHien BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiHien BIGINT NOT NULL,
    MaDot BIGINT NOT NULL,
    NgayHien DATE NOT NULL,
    ThoiGianHien DATETIME NULL,
    LuongMau INT NOT NULL,
    LoaiHienMau NVARCHAR(50) NOT NULL,
    KetQuaKham NVARCHAR(100) NULL,
    TrangThai NVARCHAR(30) NOT NULL,
    GhiChu NVARCHAR(500) NULL,

    CONSTRAINT FK_LanHienMau_NguoiHien FOREIGN KEY (MaNguoiHien) REFERENCES NguoiHienMau(MaNguoiHien),
    CONSTRAINT FK_LanHienMau_DotHien FOREIGN KEY (MaDot) REFERENCES DotHienMau(MaDot),
    CONSTRAINT CK_LanHienMau_LuongMau CHECK (LuongMau IN (250, 350, 450)),
    CONSTRAINT CK_LanHienMau_Loai CHECK (LoaiHienMau IN (N'Máu toàn phần', N'Huyết tương', N'Tiểu cầu')),
    CONSTRAINT CK_LanHienMau_KetQuaKham CHECK (KetQuaKham IS NULL OR KetQuaKham IN (N'Đủ điều kiện', N'Không đủ điều kiện')),
    CONSTRAINT CK_LanHienMau_TrangThai CHECK (TrangThai IN (N'Đã đăng ký', N'Đã hiến', N'Không đạt', N'Đã hủy'))
);
GO

-- ---------------------------------------------------------------------
-- 6.2. Thêm dữ liệu vào bảng
SET IDENTITY_INSERT LanHienMau ON;
INSERT INTO LanHienMau (MaLanHien, MaNguoiHien, MaDot, NgayHien, ThoiGianHien, LuongMau, LoaiHienMau, KetQuaKham, TrangThai, GhiChu)
VALUES
(1, 1, 1, '2026-01-10', '2026-01-10 08:00:00', 350, N'Máu toàn phần', N'Đủ điều kiện', N'Đã hiến', N'Hiến máu bình thường'),
(2, 2, 1, '2026-01-10', '2026-01-10 08:20:00', 450, N'Máu toàn phần', N'Đủ điều kiện', N'Đã hiến', NULL),
(3, 3, 2, '2026-02-15', '2026-02-15 08:30:00', 350, N'Máu toàn phần', N'Đủ điều kiện', N'Đã hiến', NULL),
(4, 4, 3, '2026-03-20', '2026-03-20 09:00:00', 250, N'Tiểu cầu', N'Đủ điều kiện', N'Đã hiến', N'Hiến tiểu cầu'),
(5, 5, 4, '2026-04-12', '2026-04-12 09:15:00', 450, N'Máu toàn phần', N'Đủ điều kiện', N'Đã hiến', NULL),
(6, 6, 5, '2026-05-18', '2026-05-18 08:45:00', 350, N'Máu toàn phần', N'Không đủ điều kiện', N'Không đạt', N'Không đạt điều kiện sức khỏe'),
(7, 7, 6, '2026-06-21', '2026-06-21 09:30:00', 350, N'Máu toàn phần', N'Đủ điều kiện', N'Đã hiến', NULL),
(8, 8, 7, '2026-07-11', '2026-07-11 10:00:00', 450, N'Máu toàn phần', N'Đủ điều kiện', N'Đã hiến', NULL),
(9, 9, 8, '2026-08-16', '2026-08-16 08:30:00', 250, N'Tiểu cầu', N'Đủ điều kiện', N'Đã hiến', N'Hiến tiểu cầu'),
(10, 10, 9, '2026-09-05', '2026-09-05 09:00:00', 350, N'Máu toàn phần', N'Đủ điều kiện', N'Đã hiến', NULL),
(11, 11, 10, '2026-09-20', '2026-09-20 09:30:00', 450, N'Máu toàn phần', N'Đủ điều kiện', N'Đã hiến', NULL),
(12, 12, 10, '2026-09-20', '2026-09-20 10:00:00', 350, N'Huyết tương', N'Đủ điều kiện', N'Đã hiến', N'Hiến huyết tương');
SET IDENTITY_INSERT LanHienMau OFF;
GO

-- =====================================================================
-- 7. DonViMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 7.1. Tạo bảng
CREATE TABLE DonViMau (
    MaDonViMau BIGINT PRIMARY KEY,
    MaLanHien BIGINT NOT NULL,
    MaNhomMau BIGINT NULL,
    MaViTri INT NULL,
    TheTich INT NOT NULL,
    NgayThuThap DATE NOT NULL,
    NgayHetHan DATE NOT NULL,
    PhuongPhap NVARCHAR(50),
    TrangThai NVARCHAR(30) NOT NULL,
    GhiChu NVARCHAR(500),

    CONSTRAINT FK_DonViMau_LanHienMau FOREIGN KEY (MaLanHien) REFERENCES LanHienMau(MaLanHien),
    CONSTRAINT FK_DonViMau_NhomMau FOREIGN KEY (MaNhomMau) REFERENCES NhomMau(MaNhomMau),
    CONSTRAINT FK_DonViMau_ViTriLuuTru FOREIGN KEY (MaViTri) REFERENCES ViTriLuuTru(MaViTri),
    CONSTRAINT CK_DonViMau_TheTich CHECK (TheTich > 0),
    CONSTRAINT CK_DonViMau_HanSuDung CHECK (NgayHetHan > NgayThuThap),
    CONSTRAINT CK_DonViMau_TrangThai CHECK (TrangThai IN (
        N'Chờ xét nghiệm', N'Đạt chuẩn', N'Không đạt',
        N'Đã tách chế phẩm', N'Đã phân bổ', N'Đã xuất kho',
        N'Đã truyền', N'Hết hạn', N'Đã tiêu hủy'
    ))
);
GO

-- ---------------------------------------------------------------------
-- 7.2. Thêm dữ liệu vào bảng
INSERT INTO DonViMau (MaDonViMau, MaLanHien, MaNhomMau, MaViTri, TheTich, NgayThuThap, NgayHetHan, PhuongPhap, TrangThai, GhiChu)
VALUES
(1, 1, 1, 1, 350, '2026-01-10', '2026-02-14', N'Toàn phần', N'Đã tách chế phẩm', N'Đã tách khối hồng cầu và huyết tương tươi đông lạnh'),
(2, 2, 2, 2, 450, '2026-01-10', '2026-02-14', N'Toàn phần', N'Đã tách chế phẩm', N'Đã tách khối hồng cầu'),
(3, 3, 3, 3, 350, '2026-02-15', '2026-03-22', N'Toàn phần', N'Đã tách chế phẩm', N'Đã tách khối hồng cầu và huyết tương tươi đông lạnh'),
(4, 4, 4, 4, 250, '2026-03-20', '2026-03-25', N'Gạn tách tiểu cầu', N'Không đạt', N'Dương tính giang mai, chờ tiêu hủy'),
(5, 5, 5, 5, 450, '2026-04-12', '2026-05-17', N'Toàn phần', N'Đã tách chế phẩm', N'Đã tách khối hồng cầu nhóm O Rh(D) âm'),
(6, 6, 6, 6, 350, '2026-05-18', '2026-06-22', N'Toàn phần', N'Không đạt', N'Sức khỏe người hiến không đủ điều kiện'),
(7, 7, NULL, 7, 350, '2026-06-21', '2026-07-26', N'Toàn phần', N'Không đạt', N'Định nhóm máu không rõ, cần loại bỏ'),
(8, 8, 8, 8, 450, '2026-07-11', '2026-08-15', N'Toàn phần', N'Đã tách chế phẩm', N'Đã tách khối hồng cầu nhóm AB Rh(D) âm'),
(9, 9, 1, 9, 250, '2026-08-16', '2026-08-21', N'Gạn tách tiểu cầu', N'Đã tách chế phẩm', N'Khối tiểu cầu gạn tách nhóm O'),
(10, 10, 2, 10, 350, '2026-09-05', '2026-10-10', N'Toàn phần', N'Đã tách chế phẩm', N'Đã tách khối hồng cầu và huyết tương tươi đông lạnh'),
(11, 11, 3, 11, 450, '2026-09-20', '2026-10-25', N'Toàn phần', N'Chờ xét nghiệm', N'Đang chờ kết quả xét nghiệm NAT'),
(12, 12, 4, NULL, 350, '2026-09-20', '2026-10-25', N'Huyết tương', N'Đã tách chế phẩm', N'Đã điều chế tủa lạnh từ huyết tương gạn tách');

GO

-- =====================================================================
-- 8. LoaiXetNghiem
-- =====================================================================

-- ---------------------------------------------------------------------
-- 8.1. Tạo bảng
CREATE TABLE LoaiXetNghiem (
    MaLoaiXN INT PRIMARY KEY,
    TenLoaiXN NVARCHAR(100) NOT NULL,
    MoTa NVARCHAR(500),
    NguongDat NVARCHAR(100),
    BatBuoc BIT NOT NULL,
    ThoiGianTraKQ INT NOT NULL,
    TrangThai NVARCHAR(30) NOT NULL,

    CONSTRAINT UQ_LoaiXetNghiem_Ten UNIQUE (TenLoaiXN),
    CONSTRAINT CK_LoaiXetNghiem_ThoiGian CHECK (ThoiGianTraKQ > 0),
    CONSTRAINT CK_LoaiXetNghiem_TrangThai CHECK (TrangThai IN (
        N'Đang áp dụng', N'Ngừng áp dụng'
    ))
);
GO

-- ---------------------------------------------------------------------
-- 8.2. Thêm dữ liệu vào bảng
INSERT INTO LoaiXetNghiem (MaLoaiXN, TenLoaiXN, MoTa, NguongDat, BatBuoc, ThoiGianTraKQ, TrangThai)
VALUES
(1, N'Xét nghiệm HIV Ag/Ab', N'Sàng lọc kháng nguyên và kháng thể HIV 1/2', N'S/CO < 1.0', 1, 4, N'Đang áp dụng'),
(2, N'Xét nghiệm HBsAg', N'Phát hiện kháng nguyên bề mặt virus viêm gan B', N'S/CO < 1.0', 1, 4, N'Đang áp dụng'),
(3, N'Xét nghiệm Anti-HCV', N'Phát hiện kháng thể virus viêm gan C', N'S/CO < 1.0', 1, 4, N'Đang áp dụng'),
(4, N'Xét nghiệm giang mai (Syphilis)', N'Sàng lọc xoắn khuẩn Treponema pallidum', N'S/CO < 1.0', 1, 3, N'Đang áp dụng'),
(5, N'Xét nghiệm ký sinh trùng sốt rét', N'Soi lam máu tìm ký sinh trùng sốt rét', N'Không tìm thấy KST', 1, 2, N'Đang áp dụng'),
(6, N'Định nhóm máu hệ ABO', N'Định nhóm huyết thanh mẫu và hồng cầu mẫu', N'Kết quả rõ ràng', 1, 2, N'Đang áp dụng'),
(7, N'Định nhóm máu hệ Rh(D)', N'Xác định kháng nguyên D trên bề mặt hồng cầu', N'Kết quả rõ ràng', 1, 2, N'Đang áp dụng'),
(8, N'Định lượng men gan ALT', N'Đánh giá chức năng gan của đơn vị máu', N'ALT <= 40 U/L', 0, 6, N'Đang áp dụng'),
(9, N'Sàng lọc kháng thể bất thường', N'Phát hiện kháng thể bất thường trong huyết thanh', N'Âm tính', 0, 8, N'Đang áp dụng'),
(10, N'Xét nghiệm CMV', N'Sàng lọc Cytomegalovirus cho bệnh nhân đặc biệt', N'S/CO < 1.0', 0, 12, N'Đang áp dụng'),
(11, N'Xét nghiệm NAT', N'Khuếch đại acid nucleic HIV/HBV/HCV', N'Không phát hiện', 1, 24, N'Đang áp dụng'),
(12, N'Xét nghiệm HTLV I/II', N'Sàng lọc virus hướng lympho T, đã ngừng từ 2026', N'S/CO < 1.0', 0, 12, N'Ngừng áp dụng');
GO

-- =====================================================================
-- 9. KetQuaXetNghiem
-- =====================================================================

-- ---------------------------------------------------------------------
-- 9.1. Tạo bảng
CREATE TABLE KetQuaXetNghiem (
    MaXetNghiem INT IDENTITY(1,1) PRIMARY KEY,
    MaDonViMau BIGINT NOT NULL,
    MaLoaiXN INT NOT NULL,
    NgayXetNghiem DATETIME NOT NULL,
    ThoiGianTraKQ DATETIME,
    NguoiThucHien NVARCHAR(100),
    GiaTriDo DECIMAL(10,2),
    KetQua NVARCHAR(30) NOT NULL,
    KetLuan NVARCHAR(10) NOT NULL,
    GhiChu NVARCHAR(500),

    CONSTRAINT CK_KQXN_KetQua CHECK (KetQua IN (N'Âm tính', N'Dương tính', N'Không xác định')),
    CONSTRAINT CK_KQXN_KetLuan CHECK (KetLuan IN (N'Đạt', N'Không đạt')),
    CONSTRAINT CK_KQXN_GiaTriDo CHECK (GiaTriDo IS NULL OR GiaTriDo >= 0),
    CONSTRAINT CK_KQXN_ThoiGianTraKQ CHECK (
        ThoiGianTraKQ IS NULL OR ThoiGianTraKQ >= CAST(NgayXetNghiem AS DATETIME2)
    ),
    CONSTRAINT FK_KetQuaXetNghiem_DonViMau FOREIGN KEY (MaDonViMau) REFERENCES DonViMau(MaDonViMau),
    CONSTRAINT FK_KetQuaXetNghiem_LoaiXetNghiem FOREIGN KEY (MaLoaiXN) REFERENCES LoaiXetNghiem(MaLoaiXN)
);
GO

-- ---------------------------------------------------------------------
-- 9.2. Thêm dữ liệu vào bảng
SET IDENTITY_INSERT KetQuaXetNghiem ON;
INSERT INTO KetQuaXetNghiem (MaXetNghiem, MaDonViMau, MaLoaiXN, NgayXetNghiem, ThoiGianTraKQ, NguoiThucHien, GiaTriDo, KetQua, KetLuan, GhiChu)
VALUES
(1, 1, 1, '2026-01-10 09:00:00', '2026-01-10 13:00:00', N'Nguyễn Văn An', 0.12, N'Âm tính', N'Đạt', N'Kết quả trong ngưỡng an toàn'),
(2, 2, 2, '2026-01-10 09:30:00', '2026-01-10 13:30:00', N'Trần Thị Bình', 0.25, N'Âm tính', N'Đạt', N'Không phát hiện HBsAg'),
(3, 3, 3, '2026-02-15 09:00:00', '2026-02-15 13:00:00', N'Lê Hoàng Cường', 0.18, N'Âm tính', N'Đạt', N'Đủ điều kiện cấp phát'),
(4, 4, 4, '2026-03-20 10:00:00', '2026-03-20 13:00:00', N'Phạm Thị Dung', 1.85, N'Dương tính', N'Không đạt', N'Đã báo cáo và niêm phong túi máu'),
(5, 5, 5, '2026-04-12 10:00:00', '2026-04-12 12:00:00', N'Võ Minh Đức', 0.05, N'Âm tính', N'Đạt', N'Không tìm thấy ký sinh trùng'),
(6, 6, 8, '2026-05-18 09:00:00', '2026-05-18 15:00:00', N'Đặng Thu Hà', 55.50, N'Dương tính', N'Không đạt', N'ALT vượt ngưỡng an toàn'),
(7, 7, 6, '2026-06-21 10:00:00', '2026-06-21 12:00:00', N'Bùi Quang Huy', NULL, N'Không xác định', N'Không đạt', N'Ngưng kết yếu, cần định nhóm lại'),
(8, 8, 7, '2026-07-11 11:00:00', '2026-07-11 13:00:00', N'Ngô Thanh Lan', NULL, N'Âm tính', N'Đạt', N'Rh(D) âm, lưu ý khi cấp phát'),
(9, 9, 9, '2026-08-16 09:00:00', '2026-08-16 17:00:00', N'Hoàng Văn Nam', 0.30, N'Âm tính', N'Đạt', N'Không có kháng thể bất thường'),
(10, 10, 11, '2026-09-05 10:00:00', '2026-09-06 10:00:00', N'Trịnh Mỹ Linh', 0.07, N'Âm tính', N'Đạt', N'NAT không phát hiện acid nucleic virus'),
(11, 11, 10, '2026-09-20 10:00:00', '2026-09-20 22:00:00', N'Lý Gia Bảo', 0.10, N'Âm tính', N'Đạt', N'CMV âm tính'),
(12, 12, 1, '2026-09-20 11:00:00', '2026-09-20 15:00:00', N'Nguyễn Thị Kim Oanh', 0.09, N'Âm tính', N'Đạt', N'Mẫu đạt tiêu chuẩn');
SET IDENTITY_INSERT KetQuaXetNghiem OFF;
GO

-- =====================================================================
-- 10. ChePhamMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 10.1. Tạo bảng
CREATE TABLE ChePhamMau (
    MaChePham INT PRIMARY KEY,
    MaDonViMau BIGINT NOT NULL,
    MaViTri INT NULL,
    LoaiChePham NVARCHAR(100) NOT NULL,
    TheTich INT NOT NULL,
    NgayTachChePham DATE NOT NULL,
    HanSuDung DATE NOT NULL,
    TrangThai NVARCHAR(50) NOT NULL,
    GhiChu NVARCHAR(500),

    CONSTRAINT FK_ChePhamMau_DonViMau FOREIGN KEY (MaDonViMau) REFERENCES DonViMau(MaDonViMau),
    CONSTRAINT FK_ChePhamMau_ViTriLuuTru FOREIGN KEY (MaViTri) REFERENCES ViTriLuuTru(MaViTri),
    CONSTRAINT CK_CPM_TheTich CHECK (TheTich > 0),
    CONSTRAINT CK_CPM_NgayTach_HanSuDung CHECK (HanSuDung >= NgayTachChePham),
    CONSTRAINT CK_CPM_LoaiChePham CHECK (LoaiChePham IN (N'Khối hồng cầu', N'Huyết tương tươi đông lạnh', N'Khối tiểu cầu', N'Tủa lạnh')),
    CONSTRAINT CK_CPM_TrangThai CHECK (TrangThai IN (N'Đang lưu trữ', N'Đã cấp phát', N'Đã sử dụng', N'Hết hạn', N'Đã hủy'))
);
GO

-- ---------------------------------------------------------------------
-- 10.2. Thêm dữ liệu vào bảng
INSERT INTO ChePhamMau (MaChePham, MaDonViMau, MaViTri, LoaiChePham, TheTich, NgayTachChePham, HanSuDung, TrangThai, GhiChu)
VALUES
(1,  1,  NULL, N'Khối hồng cầu', 200, '2026-01-10', '2026-02-14', N'Đã sử dụng', N'Đã truyền theo yêu cầu cấp máu số 1'),
(2,  1,  3,    N'Huyết tương tươi đông lạnh', 120, '2026-01-10', '2027-01-10', N'Đang lưu trữ', N'Bảo quản đông lạnh tại kho Plasma B1'),
(3,  2,  NULL, N'Khối hồng cầu', 250, '2026-01-10', '2026-02-14', N'Đã sử dụng', N'Đã truyền theo yêu cầu cấp máu số 2'),
(4,  3,  NULL, N'Khối hồng cầu', 200, '2026-02-15', '2026-03-22', N'Đã sử dụng', N'Đã truyền theo yêu cầu cấp máu số 3'),
(5,  3,  7,    N'Huyết tương tươi đông lạnh', 120, '2026-02-15', '2027-02-15', N'Đang lưu trữ', N'Bảo quản đông lạnh tại tủ đông D1'),
(6,  4,  NULL, N'Khối tiểu cầu', 50, '2026-03-20', '2026-03-25', N'Đã hủy', N'Tiêu hủy do đơn vị máu không đạt xét nghiệm'),
(7,  5,  NULL, N'Khối hồng cầu', 250, '2026-04-12', '2026-05-17', N'Đã sử dụng', N'Đã truyền theo yêu cầu cấp máu số 5'),
(8,  6,  NULL, N'Huyết tương tươi đông lạnh', 150, '2026-05-18', '2027-05-18', N'Đã hủy', N'Hủy theo đơn vị máu không đạt'),
(9,  8,  NULL, N'Khối hồng cầu', 250, '2026-07-11', '2026-08-15', N'Đã sử dụng', N'Đã truyền theo yêu cầu cấp máu số 6'),
(10, 9,  NULL, N'Khối tiểu cầu', 50, '2026-08-16', '2026-08-21', N'Đã sử dụng', N'Đã truyền theo yêu cầu cấp máu số 8'),
(11, 10, 3,    N'Huyết tương tươi đông lạnh', 180, '2026-09-05', '2027-09-05', N'Đang lưu trữ', N'Phân bổ cho yêu cầu số 7 đã hủy, chế phẩm vẫn trong kho'),
(12, 12, 12,   N'Tủa lạnh', 30, '2026-09-20', '2027-03-20', N'Đã cấp phát', N'Đã phân bổ cho yêu cầu số 10, chờ xuất kho'),
-- Chế phẩm dùng cho demo: hạn sử dụng tính theo ngày chạy script để luôn còn hạn khi demo
(13, 10, 1,    N'Khối hồng cầu', 200, '2026-09-05', DATEADD(DAY, 14, CAST(GETDATE() AS DATE)), N'Đang lưu trữ', N'Dữ liệu demo: hạn sử dụng tính theo GETDATE()');
GO

-- =====================================================================
-- 11. LichSuKho
-- =====================================================================

-- ---------------------------------------------------------------------
-- 11.1. Tạo bảng
CREATE TABLE LichSuKho (
    MaGiaoDich BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaChePham INT NOT NULL,
    MaViTriCu INT NULL,
    MaViTriMoi INT NULL,
    LoaiGiaoDich NVARCHAR(50) NOT NULL,
    SoLuongThayDoi INT NOT NULL,
    NgayGioGiaoDich DATETIME NOT NULL DEFAULT GETDATE(),
    NguoiThucHien NVARCHAR(100) NULL,
    TrangThai NVARCHAR(30) NOT NULL DEFAULT N'Đang xử lý',
    GhiChu NVARCHAR(500) NULL,
    CONSTRAINT CK_LichSuKho_LoaiGiaoDich CHECK (LoaiGiaoDich IN (N'Nhập kho', N'Xuất kho', N'Điều chuyển nội bộ', N'Kiểm kê', N'Tiêu hủy', N'Trả lại kho')),
    CONSTRAINT CK_LichSuKho_TrangThai CHECK (TrangThai IN (N'Đang xử lý', N'Hoàn tất', N'Đã hủy')),
    CONSTRAINT FK_LichSuKho_ChePhamMau FOREIGN KEY (MaChePham) REFERENCES ChePhamMau(MaChePham),
    CONSTRAINT FK_LichSuKho_ViTriCu FOREIGN KEY (MaViTriCu) REFERENCES ViTriLuuTru(MaViTri),
    CONSTRAINT FK_LichSuKho_ViTriMoi FOREIGN KEY (MaViTriMoi) REFERENCES ViTriLuuTru(MaViTri)
);
GO

-- ---------------------------------------------------------------------
-- 11.2. Thêm dữ liệu vào bảng
INSERT INTO LichSuKho (MaChePham, MaViTriCu, MaViTriMoi, LoaiGiaoDich, SoLuongThayDoi, NgayGioGiaoDich, NguoiThucHien, TrangThai, GhiChu)
VALUES
(1,  NULL, 1,    N'Nhập kho', 200, '2026-01-10 08:30:00', N'Nguyễn Văn An', N'Hoàn tất', N'Nhập khối hồng cầu từ đơn vị máu 1'),
(2,  NULL, 3,    N'Nhập kho', 120, '2026-01-10 08:45:00', N'Nguyễn Văn An', N'Hoàn tất', N'Nhập huyết tương tươi đông lạnh vào kho Plasma B1'),
(3,  NULL, 1,    N'Nhập kho', 250, '2026-01-10 09:00:00', N'Trần Thị Bình', N'Hoàn tất', N'Nhập khối hồng cầu từ đơn vị máu 2'),
(1,  1,    NULL, N'Xuất kho', 200, '2026-01-20 09:30:00', N'Lê Hoàng Cường', N'Hoàn tất', N'Xuất khối hồng cầu cho yêu cầu cấp máu số 1'),
(3,  1,    NULL, N'Xuất kho', 250, '2026-01-25 10:00:00', N'Lê Hoàng Cường', N'Hoàn tất', N'Xuất khối hồng cầu cho yêu cầu cấp máu số 2'),
(4,  NULL, 9,    N'Nhập kho', 200, '2026-02-15 09:15:00', N'Trần Thị Bình', N'Hoàn tất', N'Nhập khối hồng cầu từ đơn vị máu 3'),
(5,  NULL, 3,    N'Nhập kho', 120, '2026-02-15 09:20:00', N'Trần Thị Bình', N'Hoàn tất', N'Nhập huyết tương tươi đông lạnh từ đơn vị máu 3'),
(5,  3,    7,    N'Điều chuyển nội bộ', 120, '2026-02-20 09:20:00', N'Đặng Thu Hà', N'Hoàn tất', N'Điều chuyển huyết tương sang tủ đông D1'),
(4,  9,    NULL, N'Xuất kho', 200, '2026-02-25 10:30:00', N'Lê Hoàng Cường', N'Hoàn tất', N'Xuất khối hồng cầu cho yêu cầu cấp máu số 3'),
(6,  5,    NULL, N'Tiêu hủy', 50, '2026-03-21 07:30:00', N'Phạm Thị Dung', N'Hoàn tất', N'Tiêu hủy do đơn vị máu 4 không đạt xét nghiệm'),
(7,  NULL, 1,    N'Nhập kho', 250, '2026-04-12 10:00:00', N'Trần Thị Bình', N'Hoàn tất', N'Nhập khối hồng cầu nhóm O Rh(D) âm'),
(7,  1,    NULL, N'Xuất kho', 250, '2026-04-20 14:45:00', N'Trịnh Mỹ Linh', N'Hoàn tất', N'Xuất khối hồng cầu cho yêu cầu cấp máu số 5'),
(8,  7,    NULL, N'Tiêu hủy', 150, '2026-05-19 14:00:00', N'Võ Minh Đức', N'Hoàn tất', N'Tiêu hủy huyết tương theo đơn vị máu 6'),
(9,  9,    NULL, N'Xuất kho', 250, '2026-07-15 08:00:00', N'Trịnh Mỹ Linh', N'Hoàn tất', N'Xuất khối hồng cầu cho yêu cầu cấp máu số 6'),
(10, 5,    NULL, N'Xuất kho', 50, '2026-08-18 09:30:00', N'Nguyễn Thị Kim Oanh', N'Hoàn tất', N'Xuất khối tiểu cầu cho yêu cầu cấp máu số 8'),
(11, NULL, 3,    N'Nhập kho', 180, '2026-09-05 10:00:00', N'Nguyễn Văn An', N'Hoàn tất', N'Nhập huyết tương tươi đông lạnh từ đơn vị máu 10'),
(13, NULL, 1,    N'Nhập kho', 200, '2026-09-05 10:15:00', N'Nguyễn Văn An', N'Hoàn tất', N'Nhập khối hồng cầu từ đơn vị máu 10'),
(12, NULL, 12,   N'Nhập kho', 30, '2026-09-20 15:00:00', N'Ngô Thanh Lan', N'Hoàn tất', N'Nhập tủa lạnh từ đơn vị máu 12'),
(2,  3,    3,    N'Kiểm kê', 120, '2026-09-30 09:00:00', N'Ngô Thanh Lan', N'Hoàn tất', N'Kiểm kê định kỳ, số lượng khớp');
GO

-- =====================================================================
-- 12. BenhVien
-- =====================================================================

-- ---------------------------------------------------------------------
-- 12.1. Tạo bảng
CREATE TABLE BenhVien (
    MaBenhVien BIGINT NOT NULL,
    TenBenhVien NVARCHAR(200) NOT NULL,
    DiaChi NVARCHAR(300) NULL,
    SoDienThoai VARCHAR(15) NULL,
    CONSTRAINT PK_BenhVien PRIMARY KEY (MaBenhVien)
);
GO

-- ---------------------------------------------------------------------
-- 12.2. Thêm dữ liệu vào bảng
INSERT INTO BenhVien (MaBenhVien, TenBenhVien, DiaChi, SoDienThoai)
VALUES
(1, N'Bệnh viện Chợ Rẫy', N'201B Nguyễn Chí Thanh, Phường Chợ Lớn, TP.HCM', '02838554137'),
(2, N'Bệnh viện Đại học Y Dược TP.HCM', N'215 Hồng Bàng, Phường Chợ Lớn, TP.HCM', '02838554269'),
(3, N'Bệnh viện Thống Nhất', N'1 Lý Thường Kiệt, Phường Bảy Hiền, TP.HCM', '02838642142'),
(4, N'Bệnh viện Nhân dân 115', N'527 Sư Vạn Hạnh, Phường Hòa Hưng, TP.HCM', '02838652368'),
(5, N'Bệnh viện Nhân dân Gia Định', N'1 Nơ Trang Long, Phường Bình Thạnh, TP.HCM', '02838412692'),
(6, N'Bệnh viện Nhi Đồng 1', N'341 Sư Vạn Hạnh, Phường Hòa Hưng, TP.HCM', '02839271119'),
(7, N'Bệnh viện Nhi Đồng 2', N'14 Lý Tự Trọng, Phường Sài Gòn, TP.HCM', '02838295723'),
(8, N'Bệnh viện Trưng Vương', N'266 Lý Thường Kiệt, Phường Diên Hồng, TP.HCM', '02854484949'),
(9, N'Bệnh viện Từ Dũ', N'284 Cống Quỳnh, Phường Bến Thành, TP.HCM', '02854042829'),
(10, N'Bệnh viện Hùng Vương', N'128 Hồng Bàng, Phường Chợ Lớn, TP.HCM', '02838558532'),
(11, N'Bệnh viện Bình Dân', N'371 Điện Biên Phủ, Phường Bàn Cờ, TP.HCM', '02838394747'),
(12, N'Bệnh viện Nguyễn Tri Phương', N'468 Nguyễn Trãi, Phường An Đông, TP.HCM', '02839234332');
GO

-- =====================================================================
-- 13. Khoa
-- =====================================================================

-- ---------------------------------------------------------------------
-- 13.1. Tạo bảng
CREATE TABLE Khoa (
    MaKhoa BIGINT NOT NULL,
    MaBenhVien BIGINT NOT NULL,
    TenKhoa NVARCHAR(150) NOT NULL,
    CONSTRAINT PK_Khoa PRIMARY KEY (MaKhoa),
    CONSTRAINT FK_Khoa_BenhVien FOREIGN KEY (MaBenhVien) REFERENCES BenhVien(MaBenhVien)
);
GO

-- ---------------------------------------------------------------------
-- 13.2. Thêm dữ liệu vào bảng
INSERT INTO Khoa (MaKhoa, MaBenhVien, TenKhoa)
VALUES
(1, 1, N'Khoa Huyết học'),
(2, 1, N'Khoa Cấp cứu'),
(3, 1, N'Khoa Ngoại tổng quát'),
(4, 1, N'Khoa Hồi sức tích cực'),
(5, 2, N'Khoa Nội tổng hợp'),
(6, 2, N'Khoa Ngoại'),
(7, 2, N'Khoa Cấp cứu'),
(8, 3, N'Khoa Huyết học'),
(9, 3, N'Khoa Hồi sức tích cực'),
(10, 4, N'Khoa Cấp cứu'),
(11, 5, N'Khoa Cấp cứu'),
(12, 6, N'Khoa Huyết học');
GO

-- =====================================================================
-- 14. BenhNhan
-- =====================================================================

-- ---------------------------------------------------------------------
-- 14.1. Tạo bảng
CREATE TABLE BenhNhan (
    MaBenhNhan BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaKhoa BIGINT NOT NULL,
    MaNhomMau BIGINT NOT NULL,
    HoTen NVARCHAR(100) NOT NULL,
    NgaySinh DATE NOT NULL,
    GioiTinh NVARCHAR(10) NOT NULL,
    ChanDoanBinhLy NVARCHAR(500),
    CONSTRAINT FK_BenhNhan_NhomMau FOREIGN KEY (MaNhomMau) REFERENCES NhomMau(MaNhomMau),
    CONSTRAINT FK_BenhNhan_Khoa FOREIGN KEY (MaKhoa) REFERENCES Khoa(MaKhoa),
    CONSTRAINT CK_BenhNhan_GioiTinh CHECK (GioiTinh IN (N'Nam', N'Nữ'))
);
GO

-- ---------------------------------------------------------------------
-- 14.2. Thêm dữ liệu vào bảng
INSERT INTO BenhNhan (MaKhoa, MaNhomMau, HoTen, NgaySinh, GioiTinh, ChanDoanBinhLy)
VALUES
(1, 1, N'Nguyễn Văn Siêu', '2000-01-15', N'Nam', N'Thiếu máu do thiếu sắt'),
(2, 2, N'Hoàng Nguyễn Anh Cường', '2000-02-22', N'Nữ', N'Mất máu sau phẫu thuật'),
(3, 4, N'Nguyễn Ngọc Hạnh', '2000-03-10', N'Nam', N'Xuất huyết tiêu hóa'),
(1, 3, N'Nguyễn Gia Huy', '2000-04-18', N'Nữ', N'Thiếu máu cấp'),
(4, 1, N'Võ Cao Thuỳ Huyên', '2000-02-07', N'Nữ', N'Mất máu sau sinh'),
(3, 4, N'Đặng Thị Cẩm Nhi', '2000-06-05', N'Nam', N'Thiếu máu mạn tính'),
(2, 2, N'Lý Minh Phước', '2000-07-12', N'Nữ', N'Xuất huyết sau phẫu thuật'),
(1, 1, N'Phan Nhân Tâm', '2000-08-25', N'Nam', N'Thiếu máu thiếu sắt'),
(4, 3, N'Trần Minh Quân', '2000-09-14', N'Nam', N'Thiếu máu do thiếu sắt'),
(2, 4, N'Nguyễn Thị Mai Anh', '2000-10-03', N'Nữ', N'Mất máu sau phẫu thuật'),
(3, 1, N'Lê Hoàng Nam', '2000-11-20', N'Nam', N'Xuất huyết tiêu hóa'),
(1, 2, N'Phạm Thùy Linh', '2000-12-08', N'Nữ', N'Thiếu máu cấp');
GO

-- =====================================================================
-- 15. YeuCauCapMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 15.1. Tạo bảng
CREATE TABLE YeuCauCapMau (
    MaYeuCau INT PRIMARY KEY,
    MaBenhNhan BIGINT NOT NULL,
    MaKhoa BIGINT NOT NULL,
    MaNhomMauYeuCau BIGINT NOT NULL,
    NgayYeuCau DATETIME2 NOT NULL,
    LoaiChePhamYeuCau NVARCHAR(100) NOT NULL,
    SoLuongYeuCau INT NOT NULL,
    MucDoUuTien NVARCHAR(30) NOT NULL,
    TrangThai NVARCHAR(30) NOT NULL,
    BacSiChiDinh NVARCHAR(100) NULL,
    CONSTRAINT CK_YeuCauCapMau_SoLuong CHECK (SoLuongYeuCau > 0),
    CONSTRAINT CK_YeuCauCapMau_MucDoUuTien CHECK (MucDoUuTien IN (N'Cấp cứu', N'Bình thường')),
    CONSTRAINT CK_YeuCauCapMau_LoaiChePham CHECK (LoaiChePhamYeuCau IN (N'Khối hồng cầu', N'Huyết tương tươi đông lạnh', N'Khối tiểu cầu', N'Tủa lạnh')),
    CONSTRAINT CK_YeuCauCapMau_TrangThai CHECK (TrangThai IN (N'Chờ xử lý', N'Đã duyệt', N'Đã phân bổ', N'Hoàn tất', N'Từ chối')),
    CONSTRAINT FK_YeuCauCapMau_BenhNhan FOREIGN KEY (MaBenhNhan) REFERENCES BenhNhan(MaBenhNhan),
    CONSTRAINT FK_YeuCauCapMau_Khoa FOREIGN KEY (MaKhoa) REFERENCES Khoa(MaKhoa),
    CONSTRAINT FK_YeuCauCapMau_NhomMau FOREIGN KEY (MaNhomMauYeuCau) REFERENCES NhomMau(MaNhomMau)
);
GO

-- ---------------------------------------------------------------------
-- 15.2. Thêm dữ liệu vào bảng
INSERT INTO YeuCauCapMau (MaYeuCau, MaBenhNhan, MaKhoa, MaNhomMauYeuCau, NgayYeuCau, LoaiChePhamYeuCau, SoLuongYeuCau, MucDoUuTien, TrangThai, BacSiChiDinh)
VALUES
(1, 1, 1, 1, '2026-01-20 08:30:00', N'Khối hồng cầu', 200, N'Bình thường', N'Hoàn tất', N'BS. Nguyễn Văn A'),
(2, 2, 2, 2, '2026-01-25 09:15:00', N'Khối hồng cầu', 250, N'Cấp cứu', N'Hoàn tất', N'BS. Trần Thị B'),
(3, 3, 3, 4, '2026-02-25 10:00:00', N'Khối hồng cầu', 200, N'Cấp cứu', N'Hoàn tất', N'BS. Lê Hoàng C'),
(4, 4, 1, 3, '2026-09-12 11:45:00', N'Huyết tương tươi đông lạnh', 120, N'Bình thường', N'Chờ xử lý', N'BS. Phạm Minh D'),
(5, 5, 4, 1, '2026-04-20 14:20:00', N'Khối hồng cầu', 250, N'Cấp cứu', N'Hoàn tất', N'BS. Hoàng Văn E'),
(6, 6, 3, 4, '2026-07-15 07:10:00', N'Khối hồng cầu', 250, N'Bình thường', N'Hoàn tất', N'BS. Đặng Thu F'),
(7, 7, 2, 2, '2026-09-10 15:00:00', N'Huyết tương tươi đông lạnh', 180, N'Bình thường', N'Đã duyệt', N'BS. Bùi Quang G'),
(8, 8, 1, 1, '2026-08-18 08:30:00', N'Khối tiểu cầu', 50, N'Cấp cứu', N'Hoàn tất', N'BS. Ngô Thanh H'),
(9, 9, 4, 3, '2026-09-15 08:00:00', N'Khối tiểu cầu', 50, N'Bình thường', N'Từ chối', N'BS. Trịnh Mỹ I'),
(10, 10, 2, 4, '2026-09-22 09:30:00', N'Tủa lạnh', 30, N'Cấp cứu', N'Đã phân bổ', N'BS. Võ Minh K'),
(11, 11, 3, 1, '2026-09-25 10:00:00', N'Huyết tương tươi đông lạnh', 120, N'Bình thường', N'Đã duyệt', N'BS. Lê Văn M'),
(12, 12, 1, 2, '2026-09-28 11:15:00', N'Khối hồng cầu', 200, N'Cấp cứu', N'Đã duyệt', N'BS. Trần Văn N');
GO

-- =====================================================================
-- 16. QuyTacTuongThich
-- =====================================================================

-- ---------------------------------------------------------------------
-- 16.1. Tạo bảng
CREATE TABLE QuyTacTuongThich (
    MaQuyTac INT PRIMARY KEY,
    MaNhomMauCho BIGINT NOT NULL,
    MaNhomMauNhan BIGINT NOT NULL,
    LoaiChePham NVARCHAR(50) NOT NULL,
    TuongThich BIT NOT NULL,
    CONSTRAINT CK_QuyTac_LoaiChePham CHECK (LoaiChePham IN (N'Khối hồng cầu', N'Huyết tương tươi đông lạnh', N'Khối tiểu cầu', N'Tủa lạnh')),
    CONSTRAINT FK_QuyTac_NhomMauCho FOREIGN KEY (MaNhomMauCho) REFERENCES NhomMau(MaNhomMau),
    CONSTRAINT FK_QuyTac_NhomMauNhan FOREIGN KEY (MaNhomMauNhan) REFERENCES NhomMau(MaNhomMau)
);
GO

-- ---------------------------------------------------------------------
-- 16.2. Thêm dữ liệu vào bảng
-- Quy tắc tương thích được sinh tự động cho 8 nhóm máu cho × 8 nhóm máu nhận × 4 loại chế phẩm (256 quy tắc),
-- căn cứ Điều 44 Thông tư 26/2013/TT-BYT của Bộ Y tế về lựa chọn đơn vị máu hòa hợp miễn dịch:
--   + Khối hồng cầu (Khoản 1): O nhận O; A nhận A hoặc O; B nhận B hoặc O; AB nhận AB, A, B hoặc O.
--   + Huyết tương tươi đông lạnh (Khoản 2): O nhận O, A, B hoặc AB; A nhận A hoặc AB; B nhận B hoặc AB; AB nhận AB.
--   + Tủa lạnh (Khoản 3): được truyền không hòa hợp ABO, liều không quá 10 ml/kg trong 12 giờ.
--   + Khối tiểu cầu còn huyết tương nguyên thủy (Khoản 4): truyền cùng nhóm ABO.
--   + Rh(D) (Khoản 5, áp dụng cho khối hồng cầu và khối tiểu cầu): D(-) chỉ nhận D(-); D(+) nhận D(+) hoặc D(-).
INSERT INTO QuyTacTuongThich (MaQuyTac, MaNhomMauCho, MaNhomMauNhan, LoaiChePham, TuongThich)
SELECT
    ROW_NUMBER() OVER (ORDER BY L.ThuTu, Nhan.MaNhomMau, Cho.MaNhomMau) AS MaQuyTac,
    Cho.MaNhomMau AS MaNhomMauCho,
    Nhan.MaNhomMau AS MaNhomMauNhan,
    L.LoaiChePham,
    CASE
        -- Tủa lạnh: không bắt buộc hòa hợp ABO
        WHEN L.LoaiChePham = N'Tủa lạnh' THEN 1
        -- Rh(D): người nhận D(-) không nhận hồng cầu, tiểu cầu D(+)
        WHEN L.LoaiChePham IN (N'Khối hồng cầu', N'Khối tiểu cầu')
             AND RIGHT(Nhan.TenNhomMau, 1) = '-' AND RIGHT(Cho.TenNhomMau, 1) = '+' THEN 0
        -- Khối hồng cầu: O cho được tất cả, AB nhận được tất cả, hoặc cùng nhóm
        WHEN L.LoaiChePham = N'Khối hồng cầu'
             AND (AboCho.ABO = 'O' OR AboNhan.ABO = 'AB' OR AboCho.ABO = AboNhan.ABO) THEN 1
        -- Huyết tương: AB cho được tất cả, O nhận được tất cả, hoặc cùng nhóm
        WHEN L.LoaiChePham = N'Huyết tương tươi đông lạnh'
             AND (AboCho.ABO = 'AB' OR AboNhan.ABO = 'O' OR AboCho.ABO = AboNhan.ABO) THEN 1
        -- Khối tiểu cầu: cùng nhóm ABO
        WHEN L.LoaiChePham = N'Khối tiểu cầu' AND AboCho.ABO = AboNhan.ABO THEN 1
        ELSE 0
    END AS TuongThich
FROM NhomMau Cho
CROSS JOIN NhomMau Nhan
CROSS APPLY (SELECT LEFT(Cho.TenNhomMau, LEN(Cho.TenNhomMau) - 1)) AS AboCho(ABO)
CROSS APPLY (SELECT LEFT(Nhan.TenNhomMau, LEN(Nhan.TenNhomMau) - 1)) AS AboNhan(ABO)
CROSS JOIN (VALUES (1, N'Khối hồng cầu'), (2, N'Huyết tương tươi đông lạnh'),
                   (3, N'Khối tiểu cầu'), (4, N'Tủa lạnh')) AS L(ThuTu, LoaiChePham);

-- Kiểm tra: 256 quy tắc, mỗi loại chế phẩm 64 quy tắc
SELECT LoaiChePham, COUNT(*) AS SoQuyTac, SUM(CAST(TuongThich AS INT)) AS SoCapTuongThich
FROM QuyTacTuongThich
GROUP BY LoaiChePham;
GO

-- =====================================================================
-- 17. PhanBoMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 17.1. Tạo bảng
CREATE TABLE PhanBoMau (
    MaPhanBo INT IDENTITY(1,1) PRIMARY KEY,
    MaYeuCau INT NOT NULL,
    MaChePham INT NOT NULL,
    ThoiGianPhanBo DATETIME NOT NULL DEFAULT GETDATE(),
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'Đã phân bổ',
    GhiChu NVARCHAR(255) NULL,
    LyDoHuy NVARCHAR(255) NULL,
    NgayGioHuy DATETIME NULL,

    CONSTRAINT FK_PhanBoMau_YeuCau FOREIGN KEY (MaYeuCau) REFERENCES YeuCauCapMau(MaYeuCau),
    CONSTRAINT FK_PhanBoMau_ChePham FOREIGN KEY (MaChePham) REFERENCES ChePhamMau(MaChePham),
    CONSTRAINT CK_PhanBoMau_TrangThai CHECK (TrangThai IN (
        N'Đã phân bổ', N'Đã xuất', N'Đã hủy'
    ))
);
GO

-- ---------------------------------------------------------------------
-- 17.2. Thêm dữ liệu vào bảng
INSERT INTO PhanBoMau (MaYeuCau, MaChePham, ThoiGianPhanBo, TrangThai, GhiChu, LyDoHuy, NgayGioHuy)
VALUES
(1,  1,  '2026-01-20 09:00:00', N'Đã xuất',    N'Đã xuất chế phẩm đến khoa điều trị', NULL, NULL),
(2,  3,  '2026-01-25 09:45:00', N'Đã xuất',    N'Đã xuất chế phẩm đến khoa điều trị', NULL, NULL),
(3,  4,  '2026-02-25 10:15:00', N'Đã xuất',    N'Đã bàn giao chế phẩm', NULL, NULL),
(5,  7,  '2026-04-20 14:30:00', N'Đã xuất',    N'Cấp cứu, xuất khối hồng cầu O Rh(D) âm', NULL, NULL),
(6,  9,  '2026-07-15 07:40:00', N'Đã xuất',    N'Đã xuất chế phẩm theo yêu cầu', NULL, NULL),
(8,  10, '2026-08-18 09:00:00', N'Đã xuất',    N'Đã bàn giao cho nhân viên y tế', NULL, NULL),
(7,  11, '2026-09-10 15:30:00', N'Đã hủy',     N'Hủy phân bổ chế phẩm', N'Bác sĩ tạm hoãn chỉ định truyền máu', '2026-09-10 17:00:00'),
(10, 12, '2026-09-22 10:00:00', N'Đã phân bổ', N'Chờ xuất kho', NULL, NULL);

GO

-- =====================================================================
-- 18. TruyenMau
-- =====================================================================

-- ---------------------------------------------------------------------
-- 18.1. Tạo bảng
CREATE TABLE TruyenMau (
    MaTruyenMau VARCHAR(20) NOT NULL,
    MaPhanBo INT NOT NULL,
    NgayGioBatDau DATETIME NOT NULL,
    NgayGioKetThuc DATETIME NULL,
    NguoiThucHien NVARCHAR(100) NOT NULL,
    TheTichTruyen INT NULL,
    PhanUngPhu NVARCHAR(500) NULL,
    TrangThai NVARCHAR(100) NOT NULL,

    CONSTRAINT PK_TruyenMau PRIMARY KEY (MaTruyenMau),
    CONSTRAINT FK_TruyenMau_PhanBoMau FOREIGN KEY (MaPhanBo) REFERENCES PhanBoMau(MaPhanBo)
);
GO

-- ---------------------------------------------------------------------
-- 18.2. Thêm dữ liệu vào bảng
INSERT INTO TruyenMau (MaTruyenMau, MaPhanBo, NgayGioBatDau, NgayGioKetThuc, NguoiThucHien, TheTichTruyen, PhanUngPhu, TrangThai)
VALUES
('TM001', 1, '2026-01-20 10:00:00', '2026-01-20 12:00:00', N'Nguyễn Văn An', 200, NULL, N'Hoàn thành'),
('TM002', 2, '2026-01-25 11:00:00', '2026-01-25 13:30:00', N'Trần Thị Bình', 250, N'Không có', N'Hoàn thành'),
('TM003', 3, '2026-02-25 14:00:00', '2026-02-25 16:00:00', N'Phạm Thị Dung', 200, N'Đau nhẹ tại vị trí truyền', N'Hoàn thành'),
('TM004', 4, '2026-04-20 15:30:00', '2026-04-20 17:30:00', N'Hoàng Văn Em', 250, NULL, N'Hoàn thành'),
('TM005', 5, '2026-07-15 09:00:00', '2026-07-15 11:00:00', N'Nguyễn Thị Hoa', 250, N'Sốt nhẹ, rét run', N'Hoàn thành'),
('TM006', 6, '2026-08-18 10:30:00', '2026-08-18 11:30:00', N'Bùi Văn Nam', 50, N'Không có', N'Hoàn thành');
GO

-- =====================================================================
-- CHƯƠNG 4: QUẢN LÝ THÔNG TIN
-- =====================================================================

-- =====================================================================
-- 1. Xử lý thông tin
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1.1. Stored Procedure Phước Lý + Văn Siêu xong

-- ---------------------------------------------------------------------
-- 1.1.1. Nhập chế phẩm vào kho và cập nhật tồn kho (sp_NhapKhoChePham)
-- Mục đích: Đưa các chế phẩm máu đã hoàn thành xử lý/tách chiết vào đúng vị trí tủ/khay trong kho và đồng bộ số lượng tồn kho.
-- Tham số: @MaChePham, @MaViTri, @NguoiThucHien, @GhiChu.
-- Nghiệp vụ và ràng buộc:
-- Kiểm tra sức chứa của vị trí lưu trữ (LuongHienTai < SucChua - Ràng buộc 3.2). Nếu đầy thì báo lỗi và dừng thực thi.
-- Cập nhật vị trí và trạng thái của chế phẩm thành "Trong kho".
-- Đồng thời tự động tăng LuongHienTai ở bảng ViTriLuuTru, tăng LuongMauHienTai ở bảng NganHangMau, và thêm 1 dòng nhật ký vào LichSuKho với loại giao dịch "Nhập kho" (Ràng buộc 3.4).
-- Bảng ảnh hưởng: ChePhamMau, ViTriLuuTru, NganHangMau, LichSuKho.
-- Câu lệnh:
CREATE OR ALTER PROCEDURE sp_NhapKhoChePham
    @MaChePham INT,
    @MaViTri INT,
    @NguoiThucHien NVARCHAR(100),
    @GhiChu NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- 1. Kiểm tra sức chứa vị trí kho (Ràng buộc 3.2)
        DECLARE @SucChua INT, @LuongHienTai INT, @MaNganHang INT;
        SELECT @SucChua = SucChua, @LuongHienTai = LuongHienTai,
               @MaNganHang = MaNganHangMau
        FROM ViTriLuuTru
        WHERE MaViTri = @MaViTri;

        IF @SucChua IS NULL
        BEGIN
            RAISERROR(N'Vị trí lưu trữ không tồn tại!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @LuongHienTai + 1 > @SucChua
        BEGIN
            RAISERROR(N'Vị trí lưu trữ đã đầy!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- 2. Cập nhật vị trí và trạng thái cho Chế phẩm
        --    (dùng đúng giá trị enum của CK_CPM_TrangThai)
        UPDATE ChePhamMau
        SET MaViTri = @MaViTri, TrangThai = N'Đang lưu trữ'
        WHERE MaChePham = @MaChePham;

        -- 3. Tăng tồn kho Vị trí và Ngân hàng máu
        UPDATE ViTriLuuTru SET LuongHienTai = LuongHienTai + 1
        WHERE MaViTri = @MaViTri;

        UPDATE NganHangMau SET LuongMauHienTai = LuongMauHienTai + 1
        WHERE MaNganHangMau = @MaNganHang;

        -- 4. Ghi log lịch sử kho
        INSERT INTO LichSuKho (MaChePham, MaViTriCu, MaViTriMoi, LoaiGiaoDich,
                                SoLuongThayDoi, NgayGioGiaoDich, NguoiThucHien,
                                TrangThai, GhiChu)
        VALUES (@MaChePham, NULL, @MaViTri, N'Nhập kho', 1, GETDATE(),
                @NguoiThucHien, N'Hoàn tất', @GhiChu);

        COMMIT TRANSACTION;
        PRINT N'Nhập kho thành công!';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ---------------------------------------------------------------------
-- 1.1.2. Tự động tương thích và phân bổ máu (sp_PhanBoMauChoYeuCau)
-- Mục đích: Tự động tìm kiếm và giữ trước (phân bổ) túi máu/chế phẩm máu phù hợp nhất cho một phiếu yêu cầu cấp máu của bệnh nhân.
-- Tham số: @MaYeuCau.
-- Nghiệp vụ và ràng buộc:
-- Đối chiếu bảng QuyTacTuongThich để lọc các đơn vị máu tương thích về nhóm máu và loại chế phẩm yêu cầu.
-- Chọn chế phẩm còn hạn dùng trong kho theo nguyên tắc FIFO (ưu tiên lấy túi máu có hạn sử dụng gần nhất trước).
-- Tạo bản ghi mới trong bảng PhanBoMau, đồng thời cập nhật trạng thái của YeuCauCapMau và ChePhamMau thành "Đã phân bổ".

-- Bảng ảnh hưởng: YeuCauCapMau, QuyTacTuongThich, DonViMau, ChePhamMau, PhanBoMau.
-- Câu lệnh:
CREATE OR ALTER PROCEDURE sp_PhanBoMauChoYeuCau
    @MaYeuCau INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MaNhomMauYeuCau BIGINT, @LoaiChePham NVARCHAR(100);
    SELECT @MaNhomMauYeuCau = MaNhomMauYeuCau, @LoaiChePham = LoaiChePhamYeuCau
    FROM YeuCauCapMau
    WHERE MaYeuCau = @MaYeuCau AND TrangThai = N'Đã duyệt';

    IF @MaNhomMauYeuCau IS NULL
    BEGIN
        RAISERROR(N'Yêu cầu không tồn tại hoặc chưa được duyệt!', 16, 1);
        RETURN;
    END

    -- Tìm chế phẩm phù hợp: tương thích nhóm máu + đúng loại chế phẩm
    -- + còn hạn dùng + đang trong kho, ưu tiên FIFO theo hạn dùng gần nhất
    DECLARE @MaChePhamPhuHop INT;

    SELECT TOP 1 @MaChePhamPhuHop = CP.MaChePham
    FROM ChePhamMau CP
    JOIN DonViMau DVM ON CP.MaDonViMau = DVM.MaDonViMau
    JOIN QuyTacTuongThich QT ON DVM.MaNhomMau = QT.MaNhomMauCho
    WHERE QT.MaNhomMauNhan = @MaNhomMauYeuCau
      AND QT.LoaiChePham = @LoaiChePham
      AND QT.TuongThich = 1
      AND CP.LoaiChePham = @LoaiChePham
      AND CP.TrangThai = N'Đang lưu trữ'
      AND CP.HanSuDung > GETDATE()
    ORDER BY CP.HanSuDung ASC; -- FIFO: hạn dùng gần hơn xuất trước

    IF @MaChePhamPhuHop IS NULL
    BEGIN
        RAISERROR(N'Không tìm thấy chế phẩm phù hợp/tương thích trong kho!', 16, 1);
        RETURN;
    END

    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO PhanBoMau (MaYeuCau, MaChePham, ThoiGianPhanBo, TrangThai)
        VALUES (@MaYeuCau, @MaChePhamPhuHop, GETDATE(), N'Đã phân bổ');

        UPDATE ChePhamMau SET TrangThai = N'Đã cấp phát'
        WHERE MaChePham = @MaChePhamPhuHop;

        UPDATE YeuCauCapMau SET TrangThai = N'Đã phân bổ'
        WHERE MaYeuCau = @MaYeuCau;

        COMMIT TRANSACTION;
        PRINT N'Đã phân bổ thành công chế phẩm cho yêu cầu!';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ---------------------------------------------------------------------
-- 1.1.3. Ghi nhận truyền máu (sp_GhiNhanTruyenMau)
-- Mục đích: Đánh dấu hoàn tất quá trình truyền máu trên lâm sàng cho bệnh nhân và tự động xuất khỏi hệ thống quản lý kho.
-- Tham số: @MaTruyenMau, @MaPhanBo, @NgayGioBatDau, @NgayGioKetThuc, @NguoiThucHien, @TheTichTruyen, @PhanUngPhu, @TrangThai.
-- Nghiệp vụ và ràng buộc:
-- Kiểm tra ràng buộc thời gian kết thúc phải lớn hơn thời gian bắt đầu (NgayGioKetThuc > NgayGioBatDau - Ràng buộc 3.2).
-- Ghi nhật ký vào bảng TruyenMau.
-- Cập nhật trạng thái chế phẩm sang "Đã truyền".
-- Tự động giảm số lượng tồn kho tương ứng ở ViTriLuuTru và NganHangMau, đồng thời ghi lịch sử "Xuất kho" vào bảng LichSuKho.
-- Bảng ảnh hưởng: TruyenMau, PhanBoMau, ChePhamMau, ViTriLuuTru, NganHangMau, LichSuKho.
-- Câu lệnh:

CREATE OR ALTER PROCEDURE sp_GhiNhanTruyenMau
    @MaTruyenMau VARCHAR(20),
    @MaPhanBo INT,
    @NgayGioBatDau DATETIME,
    @NgayGioKetThuc DATETIME = NULL,
    @NguoiThucHien NVARCHAR(100),
    @TheTichTruyen INT = NULL,
    @PhanUngPhu NVARCHAR(500) = NULL,
    @TrangThai NVARCHAR(100) -- 'Hoàn thành','Đang thực hiện','Dừng do sốc phản vệ','Đã hủy'
AS
BEGIN
    SET NOCOUNT ON;

    -- Chỉ kiểm tra ràng buộc thời gian khi đã có giờ kết thúc
    IF @NgayGioKetThuc IS NOT NULL AND @NgayGioKetThuc <= @NgayGioBatDau
    BEGIN
        RAISERROR(N'Thời gian kết thúc phải lớn hơn thời gian bắt đầu!', 16, 1);
        RETURN;
    END

    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Thêm bản ghi truyền máu
        INSERT INTO TruyenMau (MaTruyenMau, MaPhanBo, NgayGioBatDau, NgayGioKetThuc,
                                NguoiThucHien, TheTichTruyen, PhanUngPhu, TrangThai)
        VALUES (@MaTruyenMau, @MaPhanBo, @NgayGioBatDau, @NgayGioKetThuc,
                @NguoiThucHien, @TheTichTruyen, @PhanUngPhu, @TrangThai);

        -- 2. Chỉ cập nhật kho khi ca truyền máu đã HOÀN THÀNH thực sự
        IF @TrangThai = N'Hoàn thành'
        BEGIN
            DECLARE @MaChePham INT, @MaViTri INT, @MaNganHang INT;

            SELECT @MaChePham = MaChePham FROM PhanBoMau WHERE MaPhanBo = @MaPhanBo;
            SELECT @MaViTri = MaViTri FROM ChePhamMau WHERE MaChePham = @MaChePham;
            SELECT @MaNganHang = MaNganHangMau FROM ViTriLuuTru WHERE MaViTri = @MaViTri;

            -- Cập nhật trạng thái chế phẩm (đúng CHECK: 'Đã sử dụng')
            UPDATE ChePhamMau
            SET TrangThai = N'Đã sử dụng', MaViTri = NULL
            WHERE MaChePham = @MaChePham;

            -- Hoàn tất yêu cầu cấp máu tương ứng
            UPDATE YeuCauCapMau SET TrangThai = N'Hoàn tất'
            WHERE MaYeuCau = (SELECT MaYeuCau FROM PhanBoMau WHERE MaPhanBo = @MaPhanBo);

            IF @MaViTri IS NOT NULL
            BEGIN
                UPDATE ViTriLuuTru SET LuongHienTai = LuongHienTai - 1
                WHERE MaViTri = @MaViTri;

                UPDATE NganHangMau SET LuongMauHienTai = LuongMauHienTai - 1
                WHERE MaNganHangMau = @MaNganHang;

                INSERT INTO LichSuKho (MaChePham, MaViTriCu, MaViTriMoi, LoaiGiaoDich,
                                        SoLuongThayDoi, NgayGioGiaoDich, NguoiThucHien,
                                        TrangThai)
                VALUES (@MaChePham, @MaViTri, NULL, N'Xuất kho', 1, GETDATE(),
                        @NguoiThucHien, N'Hoàn tất');
            END
        END

        COMMIT TRANSACTION;
        PRINT N'Ghi nhận quá trình truyền máu thành công!';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ---------------------------------------------------------------------
-- 1.1.4. Cập nhật kết quả xét nghiệm và đánh giá túi máu (sp_CapNhatKetQuaXetNghiem)
-- Mục đích: Ghi nhận thông tin xét nghiệm sàng lọc cho đơn vị máu và tự động cập nhật phân loại chất lượng của đơn vị máu đó.
-- Tham số: @MaDonViMau, @MaLoaiXN, @NgayXetNghiem, @ThoiGianTraKQ, @NguoiThucHien, @GiaTriDo, @KetQua, @KetLuan.
-- Nghiệp vụ và ràng buộc:
-- Kiểm tra thời gian trả kết quả phải sau ngày xét nghiệm (ThoiGianTraKQ >= NgayXetNghiem - Ràng buộc 3.2).
-- Nếu tất cả các xét nghiệm bắt buộc (BatBuoc = 1) đều "Âm tính" và kết luận "Đạt", tự động cập nhật trạng thái DonViMau thành "Đạt chuẩn"
-- (chỉ áp dụng cho đơn vị đang "Chờ xét nghiệm", không ghi đè trạng thái "Đã tách chế phẩm").
-- Nếu có bất kỳ xét nghiệm nào "Dương tính" hoặc kết luận "Không đạt", lập tức đổi trạng thái DonViMau thành "Không đạt".
-- Thu hồi khi kết quả không đạt về muộn (ví dụ NAT trả kết quả sau 24 giờ, đơn vị đã được tách chế phẩm):
--   + Hủy các phân bổ chưa truyền của chế phẩm thuộc đơn vị này; yêu cầu không còn phân bổ hiệu lực trở về "Đã duyệt".
--   + Chế phẩm còn trong kho hoặc đã cấp phát chuyển sang "Đã hủy", trừ tồn kho vị trí và ngân hàng máu, ghi LichSuKho "Tiêu hủy".
--   + Đếm số chế phẩm đã truyền cho bệnh nhân (không thể thu hồi) để báo cáo sự cố.
-- Kết quả trả về: 1 dòng (SoChePhamThuHoi, SoPhanBoHuy, SoChePhamDaTruyen).
-- Bảng ảnh hưởng: KetQuaXetNghiem, DonViMau, LoaiXetNghiem, ChePhamMau, PhanBoMau, YeuCauCapMau, ViTriLuuTru, NganHangMau, LichSuKho.
-- Câu lệnh:

CREATE OR ALTER PROCEDURE sp_CapNhatKetQuaXetNghiem
    @MaDonViMau VARCHAR(50),
    @MaLoaiXN INT,
    @NgayXetNghiem DATETIME,
    @ThoiGianTraKQ DATETIME,
    @NguoiThucHien NVARCHAR(100),
    @GiaTriDo DECIMAL(10,2) = NULL,
    @KetQua NVARCHAR(30),   -- 'Âm tính' / 'Dương tính' / 'Không xác định'
    @KetLuan NVARCHAR(10)   -- 'Đạt' / 'Không đạt'
AS
BEGIN
    SET NOCOUNT ON;

    -- Ràng buộc 3.2: ThoiGianTraKQ >= NgayXetNghiem
    IF @ThoiGianTraKQ < @NgayXetNghiem
    BEGIN
        RAISERROR(N'Thời gian trả kết quả phải sau ngày xét nghiệm!', 16, 1);
        RETURN;
    END

    DECLARE @SoChePhamThuHoi INT = 0, @SoPhanBoHuy INT = 0, @SoChePhamDaTruyen INT = 0;
    DECLARE @PhanBoHuy TABLE (MaPhanBo INT, MaYeuCau INT);
    DECLARE @ChePhamHuy TABLE (MaChePham INT, MaViTri INT);

    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Thêm kết quả xét nghiệm
        INSERT INTO KetQuaXetNghiem (MaDonViMau, MaLoaiXN, NgayXetNghiem,
                                      ThoiGianTraKQ, NguoiThucHien, GiaTriDo,
                                      KetQua, KetLuan)
        VALUES (@MaDonViMau, @MaLoaiXN, @NgayXetNghiem, @ThoiGianTraKQ,
                @NguoiThucHien, @GiaTriDo, @KetQua, @KetLuan);

        -- 2. Đánh giá lại trạng thái DonViMau
        IF EXISTS (
            SELECT 1 FROM KetQuaXetNghiem
            WHERE MaDonViMau = @MaDonViMau
              AND (KetQua = N'Dương tính' OR KetLuan = N'Không đạt')
        )
        BEGIN
            UPDATE DonViMau SET TrangThai = N'Không đạt'
            WHERE MaDonViMau = @MaDonViMau;

            -- 3. Thu hồi chế phẩm đã tách từ đơn vị không đạt
            -- 3.1. Hủy phân bổ chưa truyền
            UPDATE PB
            SET TrangThai = N'Đã hủy',
                LyDoHuy = N'Đơn vị máu không đạt xét nghiệm',
                NgayGioHuy = GETDATE()
            OUTPUT inserted.MaPhanBo, inserted.MaYeuCau INTO @PhanBoHuy
            FROM PhanBoMau PB
            JOIN ChePhamMau CP ON CP.MaChePham = PB.MaChePham
            WHERE CP.MaDonViMau = @MaDonViMau
              AND PB.TrangThai IN (N'Đã phân bổ', N'Đã xuất')
              AND NOT EXISTS (SELECT 1 FROM TruyenMau TM WHERE TM.MaPhanBo = PB.MaPhanBo);

            SELECT @SoPhanBoHuy = COUNT(*) FROM @PhanBoHuy;

            -- 3.2. Yêu cầu không còn phân bổ hiệu lực trở về "Đã duyệt" để phân bổ lại
            UPDATE YC SET TrangThai = N'Đã duyệt'
            FROM YeuCauCapMau YC
            WHERE YC.MaYeuCau IN (SELECT MaYeuCau FROM @PhanBoHuy)
              AND YC.TrangThai = N'Đã phân bổ'
              AND NOT EXISTS (SELECT 1 FROM PhanBoMau PB
                              WHERE PB.MaYeuCau = YC.MaYeuCau
                                AND PB.TrangThai IN (N'Đã phân bổ', N'Đã xuất'));

            -- 3.3. Hủy chế phẩm còn trong kho hoặc đã cấp phát
            UPDATE ChePhamMau
            SET TrangThai = N'Đã hủy', MaViTri = NULL,
                GhiChu = N'Thu hồi do đơn vị máu không đạt xét nghiệm'
            OUTPUT inserted.MaChePham, deleted.MaViTri INTO @ChePhamHuy
            WHERE MaDonViMau = @MaDonViMau
              AND TrangThai IN (N'Đang lưu trữ', N'Đã cấp phát');

            SELECT @SoChePhamThuHoi = COUNT(*) FROM @ChePhamHuy;

            -- 3.4. Trừ tồn kho vị trí và ngân hàng máu (không để âm)
            UPDATE NH
            SET LuongMauHienTai = CASE WHEN NH.LuongMauHienTai >= H.SoLuong
                                       THEN NH.LuongMauHienTai - H.SoLuong ELSE 0 END
            FROM NganHangMau NH
            JOIN (SELECT VT.MaNganHangMau, COUNT(*) AS SoLuong
                  FROM @ChePhamHuy C JOIN ViTriLuuTru VT ON VT.MaViTri = C.MaViTri
                  GROUP BY VT.MaNganHangMau) H ON H.MaNganHangMau = NH.MaNganHangMau;

            UPDATE VT
            SET LuongHienTai = CASE WHEN VT.LuongHienTai >= H.SoLuong
                                    THEN VT.LuongHienTai - H.SoLuong ELSE 0 END
            FROM ViTriLuuTru VT
            JOIN (SELECT MaViTri, COUNT(*) AS SoLuong
                  FROM @ChePhamHuy WHERE MaViTri IS NOT NULL
                  GROUP BY MaViTri) H ON H.MaViTri = VT.MaViTri;

            -- 3.5. Ghi lịch sử kho
            INSERT INTO LichSuKho (MaChePham, MaViTriCu, MaViTriMoi, LoaiGiaoDich,
                                    SoLuongThayDoi, NgayGioGiaoDich, NguoiThucHien,
                                    TrangThai, GhiChu)
            SELECT MaChePham, MaViTri, NULL, N'Tiêu hủy', 1, GETDATE(),
                   @NguoiThucHien, N'Hoàn tất', N'Thu hồi do đơn vị máu không đạt xét nghiệm'
            FROM @ChePhamHuy;

            -- 3.6. Chế phẩm đã truyền cho bệnh nhân: không thu hồi được, cần báo cáo sự cố
            SELECT @SoChePhamDaTruyen = COUNT(*) FROM ChePhamMau
            WHERE MaDonViMau = @MaDonViMau AND TrangThai = N'Đã sử dụng';
        END
        ELSE
        BEGIN
            -- Kiểm tra đã đủ tất cả xét nghiệm bắt buộc và đều đạt chưa
            DECLARE @TongBatBuoc INT, @TongDaLam INT;

            SELECT @TongBatBuoc = COUNT(*) FROM LoaiXetNghiem
            WHERE BatBuoc = 1 AND TrangThai = N'Đang áp dụng';

            SELECT @TongDaLam = COUNT(DISTINCT KQ.MaLoaiXN)
            FROM KetQuaXetNghiem KQ
            JOIN LoaiXetNghiem LXN ON KQ.MaLoaiXN = LXN.MaLoaiXN
            WHERE KQ.MaDonViMau = @MaDonViMau
              AND LXN.BatBuoc = 1
              AND KQ.KetLuan = N'Đạt';

            IF @TongBatBuoc = @TongDaLam
            BEGIN
                UPDATE DonViMau SET TrangThai = N'Đạt chuẩn'
                WHERE MaDonViMau = @MaDonViMau AND TrangThai = N'Chờ xét nghiệm';
            END
        END

        COMMIT TRANSACTION;

        SELECT @SoChePhamThuHoi AS SoChePhamThuHoi, @SoPhanBoHuy AS SoPhanBoHuy,
               @SoChePhamDaTruyen AS SoChePhamDaTruyen;
        PRINT N'Cập nhật kết quả xét nghiệm thành công!';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ---------------------------------------------------------------------
-- 1.1.5. Tiếp nhận lần hiến máu và tạo đơn vị máu (sp_TiepNhanLanHienMau)
-- Mục đích: Ghi nhận lượt hiến máu mới; người hiến đủ điều kiện thì tạo luôn đơn vị máu (túi máu) chờ xét nghiệm.
-- Tham số: @MaNguoiHien, @MaDot, @NgayHien, @ThoiGianHien, @LuongMau, @LoaiHienMau, @KetQuaKham, @GhiChu.
-- Nghiệp vụ và ràng buộc:
-- Kiểm tra người hiến máu đã đủ 18 tuổi hay chưa tại thời điểm hiến (NgayHien - NgaySinh >= 18) (Ràng buộc 3.4).
-- Kiểm tra khoảng cách giữa lần hiến hiện tại và lần hiến gần nhất >= 84 ngày (12 tuần).
-- Kết quả khám "Đủ điều kiện": LanHienMau ở trạng thái "Đã hiến" và tạo DonViMau:
--   nhóm máu theo người hiến, thể tích = lượng máu, ngày thu thập = ngày hiến, trạng thái "Chờ xét nghiệm",
--   phương pháp và hạn dùng theo loại hiến: máu toàn phần 35 ngày, gạn tách tiểu cầu 5 ngày, gạn tách huyết tương 1 năm.
-- Kết quả khám khác "Đủ điều kiện": không lấy máu, LanHienMau ở trạng thái "Không đạt", không tạo DonViMau.
-- Lần hiến và đơn vị máu được tạo trong cùng một transaction; mã đơn vị máu cấp tiếp theo mã lớn nhất (khóa bảng để không trùng).
-- Kết quả trả về: 1 dòng (MaLanHien, MaDonViMau – NULL nếu không tạo đơn vị máu).
-- Bảng ảnh hưởng: NguoiHienMau, LanHienMau, DonViMau.
-- Câu lệnh:

CREATE OR ALTER PROCEDURE sp_TiepNhanLanHienMau
    @MaNguoiHien INT,
    @MaDot INT,
    @NgayHien DATE,
    @ThoiGianHien DATETIME = NULL,
    @LuongMau INT,              -- 250, 350, 450
    @LoaiHienMau NVARCHAR(50),
    @KetQuaKham NVARCHAR(100),
    @GhiChu NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Kiểm tra người hiến tồn tại + đủ 18 tuổi tại thời điểm hiến
    DECLARE @NgaySinh DATE, @MaNhomMau BIGINT;
    SELECT @NgaySinh = NgaySinh, @MaNhomMau = MaNhomMau
    FROM NguoiHienMau WHERE MaNguoiHien = @MaNguoiHien;

    IF @NgaySinh IS NULL
    BEGIN
        RAISERROR(N'Người hiến máu không tồn tại!', 16, 1);
        RETURN;
    END

    IF DATEDIFF(YEAR, @NgaySinh, @NgayHien)
       - CASE WHEN (MONTH(@NgaySinh) > MONTH(@NgayHien))
                 OR (MONTH(@NgaySinh) = MONTH(@NgayHien) AND DAY(@NgaySinh) > DAY(@NgayHien))
              THEN 1 ELSE 0 END < 18
    BEGIN
        RAISERROR(N'Người hiến máu chưa đủ 18 tuổi!', 16, 1);
        RETURN;
    END

    -- 2. Kiểm tra khoảng cách tối thiểu 84 ngày giữa 2 lần hiến
    DECLARE @NgayHienGanNhat DATE;
    SELECT TOP 1 @NgayHienGanNhat = NgayHien
    FROM LanHienMau
    WHERE MaNguoiHien = @MaNguoiHien AND TrangThai = N'Đã hiến'
    ORDER BY NgayHien DESC;

    IF @NgayHienGanNhat IS NOT NULL AND DATEDIFF(DAY, @NgayHienGanNhat, @NgayHien) < 84
    BEGIN
        RAISERROR(N'Khoảng cách từ lần hiến trước chưa đủ 84 ngày!', 16, 1);
        RETURN;
    END

    -- 3. Ghép ngày hiến + giờ hiến thành DATETIME hoàn chỉnh (nếu có giờ)
    DECLARE @ThoiGianHienDayDu DATETIME =
        CASE WHEN @ThoiGianHien IS NOT NULL
             THEN CAST(@NgayHien AS DATETIME) + CAST(CAST(@ThoiGianHien AS TIME) AS DATETIME)
             ELSE NULL END;

    DECLARE @DuDieuKien BIT = CASE WHEN @KetQuaKham = N'Đủ điều kiện' THEN 1 ELSE 0 END;
    DECLARE @MaLanHien BIGINT, @MaDonViMau BIGINT = NULL;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- 4. Thêm lần hiến: không đủ điều kiện thì không lấy máu, ghi "Không đạt"
        INSERT INTO LanHienMau (MaNguoiHien, MaDot, NgayHien, ThoiGianHien, LuongMau,
                                 LoaiHienMau, KetQuaKham, TrangThai, GhiChu)
        VALUES (@MaNguoiHien, @MaDot, @NgayHien, @ThoiGianHienDayDu, @LuongMau,
                @LoaiHienMau, @KetQuaKham,
                CASE WHEN @DuDieuKien = 1 THEN N'Đã hiến' ELSE N'Không đạt' END,
                @GhiChu);

        SET @MaLanHien = SCOPE_IDENTITY();

        -- 5. Đủ điều kiện: tạo đơn vị máu chờ xét nghiệm
        IF @DuDieuKien = 1
        BEGIN
            SELECT @MaDonViMau = ISNULL(MAX(MaDonViMau), 0) + 1
            FROM DonViMau WITH (UPDLOCK, HOLDLOCK);

            INSERT INTO DonViMau (MaDonViMau, MaLanHien, MaNhomMau, MaViTri, TheTich,
                                  NgayThuThap, NgayHetHan, PhuongPhap, TrangThai, GhiChu)
            VALUES (@MaDonViMau, @MaLanHien, @MaNhomMau, NULL, @LuongMau,
                    @NgayHien,
                    CASE @LoaiHienMau
                        WHEN N'Tiểu cầu' THEN DATEADD(DAY, 5, @NgayHien)
                        WHEN N'Huyết tương' THEN DATEADD(YEAR, 1, @NgayHien)
                        ELSE DATEADD(DAY, 35, @NgayHien) END,
                    CASE @LoaiHienMau
                        WHEN N'Tiểu cầu' THEN N'Gạn tách tiểu cầu'
                        WHEN N'Huyết tương' THEN N'Gạn tách huyết tương'
                        ELSE N'Toàn phần' END,
                    N'Chờ xét nghiệm', NULL);
        END

        COMMIT TRANSACTION;

        SELECT @MaLanHien AS MaLanHien, @MaDonViMau AS MaDonViMau;
        PRINT N'Tiếp nhận lần hiến máu thành công!';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ---------------------------------------------------------------------
-- 1.1.6. Tách chế phẩm từ đơn vị máu (sp_TachChePham)
-- Mục đích: Tách một loại chế phẩm từ đơn vị máu đã đạt xét nghiệm; chế phẩm mới chờ nhập kho (sp_NhapKhoChePham).
-- Tham số: @MaDonViMau, @LoaiChePham, @TheTich, @GhiChu.
-- Nghiệp vụ và ràng buộc:
-- Chỉ tách từ đơn vị máu "Đạt chuẩn" (hoặc "Đã tách chế phẩm" khi tách thêm loại khác từ cùng túi).
-- Mỗi loại chế phẩm chỉ tách một lần từ một đơn vị máu; tổng thể tích các chế phẩm không vượt quá thể tích đơn vị máu.
-- Hạn sử dụng tính từ ngày thu thập: khối hồng cầu 35 ngày, huyết tương tươi đông lạnh 1 năm, khối tiểu cầu 5 ngày, tủa lạnh 6 tháng;
-- không tách nếu chế phẩm đã quá hạn tại thời điểm tách.
-- Chế phẩm mới ở trạng thái "Đang lưu trữ", chưa có vị trí; đơn vị máu chuyển sang "Đã tách chế phẩm".
-- Kết quả trả về: 1 dòng (MaChePham, HanSuDung).
-- Bảng ảnh hưởng: DonViMau, ChePhamMau.
-- Câu lệnh:

CREATE OR ALTER PROCEDURE sp_TachChePham
    @MaDonViMau BIGINT,
    @LoaiChePham NVARCHAR(100),
    @TheTich INT,
    @GhiChu NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Kiểm tra đơn vị máu
    DECLARE @TrangThaiDV NVARCHAR(30), @TheTichDV INT, @NgayThuThap DATE;
    SELECT @TrangThaiDV = TrangThai, @TheTichDV = TheTich, @NgayThuThap = NgayThuThap
    FROM DonViMau WHERE MaDonViMau = @MaDonViMau;

    IF @TrangThaiDV IS NULL
    BEGIN
        RAISERROR(N'Đơn vị máu không tồn tại!', 16, 1);
        RETURN;
    END

    IF @TrangThaiDV NOT IN (N'Đạt chuẩn', N'Đã tách chế phẩm')
    BEGIN
        RAISERROR(N'Chỉ tách chế phẩm từ đơn vị máu đã đạt chuẩn xét nghiệm!', 16, 1);
        RETURN;
    END

    -- 2. Kiểm tra loại và thể tích chế phẩm
    IF @LoaiChePham NOT IN (N'Khối hồng cầu', N'Huyết tương tươi đông lạnh', N'Khối tiểu cầu', N'Tủa lạnh')
    BEGIN
        RAISERROR(N'Loại chế phẩm không hợp lệ!', 16, 1);
        RETURN;
    END

    IF @TheTich IS NULL OR @TheTich <= 0
    BEGIN
        RAISERROR(N'Thể tích chế phẩm phải lớn hơn 0!', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM ChePhamMau WHERE MaDonViMau = @MaDonViMau AND LoaiChePham = @LoaiChePham)
    BEGIN
        RAISERROR(N'Đơn vị máu này đã tách loại chế phẩm này!', 16, 1);
        RETURN;
    END

    IF (SELECT ISNULL(SUM(TheTich), 0) FROM ChePhamMau WHERE MaDonViMau = @MaDonViMau) + @TheTich > @TheTichDV
    BEGIN
        RAISERROR(N'Tổng thể tích các chế phẩm vượt quá thể tích đơn vị máu!', 16, 1);
        RETURN;
    END

    -- 3. Hạn sử dụng theo loại chế phẩm, tính từ ngày thu thập
    DECLARE @HanSuDung DATE =
        CASE @LoaiChePham
            WHEN N'Khối hồng cầu' THEN DATEADD(DAY, 35, @NgayThuThap)
            WHEN N'Huyết tương tươi đông lạnh' THEN DATEADD(YEAR, 1, @NgayThuThap)
            WHEN N'Khối tiểu cầu' THEN DATEADD(DAY, 5, @NgayThuThap)
            ELSE DATEADD(MONTH, 6, @NgayThuThap) END;

    IF @HanSuDung < CAST(GETDATE() AS DATE)
    BEGIN
        RAISERROR(N'Đã quá thời hạn bảo quản của loại chế phẩm này, không thể tách!', 16, 1);
        RETURN;
    END

    DECLARE @MaChePham INT;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- 4. Thêm chế phẩm (chờ nhập kho)
        SELECT @MaChePham = ISNULL(MAX(MaChePham), 0) + 1
        FROM ChePhamMau WITH (UPDLOCK, HOLDLOCK);

        INSERT INTO ChePhamMau (MaChePham, MaDonViMau, MaViTri, LoaiChePham, TheTich,
                                NgayTachChePham, HanSuDung, TrangThai, GhiChu)
        VALUES (@MaChePham, @MaDonViMau, NULL, @LoaiChePham, @TheTich,
                CAST(GETDATE() AS DATE), @HanSuDung, N'Đang lưu trữ', @GhiChu);

        -- 5. Cập nhật trạng thái đơn vị máu
        UPDATE DonViMau SET TrangThai = N'Đã tách chế phẩm'
        WHERE MaDonViMau = @MaDonViMau;

        COMMIT TRANSACTION;

        SELECT @MaChePham AS MaChePham, @HanSuDung AS HanSuDung;
        PRINT N'Tách chế phẩm thành công!';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ---------------------------------------------------------------------
-- 1.2. Trigger Minh Trung

-- ---------------------------------------------------------------------
-- 1.2.1. Kiểm tra độ tuổi người hiến
CREATE OR ALTER TRIGGER trg_LanHienMau_KiemTraTuoi
ON LanHienMau
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM inserted I
        JOIN NguoiHienMau N
            ON I.MaNguoiHien = N.MaNguoiHien
        WHERE DATEADD(YEAR, 18, N.NgaySinh) > I.NgayHien
    )
    BEGIN
        RAISERROR(
            N'Người hiến chưa đủ 18 tuổi tại thời điểm hiến máu.',
            16, 1
        );
        ROLLBACK TRANSACTION;
    END
END;
GO

-- ---------------------------------------------------------------------
-- 1.2.2. Kiểm tra tính tương thích khi phân bổ
CREATE OR ALTER TRIGGER trg_PhanBoMau_KiemTraTuongThich
ON PhanBoMau
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM inserted I
        JOIN YeuCauCapMau Y
            ON I.MaYeuCau = Y.MaYeuCau
        JOIN ChePhamMau C
            ON I.MaChePham = C.MaChePham
        JOIN DonViMau D
            ON C.MaDonViMau = D.MaDonViMau
        WHERE NOT EXISTS
        (
            SELECT 1
            FROM QuyTacTuongThich Q
            WHERE Q.MaNhomMauCho = D.MaNhomMau
              AND Q.MaNhomMauNhan = Y.MaNhomMauYeuCau
              AND Q.LoaiChePham = Y.LoaiChePhamYeuCau
              AND Q.TuongThich = 1
        )
    )
    BEGIN
        RAISERROR(
            N'Không thể phân bổ do nhóm máu không tương thích.',
            16, 1
        );
        ROLLBACK TRANSACTION;
    END
END;
GO

-- ---------------------------------------------------------------------
-- 1.2.3. Cập nhật trạng thái yêu cầu
CREATE OR ALTER TRIGGER trg_PhanBoMau_CapNhatYeuCau
ON PhanBoMau
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Y
    SET TrangThai = N'Đã phân bổ'
    FROM YeuCauCapMau Y
    JOIN inserted I
        ON Y.MaYeuCau = I.MaYeuCau
    WHERE I.TrangThai IN (N'Đã phân bổ', N'Đã xuất')
      AND Y.TrangThai <> N'Hoàn tất';
END;
GO

-- ---------------------------------------------------------------------
-- 1.2.4. Cập nhật trạng thái chế phẩm sau truyền
CREATE OR ALTER TRIGGER trg_TruyenMau_CapNhatChePham
ON TruyenMau
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE C
    SET C.TrangThai = N'Đã sử dụng'
    FROM ChePhamMau C
    JOIN PhanBoMau P
        ON C.MaChePham = P.MaChePham
    JOIN inserted I
        ON P.MaPhanBo = I.MaPhanBo
    WHERE I.TrangThai = N'Hoàn thành';
END;
GO

-- ---------------------------------------------------------------------
-- 1.2.5. Kiểm tra sức chứa vị trí lưu trữ
CREATE OR ALTER TRIGGER trg_ViTriLuuTru_KiemTraSucChua
ON ViTriLuuTru
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM inserted
        WHERE LuongHienTai < 0
           OR LuongHienTai > SucChua
    )
    BEGIN
        RAISERROR(
            N'Lượng hiện tại không được âm hoặc vượt quá sức chứa.',
            16, 1
        );
        ROLLBACK TRANSACTION;
    END
END;
GO

-- ---------------------------------------------------------------------
-- 1.3. Function Ngọc Hạnh

-- ---------------------------------------------------------------------
-- 1.3.1. Tính tuổi
-- Mục đích: Tính tuổi tròn của một người tại ngày cần kiểm tra. Hàm xử lý chính xác trường hợp chưa đến ngày sinh nhật trong năm.
-- Tham số: @NgaySinh là ngày sinh; @NgayTinh là ngày tính tuổi, mặc định dùng ngày hiện tại của hệ thống.
-- Giá trị trả về: Số tuổi kiểu INT; trả về NULL nếu ngày sinh rỗng hoặc lớn hơn ngày tính.
-- Câu lệnh:
CREATE OR ALTER FUNCTION dbo.fn_TinhTuoi
(
    @NgaySinh DATE,
    @NgayTinh DATE = NULL
)
RETURNS INT
AS
BEGIN
    IF @NgayTinh IS NULL SET @NgayTinh = CAST(GETDATE() AS DATE);
    IF @NgaySinh IS NULL OR @NgaySinh > @NgayTinh RETURN NULL;

    RETURN DATEDIFF(YEAR, @NgaySinh, @NgayTinh)
           - CASE
               WHEN DATEADD(YEAR, DATEDIFF(YEAR, @NgaySinh, @NgayTinh), @NgaySinh) > @NgayTinh
               THEN 1 ELSE 0
             END;
END;
GO
-- Ví dụ sử dụng:
SELECT MaNguoiHien, HoTen, NgaySinh,
       dbo.fn_TinhTuoi(NgaySinh, CAST(GETDATE() AS DATE)) AS Tuoi
FROM NguoiHienMau;
GO

-- ---------------------------------------------------------------------
-- 1.3.2. Kiểm tra tương thích
-- Mục đích: Kiểm tra nhóm máu cho và nhóm máu nhận có tương thích với một loại chế phẩm cụ thể hay không, dựa trên bảng QuyTacTuongThich.
-- Tham số: @MaNhomMauCho, @MaNhomMauNhan và @LoaiChePham.
-- Giá trị trả về: BIT, trong đó 1 là tương thích và 0 là không tương thích hoặc chưa có quy tắc phù hợp.
-- Bảng sử dụng: QuyTacTuongThich.
-- Câu lệnh:
CREATE OR ALTER FUNCTION dbo.fn_KiemTraTuongThich
(
    @MaNhomMauCho BIGINT,
    @MaNhomMauNhan BIGINT,
    @LoaiChePham NVARCHAR(50)
)
RETURNS BIT
AS
BEGIN
    DECLARE @KetQua BIT = 0;

    SELECT TOP (1) @KetQua = TuongThich
    FROM QuyTacTuongThich
    WHERE MaNhomMauCho = @MaNhomMauCho
      AND MaNhomMauNhan = @MaNhomMauNhan
      AND LoaiChePham = @LoaiChePham;

    RETURN ISNULL(@KetQua, 0);
END;
GO
-- Ví dụ sử dụng:
SELECT dbo.fn_KiemTraTuongThich(1, 2, N'Khối hồng cầu') AS TuongThich;
GO

-- ---------------------------------------------------------------------
-- 1.3.3. Tính tổng thể tích đã phân bổ
-- Mục đích: Tính tổng thể tích các chế phẩm đã được phân bổ hợp lệ cho một yêu cầu cấp máu. Các phân bổ có trạng thái Đã hủy không được tính.
-- Tham số: @MaYeuCau là mã yêu cầu cấp máu cần thống kê.
-- Giá trị trả về: Tổng thể tích chế phẩm kiểu INT, đơn vị ml; trả về 0 nếu chưa có phân bổ hợp lệ.
-- Bảng sử dụng: PhanBoMau và ChePhamMau.
-- Câu lệnh:
CREATE OR ALTER FUNCTION dbo.fn_TongTheTichDaPhanBo
(
    @MaYeuCau INT
)
RETURNS INT
AS
BEGIN
    DECLARE @TongTheTich INT;

    SELECT @TongTheTich = ISNULL(SUM(CP.TheTich), 0)
    FROM PhanBoMau PB
    INNER JOIN ChePhamMau CP ON CP.MaChePham = PB.MaChePham
    WHERE PB.MaYeuCau = @MaYeuCau
      AND PB.TrangThai IN (N'Đã phân bổ', N'Đã xuất');

    RETURN ISNULL(@TongTheTich, 0);
END;
GO
-- Ví dụ sử dụng:
SELECT YC.MaYeuCau, YC.SoLuongYeuCau,
       dbo.fn_TongTheTichDaPhanBo(YC.MaYeuCau) AS TongTheTichDaPhanBo
FROM YeuCauCapMau YC;
GO

-- ---------------------------------------------------------------------
-- 1.4. Cursor Mẩn Đạt

-- ---------------------------------------------------------------------
-- 1.4.1. Cập nhật chế phẩm hết hạn
-- Tên Stored Procedure: dbo.sp_CapNhatChePhamHetHan
-- Mục đích: Sử dụng Cursor duyệt qua các chế phẩm máu quá hạn (HanSuDung < GETDATE()). Tiến hành cập nhật trạng thái TrangThai = N'Hết hạn' và tự động chèn log vào bảng LichSuKho.
-- Tham số đầu vào:
-- @v_MaChePham INT (Mặc định 0: Duyệt toàn bộ kho; Truyền mã cụ thể để xử lý 1 chế phẩm)
-- @v_NguoiThucHien NVARCHAR(100) (Mặc định N'Admin': Tên người thực hiện ghi nhật ký)
-- Giá trị trả về: Số lượng chế phẩm đã cập nhật, hoặc -1 nếu không có chế phẩm nào thỏa điều kiện, trã mã -99 nếu xảy ra lỗi.
CREATE PROCEDURE dbo.sp_CapNhatChePhamHetHan
@v_MaChePham INT = 0,
@v_NguoiThucHien NVARCHAR(100) = N'Admin'
AS
BEGIN
SET NOCOUNT ON;
DECLARE @r_MaChePham INT,
@r_MaViTri INT,
@v_out INT = 0;

-- Khai báo Cursor lấy các chế phẩm quá hạn
DECLARE cur_ChePham CURSOR LOCAL FAST_FORWARD FOR
SELECT MaChePham, MaViTri
FROM QuanLyNganHangMau.dbo.ChePhamMau
WHERE HanSuDung < CAST(GETDATE() AS DATE)
AND TrangThai NOT IN (N'Hết hạn', N'Đã sử dụng', N'Đã hủy')
AND (@v_MaChePham = 0 OR @v_MaChePham IS NULL OR MaChePham = @v_MaChePham);

BEGIN TRY
BEGIN TRANSACTION;
OPEN cur_ChePham;
FETCH NEXT FROM cur_ChePham INTO @r_MaChePham, @r_MaViTri;

WHILE @@FETCH_STATUS = 0
BEGIN
-- 1. Cập nhật trạng thái chế phẩm
UPDATE QuanLyNganHangMau.dbo.ChePhamMau
SET TrangThai = N'Hết hạn'
WHERE MaChePham = @r_MaChePham;

-- 2. Ghi nhật ký vào LichSuKho
INSERT INTO QuanLyNganHangMau.dbo.LichSuKho (
MaChePham, MaViTriCu, MaViTriMoi, LoaiGiaoDich, SoLuongThayDoi,
NgayGioGiaoDich, NguoiThucHien, TrangThai, GhiChu
) VALUES (
@r_MaChePham, @r_MaViTri, @r_MaViTri, N'Kiểm kê', 1,
GETDATE(), @v_NguoiThucHien, N'Hoàn tất', N'Tự động chuyển trạng thái do hết hạn sử dụng'
);
SET @v_out = @v_out + 1;
FETCH NEXT FROM cur_ChePham INTO @r_MaChePham, @r_MaViTri;
END
CLOSE cur_ChePham;
DEALLOCATE cur_ChePham;
COMMIT TRANSACTION;

IF @v_out = 0 RETURN -1;
RETURN @v_out;

END TRY
BEGIN CATCH
IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

IF CURSOR_STATUS('local', 'cur_ChePham') >= 0
BEGIN
CLOSE cur_ChePham;
DEALLOCATE cur_ChePham;
END

RETURN -99;
END CATCH
END;
GO
-- - Unit Test
DECLARE @Result1 INT;
EXEC @Result1 = dbo.sp_CapNhatChePhamHetHan
@v_MaChePham = 1,
@v_NguoiThucHien = N'Nguyễn Mẩn Đạt (Test 1.4.1)';
PRINT N'-> Result: ' + CAST(@Result1 AS VARCHAR);
GO

-- ---------------------------------------------------------------------
-- 1.4.2. Cập nhật trạng thái vị trí lưu trữ
-- Tên Stored Procedure: dbo.sp_CapNhatTrangThaiViTriLuuTru
-- Mục đích: Sử dụng Cursor duyệt qua các vị trí kho (ViTriLuuTru). Đếm thực tế số chế phẩm Đang lưu trữ tại từng vị trí để đồng bộ lại LuongHienTai, tự động đánh giá lại trạng thái kho (Đầy nếu >= SucChua, ngược lại là Còn chỗ).
-- Tham số đầu vào:
-- @v_MaViTri INT (Mặc định 0: Duyệt tất cả các vị trí kho; Truyền mã cụ thể để xử lý 1 vị trí)
-- Giá trị trả về: Số lượng vị trí kho đã đồng bộ, hoặc -1 nếu không có vị trí nào thỏa điều kiện hoặc trả -99 nếu xảy ra lỗi.
CREATE PROCEDURE dbo.sp_CapNhatTrangThaiViTriLuuTru
@v_MaViTri INT = 0
AS
BEGIN
SET NOCOUNT ON;

DECLARE @r_MaViTri INT,
@r_SucChua INT,
@v_SoLuongThucTe INT,
@v_TrangThaiMoi NVARCHAR(30),
@v_out INT = 0;

-- Khai báo Cursor lấy danh sách vị trí lưu trữ
DECLARE cur_ViTri CURSOR LOCAL FAST_FORWARD FOR
SELECT MaViTri, SucChua
FROM QuanLyNganHangMau.dbo.ViTriLuuTru
WHERE TrangThai NOT IN (N'Bảo trì', N'Không sử dụng')
AND (@v_MaViTri = 0 OR @v_MaViTri IS NULL OR MaViTri = @v_MaViTri);

BEGIN TRY
BEGIN TRANSACTION;

OPEN cur_ViTri;
FETCH NEXT FROM cur_ViTri INTO @r_MaViTri, @r_SucChua;

WHILE @@FETCH_STATUS = 0
BEGIN
-- 1. Đếm tổng số lượng chế phẩm thực tế đang lưu trữ tại vị trí này
SELECT @v_SoLuongThucTe = COUNT(*)
FROM QuanLyNganHangMau.dbo.ChePhamMau
WHERE MaViTri = @r_MaViTri
AND TrangThai = N'Đang lưu trữ';

-- 2. Đánh giá trạng thái mới dựa trên SucChua
IF @v_SoLuongThucTe >= @r_SucChua
SET @v_TrangThaiMoi = N'Đầy';
ELSE
SET @v_TrangThaiMoi = N'Còn chỗ';

-- 3. Cập nhật LuongHienTai và TrangThai mới vào ViTriLuuTru
UPDATE QuanLyNganHangMau.dbo.ViTriLuuTru
SET LuongHienTai = @v_SoLuongThucTe,
TrangThai = @v_TrangThaiMoi
WHERE MaViTri = @r_MaViTri;

SET @v_out = @v_out + 1;

FETCH NEXT FROM cur_ViTri INTO @r_MaViTri, @r_SucChua;
END

CLOSE cur_ViTri;
DEALLOCATE cur_ViTri;

COMMIT TRANSACTION;

IF @v_out = 0 RETURN -1;
RETURN @v_out;

END TRY
BEGIN CATCH
IF @@TRANCOUNT > 0
ROLLBACK TRANSACTION;

IF CURSOR_STATUS('local', 'cur_ViTri') >= 0
BEGIN
CLOSE cur_ViTri;
DEALLOCATE cur_ViTri;
END
RETURN -99;
END CATCH
END;
GO

-- Unit Test
DECLARE @Result2 INT;
EXEC @Result2 = dbo.sp_CapNhatTrangThaiViTriLuuTru
@v_MaViTri = 1;
SELECT @Result2 AS [KetQua_SoViTriDaDongBo];

GO

-- =====================================================================
-- 2. An toàn thông tin
-- =====================================================================

-- ---------------------------------------------------------------------
-- 2.1. Xác thực Anh Cường
-- Hệ thống sẽ xác thực bằng SQL Server Authentication, mọi tài khoản và mật khẩu sẽ được SQL Server lưu, để phù hợp với việc nhân viên ngân hàng máu, bác sĩ và quản lý sẽ thuộc nhiều đơn vị khác nhau. Mỗi người dùng cần một Login để đăng nhập vào máy chủ và một User tương ứng trong CSDL để được phân quyền.
-- Nhóm em sẽ tạo 3 tài khoản đại diện cho 3 đối tượng sử dụng chính nằm ở Chương 1 phía trên.

-- Bảng 2.1: Tài khoản người dùng của hệ thống

--- Đoạn code ---
USE master;
GO
CREATE LOGIN nhanvien01 WITH PASSWORD = N'NhanVien@2026',
    DEFAULT_DATABASE = QuanLyNganHangMau,
    CHECK_POLICY = ON, CHECK_EXPIRATION = ON;
CREATE LOGIN bacsi01 WITH PASSWORD = N'BacSi@2026',
    DEFAULT_DATABASE = QuanLyNganHangMau,
    CHECK_POLICY = ON, CHECK_EXPIRATION = ON;
CREATE LOGIN quanly01 WITH PASSWORD = N'QuanLy@2026',
    DEFAULT_DATABASE = QuanLyNganHangMau,
    CHECK_POLICY = ON, CHECK_EXPIRATION = ON;
GO

USE QuanLyNganHangMau;
GO
CREATE USER nhanvien01 FOR LOGIN nhanvien01;
CREATE USER bacsi01 FOR LOGIN bacsi01;
CREATE USER quanly01 FOR LOGIN quanly01;
------
-- Kiểm tra như thế nào? đăng nhập nhanvien01đúng mật khẩu thì kết nối thành công vào CSDL. Nhập sai mật khẩu thì SQL Server từ chối kết nối và báo lỗi Login failed.

GO

-- ---------------------------------------------------------------------
-- 2.2. Phân quyền Anh Cường
-- Việc phân quyền sẽ được cấp cho 3 nhóm role và sau đó gán người dùng vào nhóm đó, trường hợp mở rộng sau này khi có nhân viên mới thì ta chỉ việc thêm họ vào đúng nhóm. Và mỗi nhóm chỉ có quyền thao tác trên bảng của mình, sẽ không có nhóm nào xoá dữ liệu được, vì vòng đời của đơn vị máu cần phải truy vết được, trường hợp khi huỷ bỏ thì chỉ đổi trạng thái thôi. (user có các action nhạy cảm sẽ bị chặn bằng DENY)

-- Bảng 2.2: Phân quyền theo nhóm người dùng trên hệ thống
-- Cả 3 nhóm quyền tương ứng 3 nhóm user trên được dùng 3 function ở mục 1.3 (fn_TinhTuoi, fn_KiemTraTuongThich, fn_TongTheTichDaPhanBo) khi các function này chỉ đọc dữ liệu.
-- Về ví dụ thì nhóm em sẽ để minh hoạ cài đặt cho nhóm người dùng mang role_BacSi (đây là nhóm đại diện tiêu biểu nhất khi thể hiện được cả GRANT, DENY, có quyền chạy Procedure), hai nhóm còn lại được cài đặt tương tự theo bảng của role_BacSi.
-- ---đoạn code---
CREATE ROLE role_NhanVienNganHangMau;
CREATE ROLE role_BacSi;
CREATE ROLE role_QuanLy;
GO
GRANT SELECT, INSERT, UPDATE ON dbo.BenhNhan TO role_BacSi;
GRANT SELECT, INSERT, UPDATE ON dbo.TruyenMau TO role_BacSi;
GRANT SELECT, INSERT ON dbo.YeuCauCapMau TO role_BacSi;
GRANT EXECUTE ON dbo.sp_GhiNhanTruyenMau TO role_BacSi;
DENY INSERT, UPDATE ON dbo.ChePhamMau TO role_BacSi;
DENY SELECT ON dbo.NguoiHienMau TO role_BacSi;
DENY DELETE ON SCHEMA::dbo TO role_BacSi;
GO
ALTER ROLE role_NhanVienNganHangMau ADD MEMBER nhanvien01;
ALTER ROLE role_BacSi ADD MEMBER bacsi01;
ALTER ROLE role_QuanLy ADD MEMBER quanly01;
-- ------
-- Note: Bác sĩ bị DENY sửa ChePhamMau nhưng vẫn cập nhật được kho sau khi truyền máu thông qua sp_GhiNhanTruyenMau. Lý do là procedure và bảng cùng thuộc chủ sở hữu dbo. Nhờ vậy các bác sĩ chỉ tác động vào kho qua nghiệp vụ đã được kiểm tra, không sửa tùy ý được.
-- Kiểm tra như thế nào? Sẽ đăng nhập lần lượt bằng 3 tài khoản:
-- bacsi01 xem được BenhNhan, nhưng sửa thông tin của ChePhamMau hay xem thông tin về NguoiHienMau đều bị từ chối, tự duyệt yêu cầu cấp máu bị từ chối.
-- nhanvien01 duyệt được yêu cầu cấp máu, nhưng xóa LichSuKho bị từ chối
-- quanly01 xem được thống kê chế phẩm, nhưng sửa DonViMau bị từ chối.

-- ---------------------------------------------------------------------
-- 2.3. Import Nhân Tâm
-- Thuyết minh
-- Chức năng Import dữ liệu cho phép chuyển đổi và tải các tập tin dữ liệu ngoại vi (như các tập tin .csv hoặc .txt chứa danh sách người hiến máu, đợt hiến máu, đơn vị máu mới thu thập...) trực tiếp vào CSDL SQL Server thông qua câu lệnh BULK INSERT. Việc sử dụng thủ tục (Stored Procedure) để thực hiện import giúp đảm bảo tính tự động hóa, kiểm tra ràng buộc toàn vẹn và tối ưu thời gian xử lý dữ liệu số lượng lớn.
-- Cài đặt Stored Procedure Import
USE QuanLyNganHangMau;
GO

CREATE OR ALTER PROCEDURE sp_ImportNguoiHienMau
    @FilePath NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        CREATE TABLE #TempNguoiHienMau (
            MaNguoiHien BIGINT,
            HoTen NVARCHAR(100),
            NgaySinh DATE,
            GioiTinh NVARCHAR(10),
            CCCD VARCHAR(20),
            SoDienThoai VARCHAR(15),
            DiaChi NVARCHAR(255),
            MaNhomMau BIGINT
        );

        DECLARE @Sql NVARCHAR(MAX);
        SET @Sql = N'BULK INSERT #TempNguoiHienMau
                    FROM ''' + @FilePath + '''
                    WITH (
                        FIRSTROW = 2,           -- Bỏ qua dòng tiêu đề
                        FIELDTERMINATOR = '','', -- Dấu phân cách cột (dấu phẩy)
                        ROWTERMINATOR = ''\n'',  -- Dấu xuống dòng
                        CODEPAGE = ''65001''     -- Đọc định dạng UTF-8
                    );';
        EXEC sp_executesql @Sql;

        -- Chèn các bản ghi hợp lệ chưa tồn tại trong bảng chính (tránh trùng CCCD hoặc PK)
        INSERT INTO NguoiHienMau (MaNguoiHien, HoTen, NgaySinh, GioiTinh, CCCD, SoDienThoai, DiaChi, MaNhomMau)
        SELECT T.MaNguoiHien, T.HoTen, T.NgaySinh, T.GioiTinh, T.CCCD, T.SoDienThoai, T.DiaChi, T.MaNhomMau
        FROM #TempNguoiHienMau T
        WHERE NOT EXISTS (
            SELECT 1 FROM NguoiHienMau N
            WHERE N.MaNguoiHien = T.MaNguoiHien OR N.CCCD = T.CCCD
        );

        DROP TABLE #TempNguoiHienMau;

        COMMIT TRANSACTION;
        PRINT N'Import dữ liệu Người hiến máu thành công!';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        PRINT N'Lỗi trong quá trình Import: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- ---------------------------------------------------------------------
-- 2.4. Export Nhân Tâm

-- ---------------------------------------------------------------------
-- Thuyết minh
-- Chức năng Export hỗ trợ trích xuất các thông tin báo cáo, thống kê (như danh sách tồn kho chế phẩm, báo cáo cấp phát, lịch sử truyền máu) ra khỏi CSDL SQL Server sang các định dạng tập tin văn bản (.csv, .txt) để phục vụ lưu trữ, tổng hợp báo cáo gửi cho Bộ Y tế hoặc phân tích dữ liệu ngoại vi. Chức năng này ứng dụng tiện ích command-line bcp (Bulk Copy Program) kết hợp với View hoặc Stored Procedure trong SQL Server.

-- ---------------------------------------------------------------------
-- Cài đặt Export
USE QuanLyNganHangMau;
GO

CREATE OR ALTER VIEW v_ExportTonKhoChePham
AS
SELECT
    C.MaChePham,
    D.MaDonViMau,
    N.TenNhomMau,
    C.LoaiChePham,
    C.TheTich,
    C.NgayTachChePham,
    C.HanSuDung,
    V.TenViTri,
    C.TrangThai
FROM ChePhamMau C
INNER JOIN DonViMau D ON C.MaDonViMau = D.MaDonViMau
INNER JOIN NhomMau N ON D.MaNhomMau = N.MaNhomMau
INNER JOIN ViTriLuuTru V ON C.MaViTri = V.MaViTri
WHERE C.TrangThai = N'Đang lưu trữ';
GO

CREATE OR ALTER PROCEDURE sp_ExportTonKhoChePhamCSV
    @OutputFilePath NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @BcpCommand NVARCHAR(1000);
    SET @BcpCommand = 'bcp "SELECT ''MaChePham'', ''MaDonViMau'', ''TenNhomMau'', ''LoaiChePham'', ''TheTich'', ''NgayTachChePham'', ''HanSuDung'', ''TenViTri'', ''TrangThai'' UNION ALL SELECT CAST(MaChePham AS VARCHAR), CAST(MaDonViMau AS VARCHAR), TenNhomMau, LoaiChePham, CAST(TheTich AS VARCHAR), CAST(NgayTachChePham AS VARCHAR), CAST(HanSuDung AS VARCHAR), TenViTri, TrangThai FROM QuanLyNganHangMau.dbo.v_ExportTonKhoChePham" queryout "'
                      + @OutputFilePath + '" -c -t"," -w -T -S ' + @@SERVERNAME;

    EXEC xp_cmdshell @BcpCommand;
END;
GO

-- ---------------------------------------------------------------------
-- 2.5. Backup Huy Võ
-- Mục đích: Tạo bản sao dự phòng toàn bộ CSDL QuanLyNganHangMau nhằm bảo vệ dữ liệu trước các sự cố mất mát, hỏng hóc hoặc sai sót trong quá trình vận hành.
-- Nghiệp vụ và ràng buộc:
-- Chỉ cho phép người dùng thuộc nhóm quyền role_QuanLy (Ban giám đốc/quản trị hệ thống) thực hiện.
-- Bản sao lưu phải bao gồm toàn bộ cấu trúc bảng, dữ liệu và các đối tượng liên quan (Stored Procedure, Trigger, Function).
-- Đặt tên file backup theo quy tắc: QuanLyNganHangMau_YYYYMMDD_HHMMSS.bak để dễ truy xuất.
-- Ghi nhận lịch sử sao lưu vào bảng LichSuBackup gồm: mã lần backup, thời điểm, người thực hiện, đường dẫn file, trạng thái.
-- Bảng ảnh hưởng: LichSuBackup (ghi log), toàn bộ CSDL QuanLyNganHangMau (được sao lưu).
-- Câu lệnh:
-- 1. Tạo bảng lưu lịch sử backup
CREATE TABLE LichSuBackup (
MaBackup INT IDENTITY(1,1) PRIMARY KEY,
ThoiGianBackup DATETIME NOT NULL DEFAULT GETDATE(),
NguoiThucHien NVARCHAR(100) NOT NULL,
DuongDanFile NVARCHAR(500) NOT NULL,
KichThuocFile BIGINT NULL,
TrangThai NVARCHAR(30) NOT NULL,
GhiChu NVARCHAR(500) NULL
);

-- 2. Stored Procedure thực hiện backup
GO
CREATE PROCEDURE sp_BackupDuLieu
@DuongDanFile NVARCHAR(500),
@NguoiThucHien NVARCHAR(100),
@GhiChu NVARCHAR(500) = NULL
AS
BEGIN
SET NOCOUNT ON;
IF @NguoiThucHien IS NULL OR LTRIM(RTRIM(@NguoiThucHien)) = ''
BEGIN
RAISERROR(N'Người thực hiện không hợp lệ!', 16, 1);
RETURN;
END

BEGIN TRY
BACKUP DATABASE QuanLyNganHangMau
TO DISK = @DuongDanFile
WITH FORMAT,
MEDIANAME = N'QuanLyNganHangMau_Backup',
NAME = N'Full Backup of QuanLyNganHangMau',
STATS = 10;

INSERT INTO LichSuBackup (NguoiThucHien, DuongDanFile, TrangThai, GhiChu)
VALUES (@NguoiThucHien, @DuongDanFile, N'Thành công', @GhiChu);

PRINT N'Sao lưu dữ liệu thành công!';
END TRY
BEGIN CATCH
INSERT INTO LichSuBackup (NguoiThucHien, DuongDanFile, TrangThai, GhiChu)
VALUES (@NguoiThucHien, @DuongDanFile, N'Thất bại', ERROR_MESSAGE());

RAISERROR(N'Sao lưu thất bại!', 16, 1);
END CATCH
END;
GO

-- 3. Ví dụ gọi thủ tục
-- (Ví dụ minh họa - bỏ dấu -- để chạy riêng khi cần, không chạy cùng script tạo CSDL)
-- EXEC sp_BackupDuLieu
-- @DuongDanFile = N'D:\Backup\QuanLyNganHangMau_20260415_083000.bak',
-- @NguoiThucHien = N'Võ Quốc Huy',
-- @GhiChu = N'Sao lưu định kỳ hàng tuần';

-- 4. Phân quyền thực thi
GRANT EXECUTE ON sp_BackupDuLieu TO role_QuanLy;

GO

-- ---------------------------------------------------------------------
-- 2.6. Restore Huy Võ
-- Mục đích: Khôi phục CSDL QuanLyNganHangMau từ file backup đã tạo trước đó, phục vụ cho tình huống khôi phục sau sự cố hoặc chuyển đổi môi trường.
-- Nghiệp vụ và ràng buộc:
-- Chỉ cho phép người dùng thuộc nhóm quyền role_QuanLy thực hiện.
-- File backup phải tồn tại và hợp lệ trước khi restore.
-- Trước khi restore phải đảm bảo không có kết nối đang hoạt động tới CSDL (chuyển sang SINGLE_USER với ROLLBACK IMMEDIATE).
-- Ghi nhận lịch sử phục hồi vào bảng LichSuRestore gồm: mã lần restore, thời điểm, người thực hiện, đường dẫn file nguồn, trạng thái.
-- Sau khi restore thành công, chuyển CSDL về trạng thái MULTI_USER.
-- Bảng ảnh hưởng: LichSuRestore (ghi log), toàn bộ CSDL QuanLyNganHangMau (được phục hồi từ file backup).
-- Câu lệnh:
-- 1. Tạo bảng lưu lịch sử restore
CREATE TABLE LichSuRestore (
MaRestore INT IDENTITY(1,1) PRIMARY KEY,
ThoiGianRestore DATETIME NOT NULL DEFAULT GETDATE(),
NguoiThucHien NVARCHAR(100) NOT NULL,
DuongDanFileNguon NVARCHAR(500) NOT NULL,
TrangThai NVARCHAR(30) NOT NULL,
GhiChu NVARCHAR(500) NULL
);

-- 2. Stored Procedure thực hiện restore
GO
CREATE PROCEDURE sp_RestoreDuLieu
@DuongDanFileNguon NVARCHAR(500),
@NguoiThucHien NVARCHAR(100),
@GhiChu NVARCHAR(500) = NULL
AS
BEGIN
SET NOCOUNT ON;
IF @NguoiThucHien IS NULL OR LTRIM(RTRIM(@NguoiThucHien)) = ''
BEGIN
RAISERROR(N'Người thực hiện không hợp lệ!', 16, 1);
RETURN;
END

BEGIN TRY
ALTER DATABASE QuanLyNganHangMau
SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

RESTORE DATABASE QuanLyNganHangMau
FROM DISK = @DuongDanFileNguon
WITH REPLACE,
RECOVERY,
STATS = 10;

ALTER DATABASE QuanLyNganHangMau
SET MULTI_USER;

INSERT INTO LichSuRestore (NguoiThucHien, DuongDanFileNguon, TrangThai, GhiChu)
VALUES (@NguoiThucHien, @DuongDanFileNguon, N'Thành công', @GhiChu);

PRINT N'Phục hồi dữ liệu thành công!';
END TRY
BEGIN CATCH
IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'QuanLyNganHangMau' AND user_access_desc = 'SINGLE_USER')
BEGIN
ALTER DATABASE QuanLyNganHangMau SET MULTI_USER;
END

INSERT INTO LichSuRestore (NguoiThucHien, DuongDanFileNguon, TrangThai, GhiChu)
VALUES (@NguoiThucHien, @DuongDanFileNguon, N'Thất bại', ERROR_MESSAGE());

RAISERROR(N'Phục hồi dữ liệu thất bại!', 16, 1);
END CATCH
END;
GO

-- 3. Ví dụ gọi thủ tục
-- (Ví dụ minh họa - bỏ dấu -- để chạy riêng khi cần, không chạy cùng script tạo CSDL)
-- EXEC sp_RestoreDuLieu
-- @DuongDanFileNguon = N'D:\Backup\QuanLyNganHangMau_20260415_083000.bak',
-- @NguoiThucHien = N'Võ Quốc Huy',
-- @GhiChu = N'Phục hồi sau sự cố hỏng ổ đĩa ngày 20/04/2026';

-- 4. Phân quyền thực thi
GRANT EXECUTE ON sp_RestoreDuLieu TO role_QuanLy;

GO

-- =====================================================================
-- 3. Trình bày thông tin Đăng Trình + Huy Nguyễn + Cẩm Nhi
-- =====================================================================

-- ---------------------------------------------------------------------
-- 3.1. Báo cáo tồn kho theo nhóm máu
-- Phần A: Tổng hợp tồn kho theo nhóm máu và loại chế phẩm (đủ 8 x 4 = 32 dòng, kể cả khi tồn kho bằng 0)
WITH TonKho AS (
    SELECT DVM.MaNhomMau, CPM.LoaiChePham, CPM.TheTich
    FROM ChePhamMau CPM
    INNER JOIN DonViMau DVM ON CPM.MaDonViMau = DVM.MaDonViMau
    WHERE CPM.TrangThai = N'Đang lưu trữ'
      AND CPM.HanSuDung >= CAST(GETDATE() AS DATE)
)
SELECT
    NM.MaNhomMau,
    NM.TenNhomMau,
    LCP.LoaiChePham,
    COUNT(TK.TheTich) AS SoTui,
    ISNULL(SUM(TK.TheTich), 0) AS TheTich_ml
FROM NhomMau NM
CROSS JOIN (VALUES
    (1, N'Khối hồng cầu'),
    (2, N'Huyết tương tươi đông lạnh'),
    (3, N'Khối tiểu cầu'),
    (4, N'Tủa lạnh')
) AS LCP(ThuTu, LoaiChePham)
LEFT JOIN TonKho TK
    ON TK.MaNhomMau = NM.MaNhomMau
    AND TK.LoaiChePham = LCP.LoaiChePham
GROUP BY NM.MaNhomMau, NM.TenNhomMau, LCP.ThuTu, LCP.LoaiChePham
ORDER BY NM.MaNhomMau, LCP.ThuTu;

-- Phần B: Chi tiết tồn kho theo ngân hàng máu (chỉ liệt kê nơi đang có chế phẩm)
SELECT
    NHM.TenNganHangMau,
    NM.TenNhomMau,
    CPM.LoaiChePham,
    COUNT(CPM.MaChePham) AS SoTui,
    SUM(CPM.TheTich) AS TheTich_ml
FROM ChePhamMau CPM
INNER JOIN DonViMau DVM ON CPM.MaDonViMau = DVM.MaDonViMau
INNER JOIN NhomMau NM ON DVM.MaNhomMau = NM.MaNhomMau
INNER JOIN ViTriLuuTru VTLT ON CPM.MaViTri = VTLT.MaViTri
INNER JOIN NganHangMau NHM ON VTLT.MaNganHangMau = NHM.MaNganHangMau
WHERE CPM.TrangThai = N'Đang lưu trữ'
  AND CPM.HanSuDung >= CAST(GETDATE() AS DATE)
GROUP BY NHM.TenNganHangMau, NM.MaNhomMau, NM.TenNhomMau, CPM.LoaiChePham
ORDER BY NHM.TenNganHangMau, NM.MaNhomMau, CPM.LoaiChePham;
GO

-- ---------------------------------------------------------------------
-- 3.2. Báo cáo chế phẩm sắp hết hạn
CREATE PROCEDURE sp_BaoCaoChePhamSapHetHan
    @SoNgayCanhBao INT = 7 -- Mặc định cảnh báo các chế phẩm sắp hết hạn trong 7 ngày tới
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        cp.MaChePham,
        cp.LoaiChePham,
        nm.TenNhomMau,
        cp.TheTich,
        cp.NgayTachChePham,
        cp.HanSuDung,
        DATEDIFF(DAY, GETDATE(), cp.HanSuDung) AS SoNgayConLai,
        vt.TenViTri,
        nhm.TenNganHangMau,
        cp.TrangThai
    FROM ChePhamMau cp
    JOIN DonViMau dvm ON cp.MaDonViMau = dvm.MaDonViMau
    LEFT JOIN NhomMau nm ON dvm.MaNhomMau = nm.MaNhomMau
    JOIN ViTriLuuTru vt ON cp.MaViTri = vt.MaViTri
    JOIN NganHangMau nhm ON vt.MaNganHangMau = nhm.MaNganHangMau
    WHERE cp.TrangThai = N'Đang lưu trữ'
      AND cp.HanSuDung >= CAST(GETDATE() AS DATE)
      AND cp.HanSuDung <= DATEADD(DAY, @SoNgayCanhBao, CAST(GETDATE() AS DATE))
    ORDER BY cp.HanSuDung ASC;
END;
GO

-- Thực thi Procedure cảnh báo cho 7 ngày tới:
EXEC sp_BaoCaoChePhamSapHetHan @SoNgayCanhBao = 7;
GO

-- ---------------------------------------------------------------------
-- 3.3. Báo cáo kết quả đợt hiến máu
CREATE PROCEDURE sp_BaoCaoKetQuaDotHienMau
    @MaDot BIGINT = NULL -- Nếu NULL sẽ xuất báo cáo cho tất cả các đợt hiến máu
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        dhm.MaDot,
        dhm.TenDot,
        dhm.NgayBD,
        dhm.NgayKT,
        dhm.DiaDiem,
        dhm.TrangThai AS TrangThaiDot,
        COUNT(lhm.MaLanHien) AS TongLuotDangKy,
        SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' THEN 1 ELSE 0 END) AS SoLuotHienThanhCong,
        SUM(CASE WHEN lhm.TrangThai = N'Không đạt' THEN 1 ELSE 0 END) AS SoLuotKhongDat,
        ISNULL(SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' THEN lhm.LuongMau ELSE 0 END), 0) AS TongLuongMauThuDuoc_ml,
        -- Thống kê thể tích thu được phân theo 8 nhóm máu ABO/Rh(D)
        ISNULL(SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' AND ngh.MaNhomMau = 1 THEN lhm.LuongMau ELSE 0 END), 0) AS Nhom_O_Pos_ml,
        ISNULL(SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' AND ngh.MaNhomMau = 2 THEN lhm.LuongMau ELSE 0 END), 0) AS Nhom_A_Pos_ml,
        ISNULL(SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' AND ngh.MaNhomMau = 3 THEN lhm.LuongMau ELSE 0 END), 0) AS Nhom_B_Pos_ml,
        ISNULL(SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' AND ngh.MaNhomMau = 4 THEN lhm.LuongMau ELSE 0 END), 0) AS Nhom_AB_Pos_ml,
        ISNULL(SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' AND ngh.MaNhomMau = 5 THEN lhm.LuongMau ELSE 0 END), 0) AS Nhom_O_Neg_ml,
        ISNULL(SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' AND ngh.MaNhomMau = 6 THEN lhm.LuongMau ELSE 0 END), 0) AS Nhom_A_Neg_ml,
        ISNULL(SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' AND ngh.MaNhomMau = 7 THEN lhm.LuongMau ELSE 0 END), 0) AS Nhom_B_Neg_ml,
        ISNULL(SUM(CASE WHEN lhm.TrangThai = N'Đã hiến' AND ngh.MaNhomMau = 8 THEN lhm.LuongMau ELSE 0 END), 0) AS Nhom_AB_Neg_ml
    FROM DotHienMau dhm
    LEFT JOIN LanHienMau lhm ON dhm.MaDot = lhm.MaDot
    LEFT JOIN NguoiHienMau ngh ON lhm.MaNguoiHien = ngh.MaNguoiHien
    WHERE (@MaDot IS NULL OR dhm.MaDot = @MaDot)
    GROUP BY
        dhm.MaDot, dhm.TenDot, dhm.NgayBD, dhm.NgayKT, dhm.DiaDiem, dhm.TrangThai
    ORDER BY dhm.NgayBD DESC;
END;
GO

-- Thực thi Procedure báo cáo cho tất cả các đợt hiến máu:
EXEC sp_BaoCaoKetQuaDotHienMau;
GO

-- ---------------------------------------------------------------------
-- 3.4. Báo cáo yêu cầu và tình trạng đáp ứng
SELECT
    YC.MaYeuCau,
    BN.HoTen AS TenBenhNhan,
    K.TenKhoa,
    NM.TenNhomMau,
    YC.LoaiChePhamYeuCau,
    YC.SoLuongYeuCau AS TheTichYeuCau_ml,
    COUNT(PB.MaPhanBo) AS SoTuiDaPhanBo,
    ISNULL(SUM(CPM.TheTich), 0) AS TheTichDaPhanBo_ml,
    CASE WHEN YC.SoLuongYeuCau > ISNULL(SUM(CPM.TheTich), 0)
         THEN YC.SoLuongYeuCau - ISNULL(SUM(CPM.TheTich), 0)
         ELSE 0 END AS TheTichConThieu_ml,
    YC.MucDoUuTien,
    YC.NgayYeuCau,
    YC.TrangThai
FROM YeuCauCapMau YC
INNER JOIN BenhNhan BN
    ON YC.MaBenhNhan = BN.MaBenhNhan
INNER JOIN Khoa K
    ON YC.MaKhoa = K.MaKhoa
INNER JOIN NhomMau NM
    ON YC.MaNhomMauYeuCau = NM.MaNhomMau
LEFT JOIN PhanBoMau PB
    ON YC.MaYeuCau = PB.MaYeuCau
    AND PB.TrangThai IN
    (
        N'Đã phân bổ',
        N'Đã xuất'
    )
LEFT JOIN ChePhamMau CPM
    ON PB.MaChePham = CPM.MaChePham
GROUP BY
    YC.MaYeuCau,
    BN.HoTen,
    K.TenKhoa,
    NM.TenNhomMau,
    YC.LoaiChePhamYeuCau,
    YC.SoLuongYeuCau,
    YC.MucDoUuTien,
    YC.NgayYeuCau,
    YC.TrangThai
ORDER BY
    YC.NgayYeuCau DESC;
GO

-- ---------------------------------------------------------------------
-- 3.5. Báo cáo tình hình truyền máu
SELECT
YCCM.MaYeuCau,
NM.TenNhomMau,
YCCM.LoaiChePhamYeuCau,
YCCM.SoLuongYeuCau AS TheTichYeuCau_ml,
YCCM.TrangThai AS TrangThaiYeuCau,
PBM.MaPhanBo,
PBM.TrangThai AS TrangThaiPhanBo,
PBM.LyDoHuy,
CPM.MaChePham,
TM.MaTruyenMau,
TM.NgayGioBatDau,
TM.NgayGioKetThuc,
TM.TheTichTruyen,
ISNULL(TM.TrangThai, N'Chưa truyền') AS TrangThaiTruyen,
ISNULL(TM.PhanUngPhu, N'') AS PhanUngPhu
FROM YeuCauCapMau YCCM
INNER JOIN NhomMau NM ON NM.MaNhomMau = YCCM.MaNhomMauYeuCau
LEFT JOIN PhanBoMau PBM ON YCCM.MaYeuCau = PBM.MaYeuCau
LEFT JOIN ChePhamMau CPM ON PBM.MaChePham = CPM.MaChePham
LEFT JOIN TruyenMau TM ON PBM.MaPhanBo = TM.MaPhanBo
ORDER BY YCCM.MaYeuCau DESC, PBM.MaPhanBo;

GO
