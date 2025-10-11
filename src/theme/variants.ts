/**
 * 상태별 UI 변형 규칙
 *
 * 안전/주의/위험 등의 상태에 따른 색상 조합을 자동으로 생성합니다.
 * 대시보드, 알림, 토스트 등에서 일관된 상태 표시를 위해 사용됩니다.
 */

import { SemanticTokens } from './tokens';

export type StatusLevel = 'safe' | 'caution' | 'danger' | 'info' | 'success' | 'warning' | 'error';

export interface StatusColors {
  background: string;
  text: string;
  border: string;
  icon: string;
}

/**
 * 상태 레벨에 따른 색상 조합을 반환합니다.
 */
export function getStatusColors(level: StatusLevel, theme: SemanticTokens): StatusColors {
  const baseColor = theme.state[level];

  return {
    background: `${baseColor}20`, // 12% 투명도
    text: baseColor,
    border: `${baseColor}40`, // 25% 투명도
    icon: baseColor,
  };
}

/**
 * 센서 지표별 색상 매핑
 */
export function getMetricColors(metric: string, theme: SemanticTokens): StatusColors {
  const metricColorMap: Record<string, string> = {
    temperature: theme.chart.temperature,
    humidity: theme.chart.humidity,
    metal: theme.chart.metal,
    voc: theme.chart.voc,
  };

  const color = metricColorMap[metric] || theme.text.primary;

  return {
    background: `${color}20`,
    text: color,
    border: `${color}40`,
    icon: color,
  };
}

/**
 * 홈 배경 그라디언트 색상
 * 센서 상태에 따른 배경 그라디언트를 생성합니다.
 */
export function getHomeBackgroundGradient(
  status: 'normal' | 'warning' | 'danger',
  theme: SemanticTokens,
): string[] {
  switch (status) {
    case 'normal':
      return [theme.surface.background, `${theme.state.safe}10`];
    case 'warning':
      return [theme.surface.background, `${theme.state.caution}10`];
    case 'danger':
      return [theme.surface.background, `${theme.state.danger}10`];
    default:
      return [theme.surface.background];
  }
}

/**
 * 버튼 변형 색상
 */
export function getButtonColors(
  variant: 'primary' | 'secondary' | 'ghost' | 'danger',
  theme: SemanticTokens,
): StatusColors {
  switch (variant) {
    case 'primary':
      return {
        background: theme.brand.primary,
        text: theme.brand.primaryText,
        border: theme.brand.primary,
        icon: theme.brand.primaryText,
      };
    case 'secondary':
      return {
        background: theme.brand.secondary,
        text: theme.brand.secondaryText,
        border: theme.brand.secondary,
        icon: theme.brand.secondaryText,
      };
    case 'ghost':
      return {
        background: 'transparent',
        text: theme.text.primary,
        border: theme.surface.border,
        icon: theme.text.primary,
      };
    case 'danger':
      return {
        background: theme.state.error,
        text: theme.text.inverse,
        border: theme.state.error,
        icon: theme.text.inverse,
      };
    default:
      return {
        background: theme.surface.card,
        text: theme.text.primary,
        border: theme.surface.border,
        icon: theme.text.primary,
      };
  }
}

/**
 * 토스트/알림 변형 색상
 */
export function getToastColors(
  type: 'success' | 'warning' | 'error' | 'info',
  theme: SemanticTokens,
): StatusColors {
  const stateColor = theme.state[type];

  return {
    background: `${stateColor}20`,
    text: stateColor,
    border: `${stateColor}40`,
    icon: stateColor,
  };
}

/**
 * 탭 인디케이터 색상
 */
export function getTabIndicatorColors(isActive: boolean, theme: SemanticTokens): StatusColors {
  if (isActive) {
    return {
      background: theme.brand.primary,
      text: theme.brand.primary,
      border: theme.brand.primary,
      icon: theme.brand.primary,
    };
  }

  return {
    background: 'transparent',
    text: theme.text.muted,
    border: 'transparent',
    icon: theme.text.muted,
  };
}
