'use client';

import { type FC } from 'react';
import { useDraggable } from '@dnd-kit/core';

import {
  FIELD_TYPES,
  FIELD_TYPE_LABELS,
  FieldType,
} from '@/core/domain/value-objects/field-types';
import { cn } from '@/utils/cn';

import { useFormBuilderContext } from '../form-builder-context';
import { FIELD_TYPE_ICON_MAP } from './field-type-icons';

interface DraggableFieldTypeProps {
  type: FieldType;
}

const DraggableFieldType: FC<DraggableFieldTypeProps> = ({ type }) => {
  const { addField } = useFormBuilderContext();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `field-type-${type}`,
    data: { type, isNewField: true },
  });

  const Icon = FIELD_TYPE_ICON_MAP[type];

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={cn(
        'border-border bg-background flex h-auto w-full flex-col items-center gap-1.5 rounded-md border px-3 py-3 text-xs font-medium transition-all',
        'hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700',
        'dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300',
        'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-40',
      )}
      onClick={() => addField(type)}
      {...attributes}
      {...listeners}
    >
      <Icon className="h-4 w-4" />
      <span>{FIELD_TYPE_LABELS[type]}</span>
    </button>
  );
};

export const FieldTypePanel: FC = () => {
  const fieldTypes = Object.values(FIELD_TYPES);

  return (
    <div className="space-y-2">
      <h3 className="text-muted-foreground/70 px-1 text-xs font-semibold tracking-wider uppercase">
        Tipos de campo
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {fieldTypes.map((type) => (
          <DraggableFieldType key={type} type={type} />
        ))}
      </div>
    </div>
  );
};
