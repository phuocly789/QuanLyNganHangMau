// Báo cáo (mục 3 trong QuanLyNganHangMau.sql) và dữ liệu cho màn hình Quản trị.
// Câu lệnh giữ nguyên như trong script gốc.
import { exec, query, type Session } from './db';
import type { LoaiChePham, TenNhomMau } from '@/lib/types';

export { tonKhoTheoNhom } from './queries';

// 3.1 phần B – chi tiết tồn kho theo ngân hàng máu
export interface TonKhoNganHangRow {
  TenNganHangMau: string;
  TenNhomMau: TenNhomMau;
  LoaiChePham: LoaiChePham;
  SoTui: number;
  TheTich_ml: number;
}

export function tonKhoTheoNganHang(s: Session) {
  return query<TonKhoNganHangRow>(
    s,
    `SELECT NHM.TenNganHangMau, NM.TenNhomMau, CPM.LoaiChePham,
            COUNT(CPM.MaChePham) AS SoTui, SUM(CPM.TheTich) AS TheTich_ml
     FROM ChePhamMau CPM
     INNER JOIN DonViMau DVM ON CPM.MaDonViMau = DVM.MaDonViMau
     INNER JOIN NhomMau NM ON DVM.MaNhomMau = NM.MaNhomMau
     INNER JOIN ViTriLuuTru VTLT ON CPM.MaViTri = VTLT.MaViTri
     INNER JOIN NganHangMau NHM ON VTLT.MaNganHangMau = NHM.MaNganHangMau
     WHERE CPM.TrangThai = N'Đang lưu trữ'
       AND CPM.HanSuDung >= CAST(GETDATE() AS DATE)
     GROUP BY NHM.TenNganHangMau, NM.MaNhomMau, NM.TenNhomMau, CPM.LoaiChePham
     ORDER BY NHM.TenNganHangMau, NM.MaNhomMau, CPM.LoaiChePham`,
  );
}

// 3.2 – sp_BaoCaoChePhamSapHetHan
export interface SapHetHanRow {
  MaChePham: number;
  LoaiChePham: LoaiChePham;
  TenNhomMau: TenNhomMau | null;
  TheTich: number;
  NgayTachChePham: string;
  HanSuDung: string;
  SoNgayConLai: number;
  TenViTri: string;
  TenNganHangMau: string;
  TrangThai: string;
}

export async function baoCaoSapHetHan(s: Session, soNgay: number) {
  const r = await exec<SapHetHanRow>(s, 'sp_BaoCaoChePhamSapHetHan', { SoNgayCanhBao: soNgay });
  return r.rows;
}

// 3.3 – sp_BaoCaoKetQuaDotHienMau
export interface KetQuaDotRow {
  MaDot: number;
  TenDot: string;
  NgayBD: string;
  NgayKT: string;
  DiaDiem: string | null;
  TrangThaiDot: string;
  TongLuotDangKy: number;
  SoLuotHienThanhCong: number;
  SoLuotKhongDat: number;
  TongLuongMauThuDuoc_ml: number;
  Nhom_O_Pos_ml: number;
  Nhom_A_Pos_ml: number;
  Nhom_B_Pos_ml: number;
  Nhom_AB_Pos_ml: number;
  Nhom_O_Neg_ml: number;
  Nhom_A_Neg_ml: number;
  Nhom_B_Neg_ml: number;
  Nhom_AB_Neg_ml: number;
}

export async function baoCaoKetQuaDot(s: Session, maDot: number | null) {
  const r = await exec<KetQuaDotRow>(s, 'sp_BaoCaoKetQuaDotHienMau', { MaDot: maDot });
  return r.rows;
}

// 3.4 – yêu cầu và tình trạng đáp ứng
export interface DapUngRow {
  MaYeuCau: number;
  TenBenhNhan: string;
  TenKhoa: string;
  TenNhomMau: TenNhomMau;
  LoaiChePhamYeuCau: LoaiChePham;
  TheTichYeuCau_ml: number;
  SoTuiDaPhanBo: number;
  TheTichDaPhanBo_ml: number;
  TheTichConThieu_ml: number;
  MucDoUuTien: string;
  NgayYeuCau: string;
  TrangThai: string;
}

export function baoCaoDapUng(s: Session) {
  return query<DapUngRow>(
    s,
    `SELECT YC.MaYeuCau, BN.HoTen AS TenBenhNhan, K.TenKhoa, NM.TenNhomMau, YC.LoaiChePhamYeuCau,
            YC.SoLuongYeuCau AS TheTichYeuCau_ml,
            COUNT(PB.MaPhanBo) AS SoTuiDaPhanBo,
            ISNULL(SUM(CPM.TheTich), 0) AS TheTichDaPhanBo_ml,
            CASE WHEN YC.SoLuongYeuCau > ISNULL(SUM(CPM.TheTich), 0)
                 THEN YC.SoLuongYeuCau - ISNULL(SUM(CPM.TheTich), 0) ELSE 0 END AS TheTichConThieu_ml,
            YC.MucDoUuTien, YC.NgayYeuCau, YC.TrangThai
     FROM YeuCauCapMau YC
     INNER JOIN BenhNhan BN ON YC.MaBenhNhan = BN.MaBenhNhan
     INNER JOIN Khoa K ON YC.MaKhoa = K.MaKhoa
     INNER JOIN NhomMau NM ON YC.MaNhomMauYeuCau = NM.MaNhomMau
     LEFT JOIN PhanBoMau PB ON YC.MaYeuCau = PB.MaYeuCau AND PB.TrangThai IN (N'Đã phân bổ', N'Đã xuất')
     LEFT JOIN ChePhamMau CPM ON PB.MaChePham = CPM.MaChePham
     GROUP BY YC.MaYeuCau, BN.HoTen, K.TenKhoa, NM.TenNhomMau, YC.LoaiChePhamYeuCau,
              YC.SoLuongYeuCau, YC.MucDoUuTien, YC.NgayYeuCau, YC.TrangThai
     ORDER BY YC.NgayYeuCau DESC`,
  );
}

// 3.5 – tình hình truyền máu
export interface TinhHinhTruyenRow {
  MaYeuCau: number;
  TenNhomMau: TenNhomMau;
  LoaiChePhamYeuCau: LoaiChePham;
  TheTichYeuCau_ml: number;
  TrangThaiYeuCau: string;
  MaPhanBo: number | null;
  TrangThaiPhanBo: string | null;
  LyDoHuy: string | null;
  MaChePham: number | null;
  MaTruyenMau: string | null;
  NgayGioBatDau: string | null;
  NgayGioKetThuc: string | null;
  TheTichTruyen: number | null;
  TrangThaiTruyen: string;
  PhanUngPhu: string;
}

export function baoCaoTruyenMau(s: Session) {
  return query<TinhHinhTruyenRow>(
    s,
    `SELECT YCCM.MaYeuCau, NM.TenNhomMau, YCCM.LoaiChePhamYeuCau, YCCM.SoLuongYeuCau AS TheTichYeuCau_ml,
            YCCM.TrangThai AS TrangThaiYeuCau, PBM.MaPhanBo, PBM.TrangThai AS TrangThaiPhanBo, PBM.LyDoHuy,
            CPM.MaChePham, TM.MaTruyenMau, TM.NgayGioBatDau, TM.NgayGioKetThuc, TM.TheTichTruyen,
            ISNULL(TM.TrangThai, N'Chưa truyền') AS TrangThaiTruyen,
            ISNULL(TM.PhanUngPhu, N'') AS PhanUngPhu
     FROM YeuCauCapMau YCCM
     INNER JOIN NhomMau NM ON NM.MaNhomMau = YCCM.MaNhomMauYeuCau
     LEFT JOIN PhanBoMau PBM ON YCCM.MaYeuCau = PBM.MaYeuCau
     LEFT JOIN ChePhamMau CPM ON PBM.MaChePham = CPM.MaChePham
     LEFT JOIN TruyenMau TM ON PBM.MaPhanBo = TM.MaPhanBo
     ORDER BY YCCM.MaYeuCau DESC, PBM.MaPhanBo`,
  );
}

export function dsDotDonGian(s: Session) {
  return query<{ MaDot: number; TenDot: string; NgayBD: string }>(s, `SELECT MaDot, TenDot, NgayBD FROM DotHienMau ORDER BY NgayBD DESC`);
}

// ---------------------------------------------------------------- Quản trị

export interface ExportRow {
  MaChePham: number;
  MaDonViMau: number;
  TenNhomMau: TenNhomMau;
  LoaiChePham: LoaiChePham;
  TheTich: number;
  NgayTachChePham: string;
  HanSuDung: string;
  TenViTri: string;
  TrangThai: string;
}

/** View v_ExportTonKhoChePham – dữ liệu mà sp_ExportTonKhoChePhamCSV xuất ra file */
export function xemTruocExport(s: Session) {
  return query<ExportRow>(s, `SELECT * FROM v_ExportTonKhoChePham ORDER BY HanSuDung`);
}

/** Thư mục sao lưu mặc định của SQL Server – luôn tồn tại và dịch vụ SQL Server có quyền ghi */
export async function thuMucSaoLuuMacDinh(s: Session): Promise<string | null> {
  const [r] = await query<{ ThuMuc: string | null }>(
    s,
    `SELECT CAST(SERVERPROPERTY('InstanceDefaultBackupPath') AS NVARCHAR(400)) AS ThuMuc`,
  );
  return r?.ThuMuc ?? null;
}

export interface LichSuBackupRow {
  MaBackup: number;
  ThoiGianBackup: string;
  NguoiThucHien: string;
  DuongDanFile: string;
  TrangThai: string;
  GhiChu: string | null;
}

export function dsLichSuBackup(s: Session) {
  return query<LichSuBackupRow>(
    s,
    `SELECT MaBackup, ThoiGianBackup, NguoiThucHien, DuongDanFile, TrangThai, GhiChu
     FROM LichSuBackup ORDER BY ThoiGianBackup DESC`,
  );
}

export interface LichSuRestoreRow {
  MaRestore: number;
  ThoiGianRestore: string;
  NguoiThucHien: string;
  DuongDanFileNguon: string;
  TrangThai: string;
  GhiChu: string | null;
}

export function dsLichSuRestore(s: Session) {
  return query<LichSuRestoreRow>(
    s,
    `SELECT MaRestore, ThoiGianRestore, NguoiThucHien, DuongDanFileNguon, TrangThai, GhiChu
     FROM LichSuRestore ORDER BY ThoiGianRestore DESC`,
  );
}
