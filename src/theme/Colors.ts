export const colors = {
  primary: '#2563eb',
  primaryForeground: '#ffffff',
  secondary: '#e5e7eb',
  secondaryForeground: '#111827',
  ghostForeground: '#111827',
  border: '#e5e7eb',
  danger: '#ef4444',
  success: '#10b981',
  info: '#3b82f6',
  warning: '#f59e0b',
  text: '#111827',
  mutedText: '#6b7280',
  background: '#ffffff',
  hanibi: {
    temp: {
      low: '#60a5fa',
      medium: '#2563eb',
      high: '#1e3a8a',
    },
    hum: {
      low: '#86efac',
      medium: '#10b981',
      high: '#065f46',
    },
    index: {
      low: '#fcd34d',
      medium: '#f59e0b',
      high: '#b45309',
    },
  },
} as const;

export type ColorName = keyof typeof colors;
