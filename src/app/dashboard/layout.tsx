import { Navbar } from '@/components/dashboard';
import { getUser } from '@/app/actions/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="from-background via-background min-h-screen bg-linear-to-br to-indigo-50/30 dark:to-indigo-950/20">
      <Navbar userName={user?.name || user?.email || ''} />
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
