'use server';

import { revalidatePath } from 'next/cache';
import { exec, query, requireSession, thongBaoLoi } from '@/lib/server/db';
import { can } from '@/lib/roles';
import { formatDate, ma } from '@/lib/format';
import type { KetQua } from '@/lib/types';

function lamMoi(maYeuCau: number) {
  revalidatePath(`/yeu-cau/${maYeuCau}`);
  revalidatePath('/yeu-cau');
  revalidatePath('/kho-mau');
}

/** Duyệt yêu cầu – mục kiểm tra 2.2: "nhanvien01 duyệt được yêu cầu cấp máu" */
export async function duyetYeuCauAction(maYeuCau: number): Promise<KetQua> {
  const s = await requireSession();
  if (!can(s.role, 'duyetYeuCau')) return { ok: false, message: 'Vai trò của bạn không được duyệt yêu cầu.' };
  try {
    const r = await query<{ n: number }>(
      s,
      `UPDATE YeuCauCapMau SET TrangThai = N'Đã duyệt' WHERE MaYeuCau = @id AND TrangThai = N'Chờ xử lý';
       SELECT @@ROWCOUNT AS n;`,
      { id: maYeuCau },
    );
    if (!r[0]?.n) return { ok: false, message: 'Yêu cầu không còn ở trạng thái Chờ xử lý.' };
    lamMoi(maYeuCau);
    return { ok: true, message: `${ma.yeuCau(maYeuCau)} đã được duyệt.` };
  } catch (e) {
    return { ok: false, message: thongBaoLoi(e) };
  }
}

/** sp_PhanBoMauChoYeuCau – chọn chế phẩm tương thích, còn hạn, hạn gần nhất (FIFO).
 *  Trigger trg_PhanBoMau_KiemTraTuongThich và trg_PhanBoMau_CapNhatYeuCau chạy kèm. */
export async function phanBoTuDongAction(maYeuCau: number): Promise<KetQua> {
  const s = await requireSession();
  if (!can(s.role, 'phanBo')) return { ok: false, message: 'Vai trò của bạn không được phân bổ máu.' };
  try {
    await exec(s, 'sp_PhanBoMauChoYeuCau', { MaYeuCau: maYeuCau });
    // Đọc lại phân bổ vừa tạo để giải thích lựa chọn
    const [moi] = await query<{ MaChePham: number; TheTich: number; HanSuDung: string; TenNhomMau: string; TenNhomNhan: string; LoaiChePham: string }>(
      s,
      `SELECT TOP 1 p.MaChePham, cp.TheTich, cp.HanSuDung, nm.TenNhomMau, nn.TenNhomMau AS TenNhomNhan, cp.LoaiChePham
       FROM PhanBoMau p
       JOIN ChePhamMau cp ON cp.MaChePham = p.MaChePham
       JOIN DonViMau dv ON dv.MaDonViMau = cp.MaDonViMau
       JOIN NhomMau nm ON nm.MaNhomMau = dv.MaNhomMau
       JOIN YeuCauCapMau y ON y.MaYeuCau = p.MaYeuCau
       JOIN NhomMau nn ON nn.MaNhomMau = y.MaNhomMauYeuCau
       WHERE p.MaYeuCau = @id ORDER BY p.MaPhanBo DESC`,
      { id: maYeuCau },
    );
    lamMoi(maYeuCau);
    return {
      ok: true,
      message: moi
        ? `Đã phân bổ ${ma.chePham(moi.MaChePham)} · ${moi.TenNhomMau} · ${moi.TheTich} ml · hạn ${formatDate(moi.HanSuDung)}. ` +
          `Lý do: ${moi.LoaiChePham.toLowerCase()} nhóm ${moi.TenNhomMau} tương thích với người nhận ${moi.TenNhomNhan} theo bảng quy tắc tương thích (Điều 44 TT 26/2013/TT-BYT), còn hạn và có hạn dùng gần nhất trong kho.`
        : `Đã phân bổ cho ${ma.yeuCau(maYeuCau)}.`,
    };
  } catch (e) {
    return { ok: false, message: thongBaoLoi(e) };
  }
}
