'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, LogOut, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { signOut } from '@/app/actions/auth';

interface NavbarProps {
  userName?: string;
}

export const Navbar: FC<NavbarProps> = ({ userName }) => {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-violet-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-foreground text-lg font-bold tracking-tight">
              FormCraft
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/builder/new">
            <Button
              size="sm"
              className="bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-700 hover:to-violet-700"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Nuevo formulario
            </Button>
          </Link>
          {userName && (
            <span className="text-muted-foreground hidden text-sm sm:block">
              {userName}
            </span>
          )}
          <ThemeToggle />
          <form action={handleSignOut}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};
