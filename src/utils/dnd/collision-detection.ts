import {
  closestCenter,
  pointerWithin,
  type ClientRect,
  type DroppableContainer,
  type CollisionDetection,
} from '@dnd-kit/core';

/**
 * Returns the measured sortable containers.
 * @param containers - The containers to measure.
 * @param droppableRects - The droppable rects.
 * @returns The measured sortable containers.
 */
const getMeasuredSortableContainers = (
  containers: DroppableContainer[],
  droppableRects: Parameters<CollisionDetection>[0]['droppableRects'],
): Array<{ container: DroppableContainer; rect: ClientRect }> => {
  return containers
    .map((container) => ({ container, rect: droppableRects.get(container.id) }))
    .filter(
      (item): item is { container: DroppableContainer; rect: ClientRect } =>
        item.rect != null,
    )
    .sort((a, b) => a.rect.top - b.rect.top);
};

/**
 * Returns true if the pointer is inside the rectangle.
 * @param args - The arguments for the pointer inside rectangle check.
 * @returns True if the pointer is inside the rectangle, false otherwise.
 */
const isPointerInsideRect = (args: {
  pointer: { x: number; y: number } | null;
  rect: ClientRect | null;
}): boolean => {
  const { pointer, rect } = args;
  if (!pointer || !rect) return true;
  return (
    pointer.x >= rect.left &&
    pointer.x <= rect.right &&
    pointer.y >= rect.top &&
    pointer.y <= rect.bottom
  );
};

/**
 * Returns the list collision detection.
 * @param options - The options for the list collision detection.
 * @returns The list collision detection.
 */
export const createListCollisionDetection = (options: {
  dropZoneId: string;
  isNewItem?: (args: Parameters<CollisionDetection>[0]) => boolean;
}): CollisionDetection => {
  const {
    dropZoneId,
    isNewItem = (args) => Boolean(args.active.data.current?.isNewField),
  } = options;

  return (args) => {
    const dropZoneContainer =
      args.droppableContainers.find((c) => c.id === dropZoneId) ?? null;
    const dropZoneRect = dropZoneContainer
      ? (args.droppableRects.get(dropZoneContainer.id) ?? null)
      : null;
    const sortableContainers = args.droppableContainers.filter(
      (c) => c.id !== dropZoneId,
    );

    if (isNewItem(args)) {
      if (
        !isPointerInsideRect({
          pointer: args.pointerCoordinates,
          rect: dropZoneRect,
        })
      ) {
        return [];
      }

      if (sortableContainers.length === 0) {
        const pointerCollisions = pointerWithin(args);
        if (pointerCollisions.length > 0) return pointerCollisions;
        return closestCenter(args);
      }

      // If pointer is in lower portion of last sortable item,
      // prefer dropzone so insertion can target append-to-end.
      if (args.pointerCoordinates && dropZoneContainer) {
        const measured = getMeasuredSortableContainers(
          sortableContainers,
          args.droppableRects,
        );
        const last = measured[measured.length - 1];
        if (last) {
          const appendTriggerY = last.rect.top + last.rect.height / 2;
          if (args.pointerCoordinates.y >= appendTriggerY) {
            const dropzoneCollision = pointerWithin({
              ...args,
              droppableContainers: [dropZoneContainer],
            });
            if (dropzoneCollision.length > 0) return dropzoneCollision;
          }
        }
      }

      const pointerOnSortable = pointerWithin({
        ...args,
        droppableContainers: sortableContainers,
      });
      if (pointerOnSortable.length > 0) return pointerOnSortable;

      return closestCenter({
        ...args,
        droppableContainers: sortableContainers,
      });
    }

    return closestCenter({
      ...args,
      droppableContainers: sortableContainers,
    });
  };
};
