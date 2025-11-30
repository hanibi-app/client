/**
 * 컴포넌트 그림자 스타일 정의
 *
 * React Native의 shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation을 정의합니다.
 */

export const componentShadows = {
  button: {
    default: {
      shadowColor: 'rgba(0,0,0,0.15)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
  },
} as const;

export type ComponentShadows = typeof componentShadows;

