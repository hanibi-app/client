/**
 * @deprecated 이 파일은 더 이상 사용되지 않습니다.
 * 대신 @/theme에서 직접 import하세요.
 *
 * 예시:
 * - 이전: import { Colors, Spacing } from '@/constants/DesignSystem'
 * - 이후: import { colors, spacing } from '@/theme'
 *
 * 이 파일은 하위 호환성을 위해 유지되지만, 새로운 코드에서는 사용하지 마세요.
 */

import { colors, componentShadows, spacing, typography } from '@/theme';

// 하위 호환성을 위한 재export (deprecated)
export const Colors = {
  light: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
  },
} as const;

export const Spacing = {
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
} as const;

export const Typography = {
  button: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    letterSpacing: 0.4,
  },
} as const;

export const ComponentShadows = componentShadows;
