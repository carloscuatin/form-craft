'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import type { FieldType } from '@/core/domain/value-objects/field-types';
import { createListCollisionDetection } from '@/utils/dnd/collision-detection';
import {
  getOverId,
  resolveNewItemInsertionIndex,
} from '@/utils/dnd/insertion-index';

import { useFormBuilderContext } from '../form-builder-context';
import { DROP_ZONE_ID } from '../fields';

/**
 * Encapsulates all drag-and-drop state and handlers for the form builder.
 * Must be used within FormBuilderProvider.
 */
export function useFormBuilderDnD() {
  const { fields, reorderFields, addField, addFieldAt } =
    useFormBuilderContext();

  const [activeDragType, setActiveDragType] = useState<FieldType | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const [dragWidth, setDragWidth] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const collisionDetection = useMemo(
    () =>
      createListCollisionDetection({
        dropZoneId: DROP_ZONE_ID,
      }),
    [],
  );

  const clearDragState = useCallback(() => {
    setActiveDragType(null);
    setActiveDragId(null);
    setOverId(null);
    setInsertionIndex(null);
    setDragWidth(null);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const rect = event.active.rect.current.initial;
    if (rect) setDragWidth(rect.width);

    if (event.active.data.current?.isNewField) {
      setActiveDragType(event.active.data.current.type as FieldType);
      setActiveDragId(null);
    } else {
      setActiveDragType(null);
      setActiveDragId(String(event.active.id));
    }
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      const newOverId = getOverId(over);
      setOverId((prev) => (prev === newOverId ? prev : newOverId));

      if (!active.data.current?.isNewField) {
        setInsertionIndex((prev) => (prev === null ? prev : null));
        return;
      }

      const nextIndex = resolveNewItemInsertionIndex({
        overId: newOverId,
        overRect: over?.rect ?? null,
        activeRect: active.rect.current.translated,
        items: fields,
        dropZoneId: DROP_ZONE_ID,
      });
      setInsertionIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    },
    [fields],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const overId = getOverId(over);

      if (overId == null || !over) {
        clearDragState();
        return;
      }

      if (active.data.current?.isNewField) {
        const type = active.data.current.type as FieldType;
        const targetIndex =
          insertionIndex != null
            ? Math.max(0, Math.min(insertionIndex, fields.length))
            : resolveNewItemInsertionIndex({
                overId,
                overRect: over.rect,
                activeRect: active.rect.current.translated,
                items: fields,
                dropZoneId: DROP_ZONE_ID,
              });

        if (targetIndex != null) {
          if (targetIndex >= fields.length) addField(type);
          else addFieldAt(type, targetIndex);
        }
      } else if (overId !== DROP_ZONE_ID && overId !== String(active.id)) {
        reorderFields(String(active.id), overId);
      }

      clearDragState();
    },
    [
      addField,
      addFieldAt,
      fields,
      insertionIndex,
      reorderFields,
      clearDragState,
    ],
  );

  const activeField = useMemo(
    () =>
      activeDragId ? (fields.find((f) => f.id === activeDragId) ?? null) : null,
    [activeDragId, fields],
  );

  const isDropTarget = useMemo(
    () =>
      !!activeDragType &&
      (overId === DROP_ZONE_ID ||
        (overId != null && fields.some((f) => f.id === overId))),
    [activeDragType, overId, fields],
  );

  return {
    sensors,
    collisionDetection,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    onDragCancel: clearDragState,
    activeDragType,
    activeField,
    isDropTarget,
    dragWidth,
    insertionIndex,
  };
}
