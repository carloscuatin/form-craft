'use client';

import { type FC } from 'react';
import {
  Type,
  AlignLeft,
  Hash,
  Calendar,
  CircleDot,
  CheckSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  FIELD_TYPES,
  FIELD_TYPE_LABELS,
  FieldType,
} from '@/core/domain/value-objects/field-types';

const ICON_MAP = {
  [FIELD_TYPES.SHORT_TEXT]: Type,
  [FIELD_TYPES.LONG_TEXT]: AlignLeft,
  [FIELD_TYPES.NUMBER]: Hash,
  [FIELD_TYPES.DATE]: Calendar,
  [FIELD_TYPES.SINGLE_SELECT]: CircleDot,
  [FIELD_TYPES.MULTI_SELECT]: CheckSquare,
} as const;

interface FieldTypePanelProps {
  onAddField: (type: FieldType) => void;
}

export const FieldTypePanel: FC<FieldTypePanelProps> = ({ onAddField }) => {
  const fieldTypes = Object.values(FIELD_TYPES);

  return (
    <div className="space-y-2">
      <h3 className="text-muted-foreground/70 px-1 text-xs font-semibold tracking-wider uppercase">
        Tipos de campo
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {fieldTypes.map((type) => {
          const Icon = ICON_MAP[type];
          return (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className="border-border flex h-auto flex-col items-center gap-1.5 px-3 py-3 text-xs transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-300"
              onClick={() => onAddField(type)}
            >
              <Icon className="h-4 w-4" />
              <span>{FIELD_TYPE_LABELS[type]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
