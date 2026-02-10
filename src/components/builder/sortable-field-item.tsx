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

interface SortableFieldItemProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export const SortableFieldItem: FC<SortableFieldItemProps> = ({
  field,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all',
        isDragging && 'opacity-50 shadow-lg',
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
