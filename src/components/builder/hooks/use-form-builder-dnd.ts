'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  pointerWithin,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  type CollisionDetection,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import type { FieldType } from '@/core/domain/value-objects/field-types';

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
  const [dragWidth, setDragWidth] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const collisionDetection: CollisionDetection = useCallback((args) => {
    if (args.active.data.current?.isNewField) {
      const pointerCollisions = pointerWithin(args);
      if (pointerCollisions.length > 0) return pointerCollisions;
      return [];
    }
    return closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (c) => c.id !== DROP_ZONE_ID,
      ),
    });
  }, []);

  const clearDragState = useCallback(() => {
    setActiveDragType(null);
    setActiveDragId(null);
    setOverId(null);
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
      setOverId(over?.id != null ? String(over.id) : null);

      if (
        !active.data.current?.isNewField &&
        over &&
        active.id !== over.id &&
        over.id !== DROP_ZONE_ID
      ) {
        reorderFields(String(active.id), String(over.id));
      }
    },
    [reorderFields],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      clearDragState();
      if (!over) return;

      if (active.data.current?.isNewField) {
        const type = active.data.current.type as FieldType;
        if (over.id === DROP_ZONE_ID) {
          addField(type);
        } else {
          const overIndex = fields.findIndex((f) => f.id === over.id);
          if (overIndex !== -1) addFieldAt(type, overIndex);
        }
      }
    },
    [addField, addFieldAt, fields, clearDragState],
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
  };
}
