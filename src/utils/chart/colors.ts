/**
 * Generates a chart color based on the item index and total count.
 * Distributes hues evenly across the color wheel so every item
 * gets a visually distinct color regardless of how many there are.
 */
export function getChartColor(index: number, total: number): string {
  const hue = Math.round((index * 360) / Math.max(total, 1));
  return `hsl(${hue}, 65%, 55%)`;
}
