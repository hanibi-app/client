/**
 * 한니비 앱 디자인 시스템 - 타이포그래피
 * 
 * 이 파일은 앱에서 사용되는 모든 텍스트 스타일을 정의합니다.
 * 각 스타일은 의미와 용도에 따라 체계적으로 분류되어 있습니다.
 */

import { Platform } from 'react-native';

// 폰트 패밀리 정의
export const FontFamily = {
  // 기본 폰트
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  
  // 굵은 폰트
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
  
  // 이탤릭 폰트
  italic: Platform.select({
    ios: 'System',
    android: 'Roboto-Italic',
    default: 'System',
  }),
  
  // 모노스페이스 폰트 (코드나 숫자용)
  monospace: Platform.select({
    ios: 'Menlo',
    android: 'RobotoMono',
    default: 'Menlo',
  }),
};

// 폰트 크기 정의 (px를 React Native의 숫자로 변환)
export const FontSize = {
  // 헤딩
  h1: 32,        // 메인 타이틀 (Main Title)
  h2: 24,        // 섹션 제목 (Section Title)
  h3: 20,        // 카드 제목 (Card Title)
  
  // 본문
  bodyLarge: 18, // 중요한 텍스트 (Important Text)
  bodyRegular: 16, // 일반 텍스트 (Regular Text)
  bodySmall: 14,  // 보조 텍스트 (Auxiliary Text)
  
  // 캡션
  caption: 12,    // 설명 텍스트 (Description Text)
  
  // 추가 크기
  tiny: 10,      // 매우 작은 텍스트
  large: 22,     // 큰 텍스트
  xlarge: 28,    // 매우 큰 텍스트
};

// 폰트 굵기 정의
export const FontWeight = {
  thin: '100',
  ultraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
};

// 라인 높이 정의 (폰트 크기의 배수)
export const LineHeight = {
  tight: 1.2,    // 타이트한 라인 높이
  normal: 1.4,   // 일반적인 라인 높이
  relaxed: 1.6,  // 여유로운 라인 높이
  loose: 1.8,    // 매우 여유로운 라인 높이
};

// 문자 간격 정의
export const LetterSpacing = {
  tight: -0.5,   // 타이트한 문자 간격
  normal: 0,     // 일반적인 문자 간격
  wide: 0.5,     // 넓은 문자 간격
  wider: 1,      // 매우 넓은 문자 간격
};

// 타이포그래피 스타일 정의
export const Typography = {
  // 헤딩 스타일
  h1: {
    fontSize: FontSize.h1,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.h1 * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  
  h2: {
    fontSize: FontSize.h2,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.h2 * LineHeight.tight,
    letterSpacing: LetterSpacing.normal,
  },
  
  h3: {
    fontSize: FontSize.h3,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.h3 * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  // 본문 스타일
  bodyLarge: {
    fontSize: FontSize.bodyLarge,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.bodyLarge * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  bodyRegular: {
    fontSize: FontSize.bodyRegular,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.bodyRegular * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  bodySmall: {
    fontSize: FontSize.bodySmall,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.bodySmall * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
  
  // 캡션 스타일
  caption: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.caption * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },
  
  // 특수 스타일
  button: {
    fontSize: FontSize.bodyRegular,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.bodyRegular * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  },
  
  label: {
    fontSize: FontSize.bodySmall,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.bodySmall * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },
  
  code: {
    fontSize: FontSize.bodySmall,
    fontFamily: FontFamily.monospace,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.bodySmall * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
  },
};

// 타이포그래피 유틸리티 함수
export const TypographyUtils = {
  // 폰트 크기 조절
  scale: (baseSize: number, scale: number) => baseSize * scale,
  
  // 라인 높이 계산
  getLineHeight: (fontSize: number, multiplier: number = LineHeight.normal) => 
    fontSize * multiplier,
  
  // 폰트 스타일 병합
  merge: (baseStyle: any, overrideStyle: any) => ({
    ...baseStyle,
    ...overrideStyle,
  }),
  
  // 반응형 폰트 크기 (화면 크기에 따라 조절)
  responsive: (baseSize: number, scale: number = 1) => {
    // 여기에 반응형 로직을 추가할 수 있습니다
    return baseSize * scale;
  },
};

export default Typography;

