/**
 * 스타일 헬퍼 유틸리티
 * 
 * 테마 토큰 접근, 스타일 생성 등의 기능을 제공합니다.
 */

import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { useTheme } from '@/theme';
import { SemanticTokens } from '@/theme/tokens';

/**
 * 테마 토큰에 접근하는 헬퍼 함수
 */
export function token<T extends keyof SemanticTokens>(
  path: string,
  theme: SemanticTokens
): string {
  const keys = path.split('.');
  let value: unknown = theme;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Token not found: ${path}`);
      return '#000000'; // fallback
    }
  }
  
  return typeof value === 'string' ? value : '#000000';
}

/**
 * 스타일 생성 유틸리티
 * 테마 토큰을 사용한 스타일을 쉽게 생성할 수 있습니다.
 */
export function createStyles<T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
  _stylesFn: (theme: SemanticTokens) => T
): T {
  // 이 함수는 런타임에 호출되어야 하므로, 실제로는 컴포넌트 내에서 사용
  throw new Error('createStyles는 컴포넌트 내에서 useTheme과 함께 사용해야 합니다.');
}

/**
 * 스타일 생성 훅
 */
export function useCreateStyles<T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
  stylesFn: (theme: SemanticTokens) => T
): T {
  const { tokens } = useTheme();
  return stylesFn(tokens);
}

/**
 * 조건부 스타일 적용
 */
export function conditionalStyle<T extends ViewStyle | TextStyle | ImageStyle>(
  condition: boolean,
  trueStyle: T,
  falseStyle?: T
): T | undefined {
  return condition ? trueStyle : falseStyle;
}

/**
 * 스타일 배열 병합
 */
export function mergeStyles<T extends ViewStyle | TextStyle | ImageStyle>(
  ...styles: (T | undefined | null | false)[]
): T[] {
  return styles.filter(Boolean) as T[];
}

/**
 * 반응형 스타일 생성
 */
export function responsiveStyle<T extends ViewStyle | TextStyle | ImageStyle>(
  breakpoints: Record<string, T>
): T {
  // 간단한 반응형 구현 (실제로는 Dimensions API 사용)
  const screenWidth = 375; // 기본값
  
  if (screenWidth < 768) {
    return breakpoints.sm || breakpoints.md || breakpoints.lg || {};
  } else if (screenWidth < 1024) {
    return breakpoints.md || breakpoints.lg || breakpoints.sm || {};
  } else {
    return breakpoints.lg || breakpoints.md || breakpoints.sm || {};
  }
}

/**
 * 애니메이션 스타일 생성
 */
export function createAnimationStyle<T extends ViewStyle | TextStyle | ImageStyle>(
  baseStyle: T,
  _animationProps: {
    duration?: number;
    easing?: string;
    delay?: number;
  } = {}
): T {
  return {
    ...baseStyle,
    // React Native에서는 애니메이션 스타일을 별도로 처리
  } as T;
}

/**
 * 테마 기반 스타일 생성
 */
export function createThemedStyles<T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
  stylesFn: (theme: SemanticTokens) => T
) {
  return function useThemedStyles() {
    const { tokens } = useTheme();
    return stylesFn(tokens);
  };
}

/**
 * 스타일 프리셋
 */
export const stylePresets = {
  card: (theme: SemanticTokens): ViewStyle => ({
    backgroundColor: theme.surface.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: theme.surface.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }),
  
  button: (theme: SemanticTokens): ViewStyle => ({
    backgroundColor: theme.brand.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  
  input: (theme: SemanticTokens): ViewStyle => ({
    backgroundColor: theme.surface.background,
    borderColor: theme.surface.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.text.primary,
  }),
  
  text: (theme: SemanticTokens): TextStyle => ({
    color: theme.text.primary,
    fontSize: 16,
    lineHeight: 24,
  }),
  
  heading: (theme: SemanticTokens): TextStyle => ({
    color: theme.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  }),
  
  caption: (theme: SemanticTokens): TextStyle => ({
    color: theme.text.muted,
    fontSize: 12,
    lineHeight: 16,
  }),
};
