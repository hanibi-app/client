export type HanibiMetric = 'temp' | 'hum' | 'index';

export type HanibiLevel = 'low' | 'medium' | 'high';

export const hanibiThresholds: Record<HanibiMetric, { low: number; medium: number; high: number }> = {
  temp: { low: 18, medium: 24, high: 30 },
  hum: { low: 30, medium: 60, high: 80 },
  index: { low: 2, medium: 5, high: 8 },
};

export function getHanibiLevel(metric: HanibiMetric, value: number): HanibiLevel {
  const t = hanibiThresholds[metric];
  if (value < t.low) return 'low';
  if (value < t.medium) return 'medium';
  return 'high';
}


