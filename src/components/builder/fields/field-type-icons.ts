import {
  Type,
  AlignLeft,
  Hash,
  Calendar,
  CircleDot,
  CheckSquare,
} from 'lucide-react';

import { FIELD_TYPES } from '@/core/domain/value-objects/field-types';

export const FIELD_TYPE_ICON_MAP = {
  [FIELD_TYPES.SHORT_TEXT]: Type,
  [FIELD_TYPES.LONG_TEXT]: AlignLeft,
  [FIELD_TYPES.NUMBER]: Hash,
  [FIELD_TYPES.DATE]: Calendar,
  [FIELD_TYPES.SINGLE_SELECT]: CircleDot,
  [FIELD_TYPES.MULTI_SELECT]: CheckSquare,
} as const;
