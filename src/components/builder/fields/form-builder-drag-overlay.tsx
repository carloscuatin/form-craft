'use client';

import { type FC } from 'react';
import { GripVertical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { FormField } from '@/core/domain/entities/form';
import { FIELD_TYPE_LABELS } from '@/core/domain/value-objects/field-types';
import type { FieldType } from '@/core/domain/value-objects/field-types';

import { FieldTypeDragOverlay } from './field-type-drag-overlay';

interface FormBuilderDragOverlayProps {
  activeDragType: FieldType | null;
  activeField: FormField | null;
  dragWidth: number | null;
}

export const FormBuilderDragOverlay: FC<FormBuilderDragOverlayProps> = ({
  activeDragType,
  activeField,
  dragWidth,
}) => (
  <>
    {activeDragType && <FieldTypeDragOverlay type={activeDragType} />}
    {activeField && (
      <div
        style={{ width: dragWidth ?? undefined }}
        className="flex cursor-grabbing items-center gap-2 rounded-lg border border-indigo-300 bg-white p-3 shadow-xl ring-2 ring-indigo-200/60 dark:border-indigo-600 dark:bg-gray-900 dark:ring-indigo-800/40"
      >
        <GripVertical className="h-4 w-4 text-indigo-400" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground truncate text-sm font-medium">
              {activeField.label || 'Campo sin nombre'}
            </span>
            {activeField.required && (
              <span className="text-xs text-red-500">*</span>
            )}
          </div>
          <Badge variant="secondary" className="mt-1 h-5 text-[10px]">
            {FIELD_TYPE_LABELS[activeField.type]}
          </Badge>
        </div>
      </div>
    )}
  </>
);
