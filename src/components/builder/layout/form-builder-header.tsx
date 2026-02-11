'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useFormBuilderContext } from '../form-builder-context';
import { useFormBuilderSave } from '../hooks';

interface FormBuilderHeaderProps {
  formId?: string;
}

export const FormBuilderHeader: FC<FormBuilderHeaderProps> = ({ formId }) => {
  const { form } = useFormBuilderContext();
  const { handleSave, saving } = useFormBuilderSave(formId);

  const title = form.watch('title');
  const published = form.watch('published');

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <span className="text-foreground max-w-[200px] truncate text-sm font-semibold">
            {title || 'Nuevo formulario'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-muted-foreground hidden text-xs sm:block">
              Publicado
            </label>
            <button
              type="button"
              onClick={() => form.setValue('published', !published)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                published ? 'bg-indigo-600' : 'bg-muted'
              }`}
            >
              <span
                className={`dark:bg-foreground pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  published ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-700 hover:to-violet-700"
          >
            {saving ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Guardar
          </Button>
        </div>
      </div>
    </header>
  );
};
