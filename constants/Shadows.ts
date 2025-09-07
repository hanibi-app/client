/**
 * 한니비 앱 디자인 시스템 - 그림자와 엘리베이션
 * 
 * 이 파일은 앱에서 사용되는 모든 그림자와 엘리베이션을 정의합니다.
 * Material Design과 iOS Human Interface Guidelines를 참고하여 일관된 깊이감을 제공합니다.
 */

import { Platform } from 'react-native';

// 그림자 레벨 정의
export const ShadowLevel = {
  none: 0,
  xs: 1,      // 매우 작은 그림자
  sm: 2,      // 작은 그림자
  md: 4,      // 중간 그림자
  lg: 8,      // 큰 그림자
  xl: 16,     // 매우 큰 그림자
  xxl: 24,    // 거대한 그림자
};

// iOS 그림자 스타일
export const iOSShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  
  xxl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
  },
};

// Android 엘리베이션 스타일
export const AndroidElevations = {
  none: {
    elevation: 0,
  },
  
  xs: {
    elevation: 1,
  },
  
  sm: {
    elevation: 2,
  },
  
  md: {
    elevation: 4,
  },
  
  lg: {
    elevation: 8,
  },
  
  xl: {
    elevation: 12,
  },
  
  xxl: {
    elevation: 16,
  },
};

// 크로스 플랫폼 그림자 스타일
export const Shadows = Platform.select({
  ios: iOSShadows,
  android: AndroidElevations,
  default: iOSShadows,
});

// 컴포넌트별 그림자 스타일
export const ComponentShadows = {
  // 카드
  card: {
    default: Shadows.sm,
    hover: Shadows.md,
    pressed: Shadows.xs,
    elevated: Shadows.lg,
  },
  
  // 버튼
  button: {
    default: Shadows.xs,
    hover: Shadows.sm,
    pressed: Shadows.none,
    disabled: Shadows.none,
  },
  
  // 입력 필드
  input: {
    default: Shadows.xs,
    focused: Shadows.sm,
    error: Shadows.xs,
  },
  
  // 모달
  modal: {
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: Shadows.xl,
  },
  
  // 툴팁
  tooltip: {
    default: Shadows.md,
    arrow: Shadows.sm,
  },
  
  // 드롭다운
  dropdown: {
    default: Shadows.md,
    open: Shadows.lg,
  },
  
  // 플로팅 액션 버튼
  fab: {
    default: Shadows.lg,
    pressed: Shadows.md,
  },
  
  // 앱바
  appBar: {
    default: Shadows.sm,
    elevated: Shadows.md,
  },
  
  // 바텀 시트
  bottomSheet: {
    default: Shadows.xl,
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  },
};

// 특수 그림자 효과
export const SpecialShadows = {
  // 글래스모피즘 효과
  glassmorphism: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  
  // 네온 효과
  neon: {
    shadowColor: '#90C695',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  
  // 인셋 그림자 (내부 그림자)
  inset: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // React Native에서는 내부 그림자를 직접 지원하지 않으므로
    // 별도의 구현이 필요할 수 있습니다
  },
  
  // 컬러 그림자
  colored: {
    primary: {
      shadowColor: '#90C695',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    secondary: {
      shadowColor: '#A8D8EA',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    accent: {
      shadowColor: '#7BC8A4',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  },
};

// 그림자 유틸리티 함수
export const ShadowUtils = {
  // 그림자 레벨 조절
  adjustLevel: (baseShadow: any, level: number) => {
    if (Platform.OS === 'ios') {
      return {
        ...baseShadow,
        shadowOpacity: Math.min(0.3, baseShadow.shadowOpacity * (level / 4)),
        shadowRadius: baseShadow.shadowRadius * (level / 4),
      };
    } else {
      return {
        ...baseShadow,
        elevation: Math.min(16, baseShadow.elevation * (level / 4)),
      };
    }
  },
  
  // 그림자 색상 변경
  changeColor: (baseShadow: any, color: string) => ({
    ...baseShadow,
    shadowColor: color,
  }),
  
  // 그림자 투명도 조절
  adjustOpacity: (baseShadow: any, opacity: number) => {
    if (Platform.OS === 'ios') {
      return {
        ...baseShadow,
        shadowOpacity: opacity,
      };
    }
    return baseShadow;
  },
  
  // 그림자 크기 조절
  adjustSize: (baseShadow: any, scale: number) => {
    if (Platform.OS === 'ios') {
      return {
        ...baseShadow,
        shadowOffset: {
          width: baseShadow.shadowOffset.width * scale,
          height: baseShadow.shadowOffset.height * scale,
        },
        shadowRadius: baseShadow.shadowRadius * scale,
      };
    }
    return baseShadow;
  },
  
  // 그림자 병합
  merge: (shadow1: any, shadow2: any) => {
    if (Platform.OS === 'ios') {
      return {
        shadowColor: shadow1.shadowColor,
        shadowOffset: {
          width: (shadow1.shadowOffset.width + shadow2.shadowOffset.width) / 2,
          height: (shadow1.shadowOffset.height + shadow2.shadowOffset.height) / 2,
        },
        shadowOpacity: Math.max(shadow1.shadowOpacity, shadow2.shadowOpacity),
        shadowRadius: Math.max(shadow1.shadowRadius, shadow2.shadowRadius),
      };
    } else {
      return {
        elevation: Math.max(shadow1.elevation, shadow2.elevation),
      };
    }
  },
};

// 그림자 상수
export const ShadowConstants = {
  // 최소 그림자 크기
  minShadowSize: 1,
  
  // 최대 그림자 크기
  maxShadowSize: 32,
  
  // 기본 그림자 색상
  defaultShadowColor: '#000000',
  
  // 그림자 투명도 범위
  shadowOpacityRange: {
    min: 0.05,
    max: 0.5,
    default: 0.15,
  },
  
  // 그림자 반경 범위
  shadowRadiusRange: {
    min: 1,
    max: 32,
    default: 8,
  },
};

export default Shadows;

