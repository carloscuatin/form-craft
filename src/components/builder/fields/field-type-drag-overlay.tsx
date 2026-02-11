'use client';

import { type FC } from 'react';

import {
  FieldType,
  FIELD_TYPE_LABELS,
} from '@/core/domain/value-objects/field-types';

import { FIELD_TYPE_ICON_MAP } from './field-type-icons';

interface FieldTypeDragOverlayProps {
  type: FieldType;
}

export const FieldTypeDragOverlay: FC<FieldTypeDragOverlayProps> = ({
  type,
}) => {
  const Icon = FIELD_TYPE_ICON_MAP[type];

  return (
    <div className="flex items-center gap-2 rounded-lg border border-indigo-300 bg-white px-4 py-3 shadow-lg dark:border-indigo-700 dark:bg-gray-900">
      <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
      <span className="text-sm font-medium">{FIELD_TYPE_LABELS[type]}</span>
    </div>
  );
};
