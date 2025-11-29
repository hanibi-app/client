/**
 * 테마 시스템 중앙 export
 *
 * 모든 테마 관련 값(color, spacing, typography, shadows)을 한 곳에서 export합니다.
 * 이 파일을 통해 일관된 테마 시스템을 제공합니다.
 */

export { colors } from './Colors';
export type { ColorName } from './Colors';

export { spacing } from './spacing';
export type { SpacingKey } from './spacing';

export { typography } from './typography';
export type { Typography } from './typography';

export { componentShadows } from './shadows';
export type { ComponentShadows } from './shadows';

// 타입 export
export type { Colors, Theme, ThemeContextValue, ThemeMode } from './types';
