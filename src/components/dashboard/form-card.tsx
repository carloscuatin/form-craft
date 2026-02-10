'use client';

import { type FC } from 'react';
import Link from 'next/link';
import {
  Edit,
  MoreVertical,
  Trash2,
  ExternalLink,
  Copy,
  BarChart3,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormWithResponseCount } from '@/core/domain/entities/form';
import { deleteForm } from '@/app/actions/forms';

interface FormCardProps {
  form: FormWithResponseCount;
}

export const FormCard: FC<FormCardProps> = ({ form }) => {
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/forms/${form.id}`;

  async function handleCopyLink() {
    await navigator.clipboard.writeText(publicUrl);
    toast.success('Link copiado al portapapeles');
  }

  async function handleDelete() {
    if (
      !confirm(
        '¿Estás seguro de eliminar este formulario? Se perderán todas las respuestas.',
      )
    ) {
      return;
    }
    const result = await deleteForm(form.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Formulario eliminado');
    }
  }

  const formattedDate = new Date(form.createdAt).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="group border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100/40 dark:hover:shadow-indigo-900/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Link
                href={`/builder/${form.id}`}
                className="text-foreground truncate text-base font-semibold transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {form.title}
              </Link>
              <Badge
                variant={form.published ? 'default' : 'secondary'}
                className={`shrink-0 text-[10px] ${
                  form.published
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {form.published ? 'Publicado' : 'Borrador'}
              </Badge>
            </div>
            <p className="text-muted-foreground truncate text-sm">
              {form.description || 'Sin descripción'}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/builder/${form.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </DropdownMenuItem>
              {form.published && (
                <>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar link
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/forms/${form.id}`} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver formulario
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${form.id}`}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver respuestas
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="border-border mt-4 flex items-center gap-4 border-t pt-3">
          <div className="text-muted-foreground/70 flex items-center gap-1.5 text-sm">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>
              {form.responseCount}{' '}
              {form.responseCount === 1 ? 'respuesta' : 'respuestas'}
            </span>
          </div>
          <span className="text-muted-foreground/70 text-sm">
            {formattedDate}
          </span>
          <div className="flex-1" />
          <Link href={`/dashboard/${form.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
            >
              Ver detalle
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
