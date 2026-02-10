import { type FC } from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const EmptyState: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
        <FileText className="h-8 w-8 text-indigo-400" />
      </div>
      <h3 className="text-foreground mb-2 text-lg font-semibold">
        No tienes formularios aún
      </h3>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Crea tu primer formulario con nuestro constructor visual y empieza a
        recolectar respuestas.
      </p>
      <Link href="/builder/new">
        <Button className="bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/50 hover:from-indigo-700 hover:to-violet-700 dark:shadow-indigo-900/30">
          <Plus className="mr-2 h-4 w-4" />
          Crear mi primer formulario
        </Button>
      </Link>
    </div>
  );
};
