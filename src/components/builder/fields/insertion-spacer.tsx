'use client';

import { type FC } from 'react';

/** Min height of a field row; used for insertion spacer during drag. */
const FIELD_ROW_MIN_HEIGHT = 52;

/** Invisible spacer shown during drag to shift the list and indicate insertion point. */
export const InsertionSpacer: FC = () => (
  <div
    aria-hidden
    className="pointer-events-none shrink-0 transition-[min-height] duration-300 ease-out"
    style={{ minHeight: FIELD_ROW_MIN_HEIGHT }}
  />
);
