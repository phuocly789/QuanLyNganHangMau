// Kiểu dữ liệu khớp 1-1 với các bảng trong QuanLyNganHangMau.sql.
// Ngày lưu dạng chuỗi ISO ('YYYY-MM-DD' hoặc 'YYYY-MM-DDTHH:mm:ss') như JSON trả về từ API.

export type TenNhomMau = 'O+' | 'A+' | 'B+' | 'AB+' | 'O-' | 'A-' | 'B-' | 'AB-';

export const LOAI_CHE_PHAM = [
  'Khối hồng cầu',
  'Huyết tương tươi đông lạnh',
  'Khối tiểu cầu',
  'Tủa lạnh',
] as const;
export type LoaiChePham = (typeof LOAI_CHE_PHAM)[number];

export interface NhomMau {
  MaNhomMau: number;
  TenNhomMau: TenNhomMau;
  MoTa: string | null;
}

export interface NganHangMau {
  MaNganHangMau: number;
  TenNganHangMau: string;
  DiaChi: string;
  SoDienThoai: string;
  Email: string | null;
  NguoiQuanLy: string;
  SucChuaToiDa: number;
  LuongMauHienTai: number;
  TrangThai: 'Hoạt động' | 'Bảo trì' | 'Ngừng hoạt động';
  GhiChuNganHangMau: string | null;
}

export interface ViTriLuuTru {
  MaViTri: number;
  MaNganHangMau: number;
  TenViTri: string;
  LoaiLuuTru: 'Tủ lạnh' | 'Ngăn đông' | 'Kho huyết tương' | 'Kho tiểu cầu';
  NhietDoBaoQuan: number;
  SucChua: number;
  LuongHienTai: number;
  TrangThai: 'Còn chỗ' | 'Đầy' | 'Bảo trì' | 'Không sử dụng';
  GhiChu: string | null;
}

export type TrangThaiDonViMau =
  | 'Chờ xét nghiệm'
  | 'Đạt chuẩn'
  | 'Không đạt'
  | 'Đã tách chế phẩm'
  | 'Đã phân bổ'
  | 'Đã xuất kho'
  | 'Đã truyền'
  | 'Hết hạn'
  | 'Đã tiêu hủy';

export interface DonViMau {
  MaDonViMau: number;
  MaLanHien: number;
  MaNhomMau: number | null;
  MaViTri: number | null;
  TheTich: number;
  NgayThuThap: string;
  NgayHetHan: string;
  PhuongPhap: string | null;
  TrangThai: TrangThaiDonViMau;
  GhiChu: string | null;
}

export type TrangThaiChePham = 'Đang lưu trữ' | 'Đã cấp phát' | 'Đã sử dụng' | 'Hết hạn' | 'Đã hủy';

export interface ChePhamMau {
  MaChePham: number;
  MaDonViMau: number;
  MaViTri: number | null;
  LoaiChePham: LoaiChePham;
  TheTich: number;
  NgayTachChePham: string;
  HanSuDung: string;
  TrangThai: TrangThaiChePham;
  GhiChu: string | null;
}

export type LoaiGiaoDich =
  | 'Nhập kho'
  | 'Xuất kho'
  | 'Điều chuyển nội bộ'
  | 'Kiểm kê'
  | 'Tiêu hủy'
  | 'Trả lại kho';

export interface LichSuKho {
  MaGiaoDich: number;
  MaChePham: number;
  MaViTriCu: number | null;
  MaViTriMoi: number | null;
  LoaiGiaoDich: LoaiGiaoDich;
  SoLuongThayDoi: number;
  NgayGioGiaoDich: string;
  NguoiThucHien: string | null;
  TrangThai: 'Đang xử lý' | 'Hoàn tất' | 'Đã hủy';
  GhiChu: string | null;
}

export interface BenhVien {
  MaBenhVien: number;
  TenBenhVien: string;
  DiaChi: string | null;
  SoDienThoai: string | null;
}

export interface Khoa {
  MaKhoa: number;
  MaBenhVien: number;
  TenKhoa: string;
}

export interface BenhNhan {
  MaBenhNhan: number;
  MaKhoa: number;
  MaNhomMau: number;
  HoTen: string;
  NgaySinh: string;
  GioiTinh: 'Nam' | 'Nữ';
  ChanDoanBinhLy: string | null;
}

export type TrangThaiYeuCau = 'Chờ xử lý' | 'Đã duyệt' | 'Đã phân bổ' | 'Hoàn tất' | 'Từ chối';

export interface YeuCauCapMau {
  MaYeuCau: number;
  MaBenhNhan: number;
  MaKhoa: number;
  MaNhomMauYeuCau: number;
  NgayYeuCau: string;
  LoaiChePhamYeuCau: LoaiChePham;
  /** Thể tích yêu cầu, đơn vị ml */
  SoLuongYeuCau: number;
  MucDoUuTien: 'Cấp cứu' | 'Bình thường';
  TrangThai: TrangThaiYeuCau;
  BacSiChiDinh: string | null;
}

export type TrangThaiPhanBo = 'Đã phân bổ' | 'Đã xuất' | 'Đã hủy';

export interface PhanBoMau {
  MaPhanBo: number;
  MaYeuCau: number;
  MaChePham: number;
  ThoiGianPhanBo: string;
  TrangThai: TrangThaiPhanBo;
  GhiChu: string | null;
  LyDoHuy: string | null;
  NgayGioHuy: string | null;
}

export type TrangThaiTruyenMau = 'Đang thực hiện' | 'Hoàn thành' | 'Đã hủy';

export interface TruyenMau {
  MaTruyenMau: string;
  MaPhanBo: number;
  NgayGioBatDau: string;
  NgayGioKetThuc: string | null;
  NguoiThucHien: string;
  TheTichTruyen: number | null;
  PhanUngPhu: string | null;
  TrangThai: TrangThaiTruyenMau;
}

/** Thứ tự 8 nhóm máu theo MaNhomMau 1..8 trong bảng NhomMau */
export const NHOM_MAU: TenNhomMau[] = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

/** Kết quả một thao tác ghi; field = tên trường để hiện lỗi ngay dưới trường đó */
export type KetQua = { ok: boolean; message: string; field?: string };
