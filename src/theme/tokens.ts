/**
 * 한니비 앱 테마 토큰 시스템
 *
 * 원색 팔레트와 세맨틱 토큰을 정의하여 일관된 디자인 시스템을 제공합니다.
 * 접근성 기준(AA 4.5:1)을 만족하는 색상 조합을 자동으로 생성합니다.
 */

// 원색 팔레트 타입 정의
export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

// 브랜드 색상 팔레트
export const brandColors = {
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // 브랜드 프라이머리
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  mint: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // 브랜드 세컨더리
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
} as const;

// 중성 색상 팔레트
export const neutralColors = {
  gray: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
} as const;

// 신호 색상 팔레트 (상태 표시용)
export const signalColors = {
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  yellow: {
    50: '#fefce8',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
} as const;

// 세맨틱 토큰 타입 정의
export type SemanticTokens = {
  // 브랜드
  brand: {
    primary: string;
    primaryText: string;
    secondary: string;
    secondaryText: string;
  };
  // 배경/표면
  surface: {
    background: string;
    card: string;
    elevated: string;
    border: string;
    divider: string;
  };
  // 텍스트
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  // 상태 (대시보드/지표/토스트)
  state: {
    safe: string;
    caution: string;
    danger: string;
    info: string;
    success: string;
    warning: string;
    error: string;
  };
  // 상호작용
  action: {
    focus: string;
    hover: string;
    pressed: string;
    disabledBg: string;
    disabledText: string;
  };
  // 차트/데이터 시각화
  chart: {
    temperature: string;
    humidity: string;
    metal: string;
    voc: string;
    grid: string;
    axis: string;
  };
  // 알파/투명도 유틸
  overlay: {
    scrim: string;
    subtle: string;
  };
};

// 색상 유틸리티 함수들
export const colorUtils = {
  /**
   * 16진수 색상을 RGBA로 변환
   */
  hexToRgba: (hex: string, alpha: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  /**
   * 색상의 명도를 계산 (0-1)
   */
  getLuminance: (hex: string): number => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * 두 색상 간의 대비비 계산
   */
  getContrast: (color1: string, color2: string): number => {
    const lum1 = colorUtils.getLuminance(color1);
    const lum2 = colorUtils.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * 접근성 기준(AA 4.5:1)을 만족하는 텍스트 색상 자동 선택
   */
  getAccessibleTextColor: (backgroundColor: string): string => {
    const lightText = neutralColors.gray[0];
    const darkText = neutralColors.gray[900];

    const lightContrast = colorUtils.getContrast(backgroundColor, lightText);
    const darkContrast = colorUtils.getContrast(backgroundColor, darkText);

    return lightContrast > darkContrast ? lightText : darkText;
  },

  /**
   * 색상에 투명도 적용
   */
  withOpacity: (color: string, opacity: number): string => {
    if (color.startsWith('#')) {
      return colorUtils.hexToRgba(color, opacity);
    }
    return color;
  },
};

// 기본 색상 팔레트 내보내기
export const colors = {
  brand: brandColors,
  neutral: neutralColors,
  signal: signalColors,
} as const;
