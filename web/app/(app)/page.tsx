import { redirect } from 'next/navigation';
import { requireSession } from '@/lib/server/db';
import { ROLE_INFO } from '@/lib/roles';

export default async function Home() {
  const s = await requireSession();
  redirect(ROLE_INFO[s.role].home);
}
