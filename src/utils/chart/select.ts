import { FormField } from '@/core/domain/entities/form';
import { FormResponse } from '@/core/domain/entities/response';
import { ChartResult } from '@/types/chart';

/** Select fields: distribution of selected options */
export const getSelectChartData = (
  field: FormField,
  responses: FormResponse[],
): ChartResult | null => {
  if (!field.options || field.options.length === 0) return null;

  const counts: Record<string, number> = {};
  field.options.forEach((option) => {
    counts[option.id] = 0;
  });

  for (const response of responses) {
    const answer = response.answers[field.id];
    if (!answer) continue;

    const values = Array.isArray(answer) ? answer : [answer];
    for (const val of values) {
      counts[val as string] = (counts[val as string] || 0) + 1;
    }
  }

  const data = Object.entries(counts).map(([optionId, count]) => ({
    name: field.options?.find((o) => o.id === optionId)?.label ?? optionId,
    value: count,
  }));

  return { data };
};
