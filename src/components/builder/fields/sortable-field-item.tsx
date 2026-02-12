'use client';

import { type FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/core/domain/entities/form';
import { FIELD_TYPE_LABELS } from '@/core/domain/value-objects/field-types';
import { cn } from '@/utils/cn';

import { SORTABLE_TRANSITION } from '../constants';
import { useFormBuilderContext } from '../form-builder-context';

interface SortableFieldItemProps {
  field: FormField;
}

export const SortableFieldItem: FC<SortableFieldItemProps> = ({ field }) => {
  const { selectedFieldId, setSelectedFieldId, removeField, duplicateField } =
    useFormBuilderContext();

  const isSelected = selectedFieldId === field.id;
  const onSelect = () => setSelectedFieldId(field.id);
  const onRemove = () => removeField(field.id);
  const onDuplicate = () => duplicateField(field.id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    transition: SORTABLE_TRANSITION,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg border-2 border-dashed border-indigo-300/60 bg-indigo-50/30 p-3 dark:border-indigo-700/40 dark:bg-indigo-950/10"
      >
        <div className="invisible flex items-center gap-2">
          <GripVertical className="h-4 w-4" />
          <div className="min-w-0 flex-1">
            <span className="text-sm">{field.label || 'Campo sin nombre'}</span>
            <Badge variant="secondary" className="mt-1 h-5 text-[10px]">
              {FIELD_TYPE_LABELS[field.type]}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors',
        isSelected
          ? 'border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-200 dark:border-indigo-700 dark:bg-indigo-950/30 dark:ring-indigo-800'
          : 'border-border hover:border-border/80 bg-card',
      )}
      onClick={onSelect}
    >
      <button
        className="text-muted-foreground/70 hover:text-foreground cursor-grab touch-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground truncate text-sm font-medium">
            {field.label || 'Campo sin nombre'}
          </span>
          {field.required && <span className="text-xs text-red-500">*</span>}
        </div>
        <Badge variant="secondary" className="mt-1 h-5 text-[10px]">
          {FIELD_TYPE_LABELS[field.type]}
        </Badge>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-7 w-7 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground h-7 w-7 p-0 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
