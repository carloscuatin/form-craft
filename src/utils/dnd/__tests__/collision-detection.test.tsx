import type {
  CollisionDetection,
  ClientRect,
  DroppableContainer,
  Collision,
} from '@dnd-kit/core';

import { createListCollisionDetection } from '../collision-detection';

const DROP_ZONE_ID = 'drop-zone';

const rect = (top: number, height: number): ClientRect => {
  return {
    top,
    left: 0,
    width: 320,
    height,
    right: 320,
    bottom: top + height,
  };
};

const container = (id: string): DroppableContainer => {
  return {
    id,
    key: id,
    data: { current: {} },
    disabled: false,
    node: { current: null },
    rect: { current: null },
  };
};

const callDetection = (
  detection: CollisionDetection,
  options: {
    isNewField: boolean;
    pointerX?: number;
    pointerY: number | null;
    collisionRect: ClientRect;
    rects: Record<string, ClientRect>;
  },
): Collision[] => {
  const droppableContainers = Object.keys(options.rects).map(container);
  const droppableRects = new Map(
    Object.entries(options.rects) as Array<[string, ClientRect]>,
  );

  return detection({
    active: {
      id: options.isNewField ? 'field-type-text' : 'item-3',
      data: { current: { isNewField: options.isNewField } },
      rect: { current: { initial: null, translated: null } },
    },
    collisionRect: options.collisionRect,
    droppableRects,
    droppableContainers,
    pointerCoordinates:
      options.pointerY == null
        ? null
        : { x: options.pointerX ?? 100, y: options.pointerY },
  });
};

describe('createBuilderCollisionDetection', () => {
  it('returns dropzone when dragging new field over lower portion of last item', () => {
    const detection = createListCollisionDetection({
      dropZoneId: DROP_ZONE_ID,
    });
    const collisions = callDetection(detection, {
      isNewField: true,
      pointerY: 190, // item-2 top=170, trigger starts at 190 (50% from top)
      collisionRect: rect(180, 40),
      rects: {
        [DROP_ZONE_ID]: rect(100, 300),
        'item-1': rect(120, 40),
        'item-2': rect(170, 40),
      },
    });

    expect(collisions[0]?.id).toBe(DROP_ZONE_ID);
  });

  it('returns first sortable item when moving last item to top', () => {
    const detection = createListCollisionDetection({
      dropZoneId: DROP_ZONE_ID,
    });
    const collisions = callDetection(detection, {
      isNewField: false,
      pointerY: 120,
      collisionRect: rect(110, 40), // centered near item-1
      rects: {
        [DROP_ZONE_ID]: rect(100, 300),
        'item-1': rect(120, 40),
        'item-2': rect(170, 40),
        'item-3': rect(220, 40),
      },
    });

    expect(collisions[0]?.id).toBe('item-1');
  });

  it('returns last sortable item (not dropzone) on upper half of last item', () => {
    const detection = createListCollisionDetection({
      dropZoneId: DROP_ZONE_ID,
    });
    const collisions = callDetection(detection, {
      isNewField: true,
      pointerY: 180, // above append trigger (190), still targets last item
      collisionRect: rect(170, 40),
      rects: {
        [DROP_ZONE_ID]: rect(100, 300),
        'item-1': rect(120, 40),
        'item-2': rect(170, 40),
      },
    });

    expect(collisions[0]?.id).toBe('item-2');
  });

  it('returns dropzone when list is empty and dragging new field', () => {
    const detection = createListCollisionDetection({
      dropZoneId: DROP_ZONE_ID,
    });
    const collisions = callDetection(detection, {
      isNewField: true,
      pointerY: 180,
      collisionRect: rect(170, 40),
      rects: {
        [DROP_ZONE_ID]: rect(100, 300),
      },
    });

    expect(collisions[0]?.id).toBe(DROP_ZONE_ID);
  });

  it('never returns dropzone for sortable item reordering', () => {
    const detection = createListCollisionDetection({
      dropZoneId: DROP_ZONE_ID,
    });
    const collisions = callDetection(detection, {
      isNewField: false,
      pointerY: 260,
      collisionRect: rect(250, 40),
      rects: {
        [DROP_ZONE_ID]: rect(100, 300),
        'item-1': rect(120, 40),
        'item-2': rect(170, 40),
        'item-3': rect(220, 40),
      },
    });

    expect(collisions[0]?.id).not.toBe(DROP_ZONE_ID);
  });

  it('returns no collisions for new field while pointer is outside dropzone', () => {
    const detection = createListCollisionDetection({
      dropZoneId: DROP_ZONE_ID,
    });
    const collisions = callDetection(detection, {
      isNewField: true,
      pointerY: 80, // dropzone starts at y=100
      collisionRect: rect(70, 40),
      rects: {
        [DROP_ZONE_ID]: rect(100, 300),
        'item-1': rect(120, 40),
        'item-2': rect(170, 40),
      },
    });

    expect(collisions).toHaveLength(0);
  });
});
