'use client';

import { type FC } from 'react';
import { Plus, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FormField } from '@/core/domain/entities/form';
import { FIELD_TYPE_LABELS } from '@/core/domain/value-objects/field-types';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onAddOption: () => void;
  onUpdateOption: (optionId: string, label: string) => void;
  onRemoveOption: (optionId: string) => void;
}

export const FieldEditor: FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-muted-foreground/70 mb-3 text-xs font-semibold tracking-wider uppercase">
          Propiedades del campo
        </h3>
        <p className="mb-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {FIELD_TYPE_LABELS[field.type]}
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="field-label"
            className="text-muted-foreground text-xs"
          >
            Etiqueta
          </Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Nombre del campo"
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="field-placeholder"
            className="text-muted-foreground text-xs"
          >
            Placeholder
          </Label>
          <Input
            id="field-placeholder"
            value={field.placeholder ?? ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Texto de ejemplo"
            className="h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            id="field-required"
            checked={field.required}
            onCheckedChange={(checked) =>
              onUpdate({ required: checked === true })
            }
          />
          <Label
            htmlFor="field-required"
            className="text-muted-foreground cursor-pointer text-sm"
          >
            Campo obligatorio
          </Label>
        </div>
      </div>

      {field.options && (
        <>
          <Separator />
          <div className="space-y-3">
            <Label className="text-muted-foreground text-xs">Opciones</Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <span className="text-muted-foreground/70 w-4 text-right text-xs">
                    {index + 1}
                  </span>
                  <Input
                    value={option.label}
                    onChange={(e) => onUpdateOption(option.id, e.target.value)}
                    placeholder={`Opción ${index + 1}`}
                    className="h-8 flex-1 text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-8 w-8 p-0 hover:text-red-500"
                    onClick={() => onRemoveOption(option.id)}
                    disabled={(field.options?.length ?? 0) <= 1}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full text-xs"
              onClick={onAddOption}
            >
              <Plus className="mr-1 h-3 w-3" />
              Agregar opción
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
