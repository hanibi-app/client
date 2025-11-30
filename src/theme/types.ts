/**
 * 테마 타입 정의
 *
 * 테마 시스템의 타입을 중앙에서 관리합니다.
 * 다크 모드 지원을 위한 타입 구조를 포함합니다.
 */

import type { colors } from './Colors';
import type { componentShadows } from './shadows';
import type { spacing } from './spacing';
import type { typography } from './typography';

/**
 * 색상 타입
 */
export type Colors = typeof colors;
export type ColorName = keyof typeof colors;

/**
 * 간격 타입
 */
export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;

/**
 * 타이포그래피 타입
 */
export type Typography = typeof typography;

/**
 * 그림자 타입
 */
export type ComponentShadows = typeof componentShadows;

/**
 * 테마 모드
 */
export type ThemeMode = 'light' | 'dark';

/**
 * 통합 테마 타입
 * 향후 다크 모드 지원 시 확장 가능
 */
export interface Theme {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  shadows: ComponentShadows;
  mode: ThemeMode;
}

/**
 * 테마 컨텍스트 타입 (향후 사용)
 */
export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

