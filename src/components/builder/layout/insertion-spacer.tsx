'use client';

import { type FC } from 'react';

import { FIELD_ROW_MIN_HEIGHT } from '../constants';

/** Invisible spacer shown during drag to shift the list and indicate insertion point. */
export const InsertionSpacer: FC = () => (
  <div
    aria-hidden
    className="pointer-events-none shrink-0 transition-[min-height] duration-300 ease-out"
    style={{ minHeight: FIELD_ROW_MIN_HEIGHT }}
  />
);
