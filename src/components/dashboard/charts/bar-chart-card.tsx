'use client';

import { type FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Rectangle,
  Tooltip,
  ResponsiveContainer,
  type BarShapeProps,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChartColor } from '@/utils/chart';
import { type ChartResult } from '@/types/chart';

import { ChartTooltip } from './chart-tooltip';

interface BarChartCardProps {
  result: ChartResult;
}

export const BarChartCard: FC<BarChartCardProps> = ({ result }) => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-xs font-medium">
          Conteo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={result.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              allowDecimals={false}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              shape={(props: BarShapeProps) => (
                <Rectangle
                  {...props}
                  fill={getChartColor(props.index ?? 0, result.data.length)}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
