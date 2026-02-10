import { type FC } from 'react';

import { FormField } from '@/core/domain/entities/form';
import { type ChartResult } from '@/types/chart';

import { PieChartCard } from './pie-chart-card';
import { BarChartCard } from './bar-chart-card';

interface FieldChartGroupProps {
  field: FormField;
  result: ChartResult;
}

export const FieldChartGroup: FC<FieldChartGroupProps> = ({
  field,
  result,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-foreground text-sm font-semibold">
        {field.label || 'Sin nombre'}
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PieChartCard result={result} />
        <BarChartCard result={result} />
      </div>
    </div>
  );
};
