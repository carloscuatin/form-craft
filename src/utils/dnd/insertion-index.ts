import type { ClientRect, Over } from '@dnd-kit/core';

export type ItemWithId = { id: string };

/**
 * Returns the ID of the item that is being overlapped.
 * @param over - The item that is being overlapped.
 * @returns The ID of the item that is being overlapped, or null if the item is not provided.
 */
export const getOverId = (over: Over | null): string | null => {
  return over?.id != null ? String(over.id) : null;
};

/**
 * Returns the insertion index for an item based on its over ID.
 * @param overId - The ID of the item that is being overlapped.
 * @param items - The list of items to search through.
 * @param dropZoneId - The ID of the drop zone.
 * @returns The insertion index for the item, or null if the item is not found.
 */
export const getInsertionIndexFromOverId = (
  overId: string | null,
  items: ItemWithId[],
  dropZoneId: string,
): number | null => {
  if (overId == null) return null;
  if (overId === dropZoneId) return items.length;
  const index = items.findIndex((item) => item.id === overId);
  return index === -1 ? null : index;
};

/**
 * Returns the center Y coordinate of a rectangle.
 * @param rect - The rectangle to get the center Y coordinate of.
 * @returns The center Y coordinate of the rectangle, or null if the rectangle is not provided.
 */
const getRectCenterY = (rect: ClientRect | null): number | null => {
  if (!rect) return null;
  return rect.top + rect.height / 2;
};

/**
 * Computes insertion index for new-item drag:
 * - over dropzone => append
 * - over normal item => before item
 * - if over last item and drag center is in lower half => append
 */
export const resolveNewItemInsertionIndex = (args: {
  overId: string | null;
  overRect: ClientRect | null;
  activeRect: ClientRect | null;
  items: ItemWithId[];
  dropZoneId: string;
}): number | null => {
  const { overId, overRect, activeRect, items, dropZoneId } = args;
  const baseIndex = getInsertionIndexFromOverId(overId, items, dropZoneId);
  if (baseIndex == null) return null;
  if (overId === dropZoneId) return items.length;

  const isOverLastItem = baseIndex === items.length - 1;
  if (!isOverLastItem) return baseIndex;

  const overCenterY = getRectCenterY(overRect);
  const activeCenterY = getRectCenterY(activeRect);
  if (overCenterY == null || activeCenterY == null) return baseIndex;

  return activeCenterY > overCenterY ? items.length : baseIndex;
};
