import { redirect } from 'next/navigation';
import { getSession } from '@/lib/server/db';
import { ROLE_INFO } from '@/lib/roles';
import LoginForm from './LoginForm';

export const metadata = { title: 'Đăng nhập · Ngân hàng máu' };

export default async function DangNhapPage() {
  const s = await getSession();
  if (s) redirect(ROLE_INFO[s.role].home);
  return <LoginForm />;
}
