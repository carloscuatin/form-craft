'use client';

import { type FC } from 'react';
import { Layers } from 'lucide-react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useFormBuilderContext } from '../form-builder-context';
import { FieldsDropZone, SortableFieldItem } from '../fields';
import type { FormBuilderTab } from './form-builder-tabs';

interface FormBuilderFieldsColumnProps {
  activeTab: FormBuilderTab;
  isDropTarget: boolean;
}

export const FormBuilderFieldsColumn: FC<FormBuilderFieldsColumnProps> = ({
  activeTab,
  isDropTarget,
}) => {
  const { fields } = useFormBuilderContext();

  return (
    <div
      className={`lg:col-span-5 ${
        activeTab !== 'fields' ? 'hidden lg:block' : ''
      }`}
    >
      <div className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
          <Layers className="h-3.5 w-3.5" />
          Campos del formulario ({fields.length})
        </div>

        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <FieldsDropZone isDropTarget={isDropTarget}>
            {fields.length === 0 ? (
              <div className="border-border bg-card/50 h-full rounded-xl border-2 border-dashed py-16 text-center">
                <Layers className="text-muted-foreground/40 mx-auto mb-3 h-8 w-8" />
                <p className="text-muted-foreground text-sm">
                  Agrega campos desde el panel lateral
                </p>
                <p className="text-muted-foreground/60 mt-1 text-xs">
                  o arrástralos aquí
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {fields.map((field) => (
                  <SortableFieldItem key={field.id} field={field} />
                ))}
              </div>
            )}
          </FieldsDropZone>
        </SortableContext>
      </div>
    </div>
  );
};
