'use client';

import { type FC, type ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

import { cn } from '@/utils/cn';

export const DROP_ZONE_ID = 'fields-drop-zone';

interface FieldsDropZoneProps {
  children: ReactNode;
  isDropTarget: boolean;
}

export const FieldsDropZone: FC<FieldsDropZoneProps> = ({
  children,
  isDropTarget,
}) => {
  const { setNodeRef } = useDroppable({ id: DROP_ZONE_ID });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-32 rounded-xl transition-all',
        isDropTarget &&
          'dark:ring-offset-background ring-2 ring-indigo-400/50 ring-offset-2 dark:ring-indigo-500/40',
      )}
    >
      {children}
    </div>
  );
};
