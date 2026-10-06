// Khung chung cho server action: kiểm tra quyền giao diện, gọi procedure, đổi lỗi SQL sang tiếng Việt.
import { revalidatePath } from 'next/cache';
import { can, type Quyen } from '@/lib/roles';
import type { KetQua } from '@/lib/types';
import { exec, requireSession, thongBaoLoi, type Session } from './db';

type ProcResult = { rows: Record<string, unknown>[]; returnValue: number; prints: string[] };

export async function chayProc(
  quyen: Quyen,
  proc: string,
  params: (s: Session) => Record<string, unknown>,
  opts: {
    paths: string[];
    thanhCong: (r: ProcResult) => string;
    /** Procedure chỉ PRINT khi lỗi (không RAISERROR) – nhận diện lỗi qua nội dung PRINT */
    loiTuPrint?: RegExp;
    /** Gán lỗi vào trường form theo nội dung thông báo */
    truongLoi?: [RegExp, string][];
    /** Thêm vào sau thông báo lỗi */
    ghiChuLoi?: string;
  },
): Promise<KetQua> {
  const s = await requireSession();
  if (!can(s.role, quyen)) return { ok: false, message: 'Vai trò của bạn không có quyền thực hiện thao tác này.' };
  try {
    const r: ProcResult = await exec<Record<string, unknown>>(s, proc, params(s));
    const loiPrint = opts.loiTuPrint && r.prints.find((p) => opts.loiTuPrint!.test(p));
    if (loiPrint) return { ok: false, message: loiPrint };
    return { ok: true, message: opts.thanhCong(r) };
  } catch (e) {
    const message = thongBaoLoi(e);
    const field = opts.truongLoi?.find(([re]) => re.test(message))?.[1];
    return { ok: false, message: opts.ghiChuLoi ? `${message} ${opts.ghiChuLoi}` : message, field };
  } finally {
    // Có procedure ghi log cả khi thất bại (LichSuBackup, LichSuRestore) nên luôn làm mới
    opts.paths.forEach((p) => revalidatePath(p));
  }
}
