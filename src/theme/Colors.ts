export const colors = {
  primary: '#6BE092', // 메인 그린 (한니비 메인 컬러)
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
  kakao: '#FEE500', // 카카오 로그인 버튼 색상
  white: '#ffffff',
  black: '#000000',
  accent: '#40EA87',
  transparent: 'transparent',
  blushPink: '#ff9999',
  gray50: '#f5f5f5',
  gray75: '#f3f4f6',
  gray100: '#d1d5db',
  cream: '#ffe5b4',
  softCream: '#ffffee',
  brightYellow: '#ffff00',
  notifyBackground: '#F4F6F5',
  darkGreen: '#1A5746', // 색상 칩 선택 보더 색상
  lightGray: '#D1D5DB', // 연한 회색 (인디케이터)
  lightGrayOverlay: 'rgba(156, 163, 175, 0.15)', // 하이라이트 오버레이
  lightGreen: '#B8E092', // 연한 초록 (화살표 그라데이션)
  lightestGreen: '#E5F5E5', // 가장 연한 초록 (화살표 그라데이션)
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
