// Truy vấn đọc: Hiến máu, Xét nghiệm, Truyền máu, Bệnh nhân.
import { query, type Session } from './db';
import type { LoaiChePham, TenNhomMau, TrangThaiDonViMau } from '@/lib/types';

// ---------------------------------------------------------------- Hiến máu

export interface NguoiHienRow {
  MaNguoiHien: number;
  HoTen: string;
  NgaySinh: string;
  /** dbo.fn_TinhTuoi(NgaySinh, hôm nay) */
  Tuoi: number | null;
  GioiTinh: string;
  CCCD: string;
  SoDienThoai: string | null;
  DiaChi: string | null;
  TenNhomMau: TenNhomMau | null;
  /** Lần 'Đã hiến' gần nhất – sp_TiepNhanLanHienMau dùng mốc này để kiểm tra 84 ngày */
  NgayHienGanNhat: string | null;
}

export function dsNguoiHien(s: Session) {
  return query<NguoiHienRow>(
    s,
    `SELECT n.MaNguoiHien, n.HoTen, n.NgaySinh, dbo.fn_TinhTuoi(n.NgaySinh, NULL) AS Tuoi,
            n.GioiTinh, n.CCCD, n.SoDienThoai, n.DiaChi, nm.TenNhomMau,
            (SELECT MAX(l.NgayHien) FROM LanHienMau l
             WHERE l.MaNguoiHien = n.MaNguoiHien AND l.TrangThai = N'Đã hiến') AS NgayHienGanNhat
     FROM NguoiHienMau n LEFT JOIN NhomMau nm ON nm.MaNhomMau = n.MaNhomMau
     ORDER BY n.MaNguoiHien`,
  );
}

export interface LanHienRow {
  MaLanHien: number;
  MaNguoiHien: number;
  HoTen: string;
  TenNhomMau: TenNhomMau | null;
  MaDot: number;
  TenDot: string;
  NgayHien: string;
  ThoiGianHien: string | null;
  LuongMau: number;
  LoaiHienMau: string;
  KetQuaKham: string | null;
  TrangThai: string;
  GhiChu: string | null;
  /** Đơn vị máu tạo cùng lần hiến (sp_TiepNhanLanHienMau) */
  MaDonViMau: number | null;
}

export function dsLanHien(s: Session) {
  return query<LanHienRow>(
    s,
    `SELECT l.MaLanHien, l.MaNguoiHien, n.HoTen, nm.TenNhomMau, l.MaDot, d.TenDot, l.NgayHien, l.ThoiGianHien,
            l.LuongMau, l.LoaiHienMau, l.KetQuaKham, l.TrangThai, l.GhiChu,
            (SELECT TOP 1 dv.MaDonViMau FROM DonViMau dv WHERE dv.MaLanHien = l.MaLanHien) AS MaDonViMau
     FROM LanHienMau l
     JOIN NguoiHienMau n ON n.MaNguoiHien = l.MaNguoiHien
     LEFT JOIN NhomMau nm ON nm.MaNhomMau = n.MaNhomMau
     JOIN DotHienMau d ON d.MaDot = l.MaDot
     ORDER BY l.NgayHien DESC, l.MaLanHien DESC`,
  );
}

export interface DotRow {
  MaDot: number;
  TenDot: string;
  NgayBD: string;
  NgayKT: string;
  DiaDiem: string | null;
  TrangThai: string;
  SoLuot: number;
  TongMl: number;
}

export function dsDot(s: Session) {
  return query<DotRow>(
    s,
    `SELECT d.MaDot, d.TenDot, d.NgayBD, d.NgayKT, d.DiaDiem, d.TrangThai,
            COUNT(l.MaLanHien) AS SoLuot,
            ISNULL(SUM(CASE WHEN l.TrangThai = N'Đã hiến' THEN l.LuongMau END), 0) AS TongMl
     FROM DotHienMau d LEFT JOIN LanHienMau l ON l.MaDot = d.MaDot
     GROUP BY d.MaDot, d.TenDot, d.NgayBD, d.NgayKT, d.DiaDiem, d.TrangThai
     ORDER BY d.NgayBD DESC`,
  );
}

// ---------------------------------------------------------------- Xét nghiệm

export interface DonViMauRow {
  MaDonViMau: number;
  MaLanHien: number;
  TenNhomMau: TenNhomMau | null;
  TheTich: number;
  NgayThuThap: string;
  NgayHetHan: string;
  TrangThai: TrangThaiDonViMau;
  LoaiHienMau: string;
  /** Số loại xét nghiệm bắt buộc đã có kết luận Đạt */
  SoBatBuocDat: number;
  /** Có kết quả Dương tính hoặc Không đạt */
  CoKhongDat: boolean;
}

export function dsDonViMau(s: Session) {
  return query<DonViMauRow>(
    s,
    `SELECT dv.MaDonViMau, dv.MaLanHien, nm.TenNhomMau, dv.TheTich, dv.NgayThuThap, dv.NgayHetHan, dv.TrangThai, lh.LoaiHienMau,
            (SELECT COUNT(DISTINCT kq.MaLoaiXN) FROM KetQuaXetNghiem kq
             JOIN LoaiXetNghiem lx ON lx.MaLoaiXN = kq.MaLoaiXN
             WHERE kq.MaDonViMau = dv.MaDonViMau AND lx.BatBuoc = 1 AND kq.KetLuan = N'Đạt') AS SoBatBuocDat,
            CAST(CASE WHEN EXISTS (SELECT 1 FROM KetQuaXetNghiem kq WHERE kq.MaDonViMau = dv.MaDonViMau
                 AND (kq.KetQua = N'Dương tính' OR kq.KetLuan = N'Không đạt')) THEN 1 ELSE 0 END AS BIT) AS CoKhongDat
     FROM DonViMau dv
     JOIN LanHienMau lh ON lh.MaLanHien = dv.MaLanHien
     LEFT JOIN NhomMau nm ON nm.MaNhomMau = dv.MaNhomMau
     ORDER BY CASE WHEN dv.TrangThai = N'Chờ xét nghiệm' THEN 0 ELSE 1 END, dv.NgayThuThap DESC`,
  );
}

export interface LoaiXetNghiemRow {
  MaLoaiXN: number;
  TenLoaiXN: string;
  NguongDat: string | null;
  BatBuoc: boolean;
  ThoiGianTraKQ: number;
  TrangThai: string;
}

export function dsLoaiXetNghiem(s: Session) {
  return query<LoaiXetNghiemRow>(
    s,
    `SELECT MaLoaiXN, TenLoaiXN, NguongDat, BatBuoc, ThoiGianTraKQ, TrangThai
     FROM LoaiXetNghiem ORDER BY BatBuoc DESC, MaLoaiXN`,
  );
}

export interface KetQuaXNRow {
  MaXetNghiem: number;
  MaLoaiXN: number;
  TenLoaiXN: string;
  BatBuoc: boolean;
  NgayXetNghiem: string;
  ThoiGianTraKQ: string | null;
  NguoiThucHien: string | null;
  GiaTriDo: number | null;
  KetQua: string;
  KetLuan: string;
}

export function ketQuaCuaDonVi(s: Session, maDonViMau: number) {
  return query<KetQuaXNRow>(
    s,
    `SELECT kq.MaXetNghiem, kq.MaLoaiXN, lx.TenLoaiXN, lx.BatBuoc, kq.NgayXetNghiem, kq.ThoiGianTraKQ,
            kq.NguoiThucHien, kq.GiaTriDo, kq.KetQua, kq.KetLuan
     FROM KetQuaXetNghiem kq JOIN LoaiXetNghiem lx ON lx.MaLoaiXN = kq.MaLoaiXN
     WHERE kq.MaDonViMau = @id
     ORDER BY kq.NgayXetNghiem DESC, kq.MaXetNghiem DESC`,
    { id: maDonViMau },
  );
}

export interface ChePhamCuaDonViRow {
  MaChePham: number;
  LoaiChePham: LoaiChePham;
  TheTich: number;
  NgayTachChePham: string;
  HanSuDung: string;
  TrangThai: string;
  TenViTri: string | null;
}

/** Các chế phẩm đã tách từ một đơn vị máu (sp_TachChePham) */
export function chePhamCuaDonVi(s: Session, maDonViMau: number) {
  return query<ChePhamCuaDonViRow>(
    s,
    `SELECT cp.MaChePham, cp.LoaiChePham, cp.TheTich, cp.NgayTachChePham, cp.HanSuDung, cp.TrangThai, vt.TenViTri
     FROM ChePhamMau cp LEFT JOIN ViTriLuuTru vt ON vt.MaViTri = cp.MaViTri
     WHERE cp.MaDonViMau = @id ORDER BY cp.MaChePham`,
    { id: maDonViMau },
  );
}

// ---------------------------------------------------------------- Truyền máu

export interface PhanBoChoTruyenRow {
  MaPhanBo: number;
  MaYeuCau: number;
  MaChePham: number;
  TrangThai: string;
  ThoiGianPhanBo: string;
  LoaiChePham: LoaiChePham;
  TheTich: number;
  TenNhomMau: TenNhomMau | null;
  HoTenBenhNhan: string;
  TenKhoa: string;
}

/** Phân bổ còn hiệu lực chưa có ca truyền – đầu vào cho sp_GhiNhanTruyenMau */
export function dsPhanBoChoTruyen(s: Session) {
  return query<PhanBoChoTruyenRow>(
    s,
    `SELECT p.MaPhanBo, p.MaYeuCau, p.MaChePham, p.TrangThai, p.ThoiGianPhanBo,
            cp.LoaiChePham, cp.TheTich, nm.TenNhomMau, bn.HoTen AS HoTenBenhNhan, k.TenKhoa
     FROM PhanBoMau p
     JOIN ChePhamMau cp ON cp.MaChePham = p.MaChePham
     JOIN DonViMau dv ON dv.MaDonViMau = cp.MaDonViMau
     LEFT JOIN NhomMau nm ON nm.MaNhomMau = dv.MaNhomMau
     JOIN YeuCauCapMau y ON y.MaYeuCau = p.MaYeuCau
     JOIN BenhNhan bn ON bn.MaBenhNhan = y.MaBenhNhan
     JOIN Khoa k ON k.MaKhoa = y.MaKhoa
     WHERE p.TrangThai IN (N'Đã phân bổ', N'Đã xuất')
       AND NOT EXISTS (SELECT 1 FROM TruyenMau t WHERE t.MaPhanBo = p.MaPhanBo)
     ORDER BY p.ThoiGianPhanBo`,
  );
}

export interface TruyenMauRow {
  MaTruyenMau: string;
  MaPhanBo: number;
  MaYeuCau: number;
  MaChePham: number;
  TenNhomMau: TenNhomMau | null;
  LoaiChePham: LoaiChePham;
  HoTenBenhNhan: string;
  NgayGioBatDau: string;
  NgayGioKetThuc: string | null;
  NguoiThucHien: string;
  TheTichTruyen: number | null;
  PhanUngPhu: string | null;
  TrangThai: string;
}

export function dsTruyenMau(s: Session) {
  return query<TruyenMauRow>(
    s,
    `SELECT t.MaTruyenMau, t.MaPhanBo, p.MaYeuCau, p.MaChePham, nm.TenNhomMau, cp.LoaiChePham,
            bn.HoTen AS HoTenBenhNhan, t.NgayGioBatDau, t.NgayGioKetThuc, t.NguoiThucHien,
            t.TheTichTruyen, t.PhanUngPhu, t.TrangThai
     FROM TruyenMau t
     JOIN PhanBoMau p ON p.MaPhanBo = t.MaPhanBo
     JOIN ChePhamMau cp ON cp.MaChePham = p.MaChePham
     JOIN DonViMau dv ON dv.MaDonViMau = cp.MaDonViMau
     LEFT JOIN NhomMau nm ON nm.MaNhomMau = dv.MaNhomMau
     JOIN YeuCauCapMau y ON y.MaYeuCau = p.MaYeuCau
     JOIN BenhNhan bn ON bn.MaBenhNhan = y.MaBenhNhan
     ORDER BY t.NgayGioBatDau DESC`,
  );
}

/** Mã ca truyền kế tiếp theo mẫu đang có (TM001, TM002…) – sp_GhiNhanTruyenMau nhận mã từ bên gọi */
export async function maTruyenMauKeTiep(s: Session) {
  const [r] = await query<{ SoLonNhat: number | null }>(
    s,
    `SELECT MAX(TRY_CAST(SUBSTRING(MaTruyenMau, 3, 18) AS INT)) AS SoLonNhat
     FROM TruyenMau WHERE MaTruyenMau LIKE 'TM%'`,
  );
  return `TM${String((r?.SoLonNhat ?? 0) + 1).padStart(3, '0')}`;
}

// ---------------------------------------------------------------- Bệnh nhân

export interface BenhNhanRow {
  MaBenhNhan: number;
  HoTen: string;
  NgaySinh: string;
  /** dbo.fn_TinhTuoi */
  Tuoi: number | null;
  GioiTinh: string;
  TenNhomMau: TenNhomMau;
  TenKhoa: string;
  TenBenhVien: string;
  ChanDoanBinhLy: string | null;
  SoYeuCau: number;
}

export function dsBenhNhan(s: Session) {
  return query<BenhNhanRow>(
    s,
    `SELECT bn.MaBenhNhan, bn.HoTen, bn.NgaySinh, dbo.fn_TinhTuoi(bn.NgaySinh, NULL) AS Tuoi, bn.GioiTinh,
            nm.TenNhomMau, k.TenKhoa, bv.TenBenhVien, bn.ChanDoanBinhLy,
            (SELECT COUNT(*) FROM YeuCauCapMau y WHERE y.MaBenhNhan = bn.MaBenhNhan) AS SoYeuCau
     FROM BenhNhan bn
     JOIN NhomMau nm ON nm.MaNhomMau = bn.MaNhomMau
     JOIN Khoa k ON k.MaKhoa = bn.MaKhoa
     JOIN BenhVien bv ON bv.MaBenhVien = k.MaBenhVien
     ORDER BY bn.MaBenhNhan`,
  );
}
