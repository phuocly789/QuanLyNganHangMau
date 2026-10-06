import Box from '@mui/material/Box';
import TopNav from '@/components/TopNav';
import { requireSession } from '@/lib/server/db';
import { hoTenCua } from '@/lib/roles';

export default async function AppLayout({ children }: LayoutProps<'/'>) {
  const s = await requireSession();
  return (
    <>
      <TopNav username={s.username} hoTen={hoTenCua(s.username)} role={s.role} />
      <Box component="main" sx={{ maxWidth: 1760, mx: 'auto', px: { xs: 2, md: 3 }, pt: 3, pb: 6 }}>
        {children}
      </Box>
    </>
  );
}
