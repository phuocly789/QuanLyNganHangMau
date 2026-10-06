# Ngân hàng máu – mã nguồn giao diện web

> **Hướng dẫn sử dụng đầy đủ** (chức năng từng màn hình, đối tượng SQL bị tác động, luồng nghiệp vụ, kịch bản demo):
> xem [README ở thư mục gốc](../README.md). Trên web, nút **Hướng dẫn** ở thanh menu hiển thị cùng nội dung theo từng màn hình.

## Chạy

1. Tạo database bằng `../sql/QuanLyNganHangMau.sql`.
2. Cấp quyền cho 3 nhóm người dùng: chạy `../sql/PhanQuyenWeb.sql`.
3. Tạo `.env.local` từ `.env.example` (mặc định đã đúng cho SQL Server cài trên máy).
4. `npm install` rồi `npm run dev`, mở http://localhost:3000.

Yêu cầu: Node 22, SQL Server bật SQL Server Authentication, ODBC Driver 17 for SQL Server.
Không cần bật TCP/IP – kết nối đi qua shared memory bằng driver `msnodesqlv8`.

## Đăng nhập

Mỗi tài khoản là một SQL login, quyền do GRANT/DENY trong DB quyết định.

| Tài khoản | Mật khẩu | Vai trò |
|---|---|---|
| nhanvien01 | NhanVien@2026 | Nhân viên ngân hàng máu |
| bacsi01 | BacSi@2026 | Bác sĩ |
| quanly01 | QuanLy@2026 | Cán bộ quản lý |

Dải "Bản demo" trên cùng cho phép chuyển nhanh giữa 3 tài khoản.

## Đối tượng SQL ↔ màn hình

| Đối tượng | Màn hình | Vai trò thao tác |
|---|---|---|
| sp_NhapKhoChePham | Kho máu › Nhập kho | Nhân viên |
| sp_CapNhatChePhamHetHan | Kho máu › Cập nhật chế phẩm hết hạn | Nhân viên |
| sp_CapNhatTrangThaiViTriLuuTru | Kho máu › Vị trí lưu trữ › Đồng bộ | Nhân viên |
| sp_PhanBoMauChoYeuCau | Yêu cầu › Chi tiết › Tự động phân bổ | Nhân viên |
| sp_TiepNhanLanHienMau | Hiến máu › Tiếp nhận lần hiến (đủ điều kiện thì tạo luôn đơn vị máu) | Nhân viên |
| sp_ImportNguoiHienMau | Hiến máu › Người hiến › Import | Nhân viên |
| sp_CapNhatKetQuaXetNghiem | Xét nghiệm › Nhập kết quả (không đạt về muộn thì thu hồi chế phẩm) | Nhân viên |
| sp_TachChePham | Xét nghiệm › Tách chế phẩm (đơn vị Đạt chuẩn) | Nhân viên |
| sp_GhiNhanTruyenMau | Truyền máu › Ghi nhận ca truyền | Bác sĩ |
| sp_BaoCaoChePhamSapHetHan | Báo cáo › Chế phẩm sắp hết hạn | Quản lý |
| sp_BaoCaoKetQuaDotHienMau | Báo cáo › Kết quả đợt hiến máu | Quản lý |
| Truy vấn 3.1 / 3.4 / 3.5 | Báo cáo (và ma trận ở Kho máu dùng 3.1A) | Quản lý |
| sp_BackupDuLieu | Quản trị › Sao lưu (kèm LichSuBackup) | Quản lý |
| Phục hồi (RESTORE) | Quản trị › tạo script chạy trong SSMS bằng tài khoản sysadmin (kèm LichSuRestore). Không gọi sp_RestoreDuLieu từ web vì RESTORE cần quyền cấp máy chủ và không chạy được từ bên trong chính CSDL | Quản trị viên SQL |
| sp_ExportTonKhoChePhamCSV, v_ExportTonKhoChePham | Quản trị › Export: xem trước dữ liệu của view + script chạy trong SSMS (xp_cmdshell chỉ dành cho sysadmin) | Quản trị viên SQL |
| fn_TinhTuoi | Tuổi người hiến, bệnh nhân | – |
| fn_KiemTraTuongThich | Cột Tương thích, Nhóm cho phù hợp (chi tiết yêu cầu) | – |
| fn_TongTheTichDaPhanBo | Đã phân bổ / còn thiếu (ml) | – |
| 5 trigger | Chạy kèm các procedure trên; lỗi do trigger báo hiện ngay trên trang | – |

## Cấu trúc

```
lib/server/db.ts         kết nối theo phiên, query/exec (bắt cả PRINT), đổi lỗi SQL sang tiếng Việt
lib/server/action.ts     khung gọi procedure cho server action
lib/server/queries*.ts   truy vấn đọc, tách theo vai trò (không chạm bảng bị DENY)
app/actions/             server action – mỗi hàm gọi đúng một procedure
lib/roles.ts             menu và thao tác hiển thị theo vai trò
lib/theme.ts             theme MUI (màu, chữ, bảng)
app/(app)/               các màn hình sau đăng nhập
```
