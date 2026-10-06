'use server';

import { redirect } from 'next/navigation';
import { dangNhap, dangXuat, thongBaoLoi } from '@/lib/server/db';
import { DEMO_ACCOUNTS, ROLE_INFO } from '@/lib/roles';

export type LoginState = { error?: string; username?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!username || !password) return { error: 'Nhập tên đăng nhập và mật khẩu.', username };

  let home: string;
  try {
    const s = await dangNhap(username, password);
    home = ROLE_INFO[s.role].home;
  } catch (e) {
    return { error: thongBaoLoi(e), username };
  }
  redirect(home);
}

export async function logoutAction() {
  await dangXuat();
  redirect('/dang-nhap');
}

/** Chuyển nhanh giữa 3 tài khoản demo: đăng xuất rồi đăng nhập lại bằng SQL login khác */
export async function switchRoleAction(username: string) {
  const acc = DEMO_ACCOUNTS.find((a) => a.username === username);
  const password = process.env[`DEMO_PASSWORD_${username.toUpperCase()}`];
  if (!acc || !password) redirect('/dang-nhap');

  await dangXuat();
  try {
    await dangNhap(acc.username, password);
  } catch {
    redirect('/dang-nhap');
  }
  redirect(ROLE_INFO[acc.role].home);
}
