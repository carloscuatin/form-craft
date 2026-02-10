'use client';

import { type FC } from 'react';
import {
  PieChart,
  Pie,
  Sector,
  Tooltip,
  ResponsiveContainer,
  type PieLabelRenderProps,
  type SectorProps,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChartColor } from '@/utils/chart';
import { type ChartResult } from '@/types/chart';

import { ChartTooltip } from './chart-tooltip';

interface PieChartCardProps {
  result: ChartResult;
}

export const PieChartCard: FC<PieChartCardProps> = ({ result }) => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-xs font-medium">
          Distribución
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={result.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props: PieLabelRenderProps) =>
                `${props.name ?? ''} (${(((props.percent as number) ?? 0) * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              shape={(props: SectorProps & { index?: number }) => (
                <Sector
                  {...props}
                  fill={getChartColor(props.index ?? 0, result.data.length)}
                />
              )}
            />
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
