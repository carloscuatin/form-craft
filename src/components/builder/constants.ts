/** Min height of a field row; used for insertion spacer during drag. */
export const FIELD_ROW_MIN_HEIGHT = 52;

/** Sortable transition config for smooth reorder animation. */
export const SORTABLE_TRANSITION = {
  duration: 280,
  easing: 'cubic-bezier(0.33, 1, 0.68, 1)' as const,
};

/** Minimum pointer movement (px) before starting drag. */
export const DND_POINTER_ACTIVATION_DISTANCE = 6;
