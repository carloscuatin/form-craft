'use client';

import { type FC } from 'react';

import { FormField } from '@/core/domain/entities/form';
import { FormResponse } from '@/core/domain/entities/response';
import { getChartResult } from '@/utils/chart';
import { type ChartResult } from '@/types/chart';

import { FieldChartGroup } from '../charts';

interface ResponseChartsProps {
  fields: FormField[];
  responses: FormResponse[];
}

export const ResponseCharts: FC<ResponseChartsProps> = ({
  fields,
  responses,
}) => {
  const charts = fields
    .map((field) => ({ field, result: getChartResult(field, responses) }))
    .filter(
      (entry): entry is { field: FormField; result: ChartResult } =>
        entry.result !== null && entry.result.data.length > 0,
    );

  if (charts.length === 0) {
    const hasSelectFields = fields.some((f) => f.options);

    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">
          {hasSelectFields
            ? 'No hay respuestas aún para generar gráficas.'
            : 'Este formulario no tiene campos de selección para generar gráficas.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {charts.map(({ field, result }) => (
        <FieldChartGroup key={field.id} field={field} result={result} />
      ))}
    </div>
  );
};
