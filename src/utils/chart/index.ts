/**
 * Chart utilities
 * Transforms form responses into chart-ready data for select fields
 */

import { FormField } from '@/core/domain/entities/form';
import { FormResponse } from '@/core/domain/entities/response';
import { FIELD_TYPES } from '@/core/domain/value-objects/field-types';
import { ChartResult } from '@/types/chart';

import { getSelectChartData } from './select';

export type { ChartResult } from '@/types/chart';
export { getChartColor } from './colors';

/** Resolves the chart data for a given field based on its type */
export function getChartResult(
  field: FormField,
  responses: FormResponse[],
): ChartResult | null {
  switch (field.type) {
    case FIELD_TYPES.SINGLE_SELECT:
    case FIELD_TYPES.MULTI_SELECT:
      return getSelectChartData(field, responses);
    default:
      return null;
  }
}
