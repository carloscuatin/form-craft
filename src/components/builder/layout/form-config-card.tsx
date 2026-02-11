'use client';

import { type FC } from 'react';
import { Settings2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { useFormBuilderContext } from '../form-builder-context';

export const FormConfigCard: FC = () => {
  const { form } = useFormBuilderContext();

  return (
    <div className="bg-card border-border space-y-3 rounded-xl border p-4">
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
        <Settings2 className="h-3.5 w-3.5" />
        Configuración
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="form-title" className="text-muted-foreground text-xs">
          Título
        </Label>
        <Input
          id="form-title"
          {...form.register('title')}
          placeholder="Título del formulario"
          className="h-9 text-sm"
        />
        {form.formState.errors.title && (
          <p className="text-xs text-red-500">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="form-desc" className="text-muted-foreground text-xs">
          Descripción
        </Label>
        <Textarea
          id="form-desc"
          {...form.register('description')}
          placeholder="Describe el propósito del formulario"
          rows={2}
          className="resize-none text-sm"
        />
      </div>
    </div>
  );
};
