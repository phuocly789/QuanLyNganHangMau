'use server';

import { chayProc } from '@/lib/server/action';
import { hoTenCua } from '@/lib/roles';
import { ma } from '@/lib/format';

const nullIfEmpty = (v: string) => (v.trim() === '' ? null : v.trim());

/** sp_TiepNhanLanHienMau – kiểm tra đủ 18 tuổi, cách lần hiến trước ≥ 84 ngày.
 *  Đủ điều kiện: tạo luôn đơn vị máu chờ xét nghiệm; không đủ: lần hiến "Không đạt".
 *  Trigger trg_LanHienMau_KiemTraTuoi kiểm tra lại tuổi khi INSERT. */
export async function tiepNhanHienMauAction(input: {
  maNguoiHien: number;
  maDot: number;
  ngayHien: string;
  gioHien: string;
  luongMau: number;
  loaiHienMau: string;
  ketQuaKham: string;
  ghiChu: string;
}) {
  return chayProc(
    'tiepNhanHienMau',
    'sp_TiepNhanLanHienMau',
    () => ({
      MaNguoiHien: input.maNguoiHien,
      MaDot: input.maDot,
      NgayHien: input.ngayHien,
      ThoiGianHien: input.gioHien ? `${input.ngayHien}T${input.gioHien}:00` : null,
      LuongMau: input.luongMau,
      LoaiHienMau: input.loaiHienMau,
      KetQuaKham: input.ketQuaKham,
      GhiChu: nullIfEmpty(input.ghiChu),
    }),
    {
      paths: ['/hien-mau', '/xet-nghiem'],
      thanhCong: ({ rows }) => {
        const maDV = rows[0]?.MaDonViMau as number | null | undefined;
        return maDV
          ? `Đã tiếp nhận lần hiến và tạo đơn vị máu ${ma.donViMau(maDV)} (chờ xét nghiệm).`
          : 'Đã ghi nhận lần hiến: không đủ điều kiện nên không lấy máu, trạng thái Không đạt.';
      },
      truongLoi: [
        [/tuổi|người hiến/i, 'nguoiHien'],
        [/84 ngày/i, 'ngayHien'],
        [/LuongMau/i, 'luongMau'],
      ],
    },
  );
}

/** sp_ImportNguoiHienMau – BULK INSERT file CSV (đường dẫn trên máy chủ SQL Server).
 *  Procedure chỉ PRINT khi lỗi nên phải đọc thông báo PRINT để biết kết quả. */
export async function importNguoiHienAction(duongDan: string) {
  if (!duongDan.trim()) return { ok: false, message: 'Nhập đường dẫn file CSV.', field: 'filePath' };
  return chayProc('importNguoiHien', 'sp_ImportNguoiHienMau', () => ({ FilePath: duongDan.trim() }), {
    paths: ['/hien-mau'],
    thanhCong: ({ prints }) => prints.at(-1) ?? 'Import dữ liệu Người hiến máu thành công!',
    loiTuPrint: /^Lỗi/i,
  });
}

/** sp_CapNhatKetQuaXetNghiem – ghi kết quả, tự đánh giá DonViMau Đạt chuẩn / Không đạt.
 *  Kết quả không đạt về muộn: procedure thu hồi chế phẩm đã tách và hủy phân bổ chưa truyền. */
export async function nhapKetQuaXetNghiemAction(input: {
  maDonViMau: number;
  maLoaiXN: number;
  ngayXetNghiem: string;
  thoiGianTraKQ: string;
  giaTriDo: string;
  ketQua: string;
  ketLuan: string;
}) {
  return chayProc(
    'nhapXetNghiem',
    'sp_CapNhatKetQuaXetNghiem',
    (s) => ({
      MaDonViMau: String(input.maDonViMau),
      MaLoaiXN: input.maLoaiXN,
      NgayXetNghiem: `${input.ngayXetNghiem}:00`,
      ThoiGianTraKQ: `${input.thoiGianTraKQ}:00`,
      NguoiThucHien: hoTenCua(s.username),
      GiaTriDo: input.giaTriDo.trim() === '' ? null : Number(input.giaTriDo),
      KetQua: input.ketQua,
      KetLuan: input.ketLuan,
    }),
    {
      paths: ['/xet-nghiem', '/kho-mau', '/yeu-cau'],
      thanhCong: ({ rows }) => {
        const r = rows[0] ?? {};
        const thuHoi = Number(r.SoChePhamThuHoi ?? 0);
        const huyPB = Number(r.SoPhanBoHuy ?? 0);
        const daTruyen = Number(r.SoChePhamDaTruyen ?? 0);
        let msg = `Đã lưu kết quả xét nghiệm cho ${ma.donViMau(input.maDonViMau)}; trạng thái đơn vị máu được đánh giá lại.`;
        if (thuHoi || huyPB) msg += ` Đơn vị không đạt: đã thu hồi ${thuHoi} chế phẩm và hủy ${huyPB} phân bổ chưa truyền.`;
        if (daTruyen) msg += ` CẢNH BÁO: ${daTruyen} chế phẩm từ đơn vị này đã được truyền, cần báo cáo sự cố truyền máu.`;
        return msg;
      },
      truongLoi: [[/trả kết quả/i, 'thoiGianTraKQ']],
    },
  );
}

/** sp_TachChePham – tách một loại chế phẩm từ đơn vị máu đạt chuẩn; chế phẩm mới chờ nhập kho */
export async function tachChePhamAction(input: { maDonViMau: number; loaiChePham: string; theTich: number; ghiChu: string }) {
  return chayProc(
    'tachChePham',
    'sp_TachChePham',
    () => ({
      MaDonViMau: input.maDonViMau,
      LoaiChePham: input.loaiChePham,
      TheTich: input.theTich,
      GhiChu: nullIfEmpty(input.ghiChu),
    }),
    {
      paths: ['/xet-nghiem', '/kho-mau'],
      thanhCong: ({ rows }) => {
        const maCP = rows[0]?.MaChePham as number | undefined;
        return maCP
          ? `Đã tách ${ma.chePham(maCP)} (${input.loaiChePham}, ${input.theTich} ml). Chế phẩm đang chờ nhập kho.`
          : 'Đã tách chế phẩm.';
      },
      truongLoi: [
        [/thể tích/i, 'theTich'],
        [/loại chế phẩm|thời hạn/i, 'loaiChePham'],
      ],
    },
  );
}

/** sp_GhiNhanTruyenMau – khi Hoàn thành: chế phẩm Đã sử dụng, yêu cầu Hoàn tất, trừ kho, ghi LichSuKho.
 *  Trigger trg_TruyenMau_CapNhatChePham chạy kèm. */
export async function ghiNhanTruyenMauAction(input: {
  maTruyenMau: string;
  maPhanBo: number;
  batDau: string;
  ketThuc: string;
  nguoiThucHien: string;
  theTich: string;
  phanUngPhu: string;
  trangThai: string;
}) {
  return chayProc(
    'ghiNhanTruyenMau',
    'sp_GhiNhanTruyenMau',
    () => ({
      MaTruyenMau: input.maTruyenMau.trim(),
      MaPhanBo: input.maPhanBo,
      NgayGioBatDau: `${input.batDau}:00`,
      NgayGioKetThuc: input.ketThuc ? `${input.ketThuc}:00` : null,
      NguoiThucHien: input.nguoiThucHien.trim(),
      TheTichTruyen: input.theTich.trim() === '' ? null : Number(input.theTich),
      PhanUngPhu: nullIfEmpty(input.phanUngPhu),
      TrangThai: input.trangThai,
    }),
    {
      paths: ['/truyen-mau', '/yeu-cau', '/kho-mau'],
      thanhCong: () =>
        input.trangThai === 'Hoàn thành'
          ? `Đã ghi nhận ca ${input.maTruyenMau.trim()}. Chế phẩm chuyển sang Đã sử dụng, yêu cầu chuyển sang Hoàn tất.`
          : `Đã ghi nhận ca ${input.maTruyenMau.trim()} với trạng thái ${input.trangThai}.`,
      truongLoi: [
        [/kết thúc/i, 'ketThuc'],
        [/PRIMARY KEY|duplicate/i, 'maTruyenMau'],
      ],
    },
  );
}
