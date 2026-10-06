// Truy vấn đọc: Kho máu và Yêu cầu cấp máu.
// Câu lệnh tách theo vai trò để không chạm vào bảng bị DENY (nhân viên không được SELECT BenhNhan, TruyenMau).
import { can } from '@/lib/roles';
import { query, type Session } from './db';
import type {
  ChePhamMau,
  LichSuKho,
  LoaiChePham,
  NganHangMau,
  PhanBoMau,
  TenNhomMau,
  TruyenMau,
  ViTriLuuTru,
  YeuCauCapMau,
} from '@/lib/types';

// ---------------------------------------------------------------- Kho máu

export interface TonKhoRow {
  MaNhomMau: number;
  TenNhomMau: TenNhomMau;
  LoaiChePham: LoaiChePham;
  SoTui: number;
  TheTich_ml: number;
}

/** Mục 3.1 phần A – tồn kho theo nhóm máu và loại chế phẩm (đủ 32 dòng) */
export function tonKhoTheoNhom(s: Session) {
  return query<TonKhoRow>(
    s,
    `WITH TonKho AS (
       SELECT DVM.MaNhomMau, CPM.LoaiChePham, CPM.TheTich
       FROM ChePhamMau CPM
       INNER JOIN DonViMau DVM ON CPM.MaDonViMau = DVM.MaDonViMau
       WHERE CPM.TrangThai = N'Đang lưu trữ'
         AND CPM.HanSuDung >= CAST(GETDATE() AS DATE)
     )
     SELECT NM.MaNhomMau, NM.TenNhomMau, LCP.LoaiChePham,
            COUNT(TK.TheTich) AS SoTui, ISNULL(SUM(TK.TheTich), 0) AS TheTich_ml
     FROM NhomMau NM
     CROSS JOIN (VALUES (1, N'Khối hồng cầu'), (2, N'Huyết tương tươi đông lạnh'),
                        (3, N'Khối tiểu cầu'), (4, N'Tủa lạnh')) AS LCP(ThuTu, LoaiChePham)
     LEFT JOIN TonKho TK ON TK.MaNhomMau = NM.MaNhomMau AND TK.LoaiChePham = LCP.LoaiChePham
     GROUP BY NM.MaNhomMau, NM.TenNhomMau, LCP.ThuTu, LCP.LoaiChePham
     ORDER BY NM.MaNhomMau, LCP.ThuTu`,
  );
}

export type ChePhamRow = ChePhamMau & {
  TenNhomMau: TenNhomMau | null;
  TenViTri: string | null;
  MaNganHangMau: number | null;
  TenNganHangMau: string | null;
};

export function dsChePham(s: Session) {
  return query<ChePhamRow>(
    s,
    `SELECT cp.MaChePham, cp.MaDonViMau, cp.MaViTri, cp.LoaiChePham, cp.TheTich,
            cp.NgayTachChePham, cp.HanSuDung, cp.TrangThai, cp.GhiChu,
            nm.TenNhomMau, vt.TenViTri, nh.MaNganHangMau, nh.TenNganHangMau
     FROM ChePhamMau cp
     JOIN DonViMau dv ON dv.MaDonViMau = cp.MaDonViMau
     LEFT JOIN NhomMau nm ON nm.MaNhomMau = dv.MaNhomMau
     LEFT JOIN ViTriLuuTru vt ON vt.MaViTri = cp.MaViTri
     LEFT JOIN NganHangMau nh ON nh.MaNganHangMau = vt.MaNganHangMau
     ORDER BY cp.HanSuDung, cp.MaChePham`,
  );
}

export type ViTriRow = ViTriLuuTru & { TenNganHangMau: string };

export function dsViTri(s: Session) {
  return query<ViTriRow>(
    s,
    `SELECT vt.*, nh.TenNganHangMau
     FROM ViTriLuuTru vt JOIN NganHangMau nh ON nh.MaNganHangMau = vt.MaNganHangMau
     ORDER BY nh.TenNganHangMau, vt.TenViTri`,
  );
}

export function dsNganHang(s: Session) {
  return query<Pick<NganHangMau, 'MaNganHangMau' | 'TenNganHangMau'>>(
    s,
    `SELECT MaNganHangMau, TenNganHangMau FROM NganHangMau ORDER BY TenNganHangMau`,
  );
}

export type LichSuKhoRow = LichSuKho & {
  LoaiChePham: LoaiChePham;
  TenNhomMau: TenNhomMau | null;
  TenViTriCu: string | null;
  TenViTriMoi: string | null;
};

export function dsLichSuKho(s: Session) {
  return query<LichSuKhoRow>(
    s,
    `SELECT ls.*, cp.LoaiChePham, nm.TenNhomMau, vc.TenViTri AS TenViTriCu, vm.TenViTri AS TenViTriMoi
     FROM LichSuKho ls
     JOIN ChePhamMau cp ON cp.MaChePham = ls.MaChePham
     JOIN DonViMau dv ON dv.MaDonViMau = cp.MaDonViMau
     LEFT JOIN NhomMau nm ON nm.MaNhomMau = dv.MaNhomMau
     LEFT JOIN ViTriLuuTru vc ON vc.MaViTri = ls.MaViTriCu
     LEFT JOIN ViTriLuuTru vm ON vm.MaViTri = ls.MaViTriMoi
     ORDER BY ls.NgayGioGiaoDich DESC, ls.MaGiaoDich DESC`,
  );
}

// ---------------------------------------------------------------- Yêu cầu cấp máu

export type YeuCauRow = YeuCauCapMau & {
  TenNhomMau: TenNhomMau;
  TenKhoa: string;
  TenBenhVien: string;
  /** dbo.fn_TongTheTichDaPhanBo */
  DaPhanBoMl: number;
  /** null khi vai trò không được xem bệnh nhân */
  HoTenBenhNhan: string | null;
};

function sqlYeuCau(s: Session, where = '') {
  const xemBN = can(s.role, 'xemBenhNhan');
  return `SELECT y.*, nm.TenNhomMau, k.TenKhoa, bv.TenBenhVien,
                 dbo.fn_TongTheTichDaPhanBo(y.MaYeuCau) AS DaPhanBoMl,
                 ${xemBN ? 'bn.HoTen' : 'CAST(NULL AS NVARCHAR(100))'} AS HoTenBenhNhan
          FROM YeuCauCapMau y
          JOIN NhomMau nm ON nm.MaNhomMau = y.MaNhomMauYeuCau
          JOIN Khoa k ON k.MaKhoa = y.MaKhoa
          JOIN BenhVien bv ON bv.MaBenhVien = k.MaBenhVien
          ${xemBN ? 'JOIN BenhNhan bn ON bn.MaBenhNhan = y.MaBenhNhan' : ''}
          ${where}`;
}

export function dsYeuCau(s: Session) {
  return query<YeuCauRow>(
    s,
    `${sqlYeuCau(s)}
     ORDER BY CASE WHEN y.TrangThai IN (N'Hoàn tất', N'Từ chối') THEN 1 ELSE 0 END,
              CASE WHEN y.MucDoUuTien = N'Cấp cứu' THEN 0 ELSE 1 END,
              y.NgayYeuCau DESC`,
  );
}

export interface BenhNhanChiTiet {
  MaBenhNhan: number;
  HoTen: string;
  NgaySinh: string;
  /** dbo.fn_TinhTuoi */
  Tuoi: number | null;
  GioiTinh: string;
  ChanDoanBinhLy: string | null;
  TenNhomMau: TenNhomMau;
}

export type PhanBoRow = PhanBoMau & {
  LoaiChePham: LoaiChePham;
  TheTich: number;
  HanSuDung: string;
  TenNhomMau: TenNhomMau | null;
  TenViTri: string | null;
  TenNganHangMau: string | null;
  /** dbo.fn_KiemTraTuongThich(nhóm cho, nhóm nhận, loại) */
  TuongThich: boolean;
};

export async function chiTietYeuCau(s: Session, maYeuCau: number) {
  const [yc] = await query<YeuCauRow>(s, sqlYeuCau(s, 'WHERE y.MaYeuCau = @id'), { id: maYeuCau });
  if (!yc) return null;

  const [benhNhan, phanBo, truyenMau, nhomChoPhuHop] = await Promise.all([
    can(s.role, 'xemBenhNhan')
      ? query<BenhNhanChiTiet>(
          s,
          `SELECT bn.MaBenhNhan, bn.HoTen, bn.NgaySinh, dbo.fn_TinhTuoi(bn.NgaySinh, NULL) AS Tuoi,
                  bn.GioiTinh, bn.ChanDoanBinhLy, nm.TenNhomMau
           FROM BenhNhan bn JOIN NhomMau nm ON nm.MaNhomMau = bn.MaNhomMau
           WHERE bn.MaBenhNhan = @id`,
          { id: yc.MaBenhNhan },
        ).then((r) => r[0] ?? null)
      : Promise.resolve(null),
    query<PhanBoRow>(
      s,
      `SELECT p.*, cp.LoaiChePham, cp.TheTich, cp.HanSuDung, nm.TenNhomMau, vt.TenViTri, nh.TenNganHangMau,
              dbo.fn_KiemTraTuongThich(dv.MaNhomMau, @nhan, @loai) AS TuongThich
       FROM PhanBoMau p
       JOIN ChePhamMau cp ON cp.MaChePham = p.MaChePham
       JOIN DonViMau dv ON dv.MaDonViMau = cp.MaDonViMau
       LEFT JOIN NhomMau nm ON nm.MaNhomMau = dv.MaNhomMau
       LEFT JOIN ViTriLuuTru vt ON vt.MaViTri = cp.MaViTri
       LEFT JOIN NganHangMau nh ON nh.MaNganHangMau = vt.MaNganHangMau
       WHERE p.MaYeuCau = @id
       ORDER BY p.ThoiGianPhanBo`,
      { id: maYeuCau, nhan: yc.MaNhomMauYeuCau, loai: yc.LoaiChePhamYeuCau },
    ),
    can(s.role, 'xemTruyenMau')
      ? query<TruyenMau>(
          s,
          `SELECT t.* FROM TruyenMau t JOIN PhanBoMau p ON p.MaPhanBo = t.MaPhanBo
           WHERE p.MaYeuCau = @id ORDER BY t.NgayGioBatDau`,
          { id: maYeuCau },
        )
      : Promise.resolve([] as TruyenMau[]),
    // Nhóm máu người cho phù hợp – theo dbo.fn_KiemTraTuongThich (bảng QuyTacTuongThich)
    query<{ TenNhomMau: TenNhomMau }>(
      s,
      `SELECT nm.TenNhomMau FROM NhomMau nm
       WHERE dbo.fn_KiemTraTuongThich(nm.MaNhomMau, @nhan, @loai) = 1
       ORDER BY nm.MaNhomMau`,
      { nhan: yc.MaNhomMauYeuCau, loai: yc.LoaiChePhamYeuCau },
    ).then((r) => r.map((x) => x.TenNhomMau)),
  ]);

  return { yc, benhNhan, phanBo, truyenMau, nhomChoPhuHop };
}
