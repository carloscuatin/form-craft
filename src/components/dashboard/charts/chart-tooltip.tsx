import { type FC } from 'react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: { name: string } }[];
}

export const ChartTooltip: FC<ChartTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const { name } = payload[0].payload;
  const { value } = payload[0];

  return (
    <div className="bg-popover text-popover-foreground border-border rounded-lg border px-3 py-2 shadow-md">
      <p className="text-sm font-medium">{name}</p>
      <p className="text-muted-foreground text-xs">
        {value} {value === 1 ? 'respuesta' : 'respuestas'}
      </p>
    </div>
  );
};
