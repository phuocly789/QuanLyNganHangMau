'use server';

import { chayProc } from '@/lib/server/action';
import { hoTenCua } from '@/lib/roles';
import { ma } from '@/lib/format';

/** sp_NhapKhoChePham – kiểm tra sức chứa, cập nhật vị trí, ghi LichSuKho */
export async function nhapKhoAction(input: { maChePham: number; maViTri: number; ghiChu: string }) {
  return chayProc(
    'nhapKho',
    'sp_NhapKhoChePham',
    (s) => ({
      MaChePham: input.maChePham,
      MaViTri: input.maViTri,
      NguoiThucHien: hoTenCua(s.username),
      GhiChu: input.ghiChu.trim() || null,
    }),
    {
      paths: ['/kho-mau'],
      thanhCong: () => `Đã nhập ${ma.chePham(input.maChePham)} vào kho.`,
      truongLoi: [[/vị trí/i, 'viTri']],
    },
  );
}

/** sp_CapNhatChePhamHetHan – RETURN số chế phẩm đã cập nhật, -1 nếu không có, -99 nếu lỗi */
export async function capNhatHetHanAction() {
  return chayProc('capNhatHetHan', 'sp_CapNhatChePhamHetHan', (s) => ({ v_MaChePham: 0, v_NguoiThucHien: hoTenCua(s.username) }), {
    paths: ['/kho-mau'],
    thanhCong: ({ returnValue }) =>
      returnValue === -99
        ? 'Cập nhật thất bại, dữ liệu đã được hoàn tác.'
        : returnValue <= 0
          ? 'Không có chế phẩm nào quá hạn cần cập nhật.'
          : `Đã chuyển ${returnValue} chế phẩm quá hạn sang trạng thái Hết hạn.`,
  });
}

/** sp_CapNhatTrangThaiViTriLuuTru – đếm lại chế phẩm đang lưu trữ, đánh giá Đầy / Còn chỗ */
export async function dongBoViTriAction() {
  return chayProc('dongBoViTri', 'sp_CapNhatTrangThaiViTriLuuTru', () => ({ v_MaViTri: 0 }), {
    paths: ['/kho-mau'],
    thanhCong: ({ returnValue }) =>
      returnValue === -99
        ? 'Đồng bộ thất bại, dữ liệu đã được hoàn tác.'
        : returnValue <= 0
          ? 'Không có vị trí nào cần đồng bộ (bỏ qua vị trí Bảo trì, Không sử dụng).'
          : `Đã đồng bộ số lượng và trạng thái cho ${returnValue} vị trí lưu trữ.`,
  });
}
