'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/core/domain/entities/form';
import { FormResponse } from '@/core/domain/entities/response';
import { isSelectFieldType } from '@/core/domain/value-objects/field-types';

interface ResponseChartsProps {
  fields: FormField[];
  responses: FormResponse[];
}

const COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#f97316', // orange
  '#84cc16', // lime
];

export function ResponseCharts({ fields, responses }: ResponseChartsProps) {
  // Only show charts for select-type fields
  const selectFields = fields.filter((f) => isSelectFieldType(f.type));

  if (selectFields.length === 0) {
    return null;
  }

  function getChartData(field: FormField) {
    const counts: Record<string, number> = {};

    // Initialize all options with 0
    field.options?.forEach((option) => {
      counts[option.id] = 0;
    });

    // Count answers
    for (const response of responses) {
      const answer = response.answers[field.id];
      if (!answer) continue;

      if (Array.isArray(answer)) {
        for (const val of answer) {
          counts[val as string] = (counts[val as string] || 0) + 1;
        }
      } else {
        counts[answer as string] = (counts[answer as string] || 0) + 1;
      }
    }

    return Object.entries(counts).map(([optionId, count]) => ({
      name: field.options?.find((o) => o.id === optionId)?.label ?? optionId,
      value: count,
    }));
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {selectFields.map((field) => {
        const data = getChartData(field);
        const usePie = data.length <= 5;

        return (
          <Card key={field.id} className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground text-sm font-semibold">
                {field.label || 'Sin nombre'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                {usePie ? (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: PieLabelRenderProps) =>
                        `${props.name ?? ''} (${(((props.percent as number) ?? 0) * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      allowDecimals={false}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
