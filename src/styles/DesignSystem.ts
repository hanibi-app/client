/**
 * 한니비 앱 디자인 시스템 - 메인 인덱스
 * 
 * 이 파일은 앱의 모든 디자인 시스템 요소들을 통합하고 내보냅니다.
 * 개발자들이 일관된 디자인 시스템을 쉽게 사용할 수 있도록 합니다.
 */

// 컬러 시스템
export * from './Colors';
export { default as Colors } from './Colors';

// 타이포그래피 시스템
export * from './Typography';
export { default as Typography } from './Typography';

// 스페이싱 시스템
export * from './Spacing';
export { default as Spacing } from './Spacing';

// 그림자 시스템
export * from './Shadows';
export { default as Shadows } from './Shadows';

// 디자인 시스템 상수
export const DesignSystem = {
  // 버전 정보
  version: '1.0.0',
  
  // 브랜드 정보
  brand: {
    name: '한니비',
    description: '한니비 앱 디자인 시스템',
    primaryColor: '#90C695',
    secondaryColor: '#A8D8EA',
  },
  
  // 디자인 토큰
  tokens: {
    // 브레이크포인트 (웹용)
    breakpoints: {
      mobile: 320,
      tablet: 768,
      desktop: 1024,
      wide: 1440,
    },
    
    // 애니메이션
    animation: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500,
      },
      easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
      },
    },
    
    // 테두리 반경
    borderRadius: {
      none: 0,
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
    },
    
    // 테두리 두께
    borderWidth: {
      none: 0,
      thin: 1,
      thick: 2,
      thicker: 3,
    },
    
    // Z-인덱스
    zIndex: {
      base: 0,
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060,
    },
  },
  
  // 컴포넌트 가이드라인
  components: {
    // 버튼
    button: {
      sizes: {
        small: { height: 32, paddingHorizontal: 16 },
        medium: { height: 40, paddingHorizontal: 24 },
        large: { height: 48, paddingHorizontal: 32 },
      },
      variants: {
        primary: { backgroundColor: '#90C695', color: '#FFFFFF' },
        secondary: { backgroundColor: '#A8D8EA', color: '#2D3436' },
        outline: { backgroundColor: 'transparent', borderColor: '#90C695', color: '#90C695' },
        ghost: { backgroundColor: 'transparent', color: '#90C695' },
      },
    },
    
    // 입력 필드
    input: {
      sizes: {
        small: { height: 32, paddingHorizontal: 12 },
        medium: { height: 40, paddingHorizontal: 16 },
        large: { height: 48, paddingHorizontal: 20 },
      },
      states: {
        default: { borderColor: '#E0E0E0' },
        focused: { borderColor: '#90C695' },
        error: { borderColor: '#F44336' },
        disabled: { backgroundColor: '#F5F5F5', color: '#9E9E9E' },
      },
    },
    
    // 카드
    card: {
      variants: {
        default: { backgroundColor: '#FFFFFF', shadow: 'sm' },
        elevated: { backgroundColor: '#FFFFFF', shadow: 'lg' },
        outlined: { backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' },
        filled: { backgroundColor: '#F5F1EB' },
      },
    },
  },
  
  // 접근성 가이드라인
  accessibility: {
    // 최소 터치 영역
    minTouchTarget: 44,
    
    // 최소 텍스트 크기
    minTextSize: 16,
    
    // 색상 대비 비율
    contrastRatio: {
      normal: 4.5,
      large: 3.0,
    },
    
    // 포커스 표시
    focus: {
      outline: '2px solid #90C695',
      outlineOffset: 2,
    },
  },
  
  // 국제화 (i18n) 지원
  i18n: {
    // 지원 언어
    supportedLanguages: ['ko', 'en'],
    
    // 기본 언어
    defaultLanguage: 'ko',
    
    // 텍스트 방향
    textDirection: {
      ko: 'ltr',
      en: 'ltr',
    },
    
    // 숫자 형식
    numberFormat: {
      ko: { decimal: '.', thousands: ',' },
      en: { decimal: '.', thousands: ',' },
    },
  },
};

// 디자인 시스템 유틸리티 함수
export const DesignSystemUtils = {
  // 테마 생성
  createTheme: (overrides: any = {}) => ({
    ...DesignSystem,
    ...overrides,
  }),
  
  // 반응형 값 계산
  responsive: (values: any, breakpoint: string) => {
    const breakpoints = DesignSystem.tokens.breakpoints;
    const currentBreakpoint = breakpoints[breakpoint as keyof typeof breakpoints];
    
    if (typeof values === 'object' && values[currentBreakpoint]) {
      return values[currentBreakpoint];
    }
    
    return values;
  },
  
  // 색상 유효성 검사
  isValidColor: (color: string) => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-9.]+\s*\)$/;
    
    return hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color);
  },
  
  // 스타일 병합
  mergeStyles: (...styles: any[]) => {
    return styles.reduce((merged, style) => {
      if (style && typeof style === 'object') {
        return { ...merged, ...style };
      }
      return merged;
    }, {});
  },
  
  // 조건부 스타일
  conditionalStyle: (condition: boolean, trueStyle: any, falseStyle: any = {}) => {
    return condition ? trueStyle : falseStyle;
  },
  
  // 스타일 배열 생성
  createStyleArray: (...styles: any[]) => {
    return styles.filter(Boolean);
  },
};

// 디자인 시스템 타입 정의
export type DesignSystemType = typeof DesignSystem;
export type ColorPaletteType = typeof DesignSystem.tokens;
export type ComponentGuidelinesType = typeof DesignSystem.components;

// 기본 내보내기
export default DesignSystem;

