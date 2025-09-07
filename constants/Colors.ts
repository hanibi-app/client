/**
 * 한니비 앱 디자인 시스템 - 컬러 팔레트
 * 
 * 이 파일은 앱에서 사용되는 모든 색상을 정의합니다.
 * 각 색상은 의미와 용도에 따라 체계적으로 분류되어 있습니다.
 */

// 기본 컬러 팔레트
export const ColorPalette = {
  // 메인 브랜드 컬러
  primary: {
    lightGreen: '#90C695',    // 연두 - 메인 브랜드 컬러
    lightBlue: '#A8D8EA',     // 옅은 파랑 - 보조 브랜드 컬러
    mint: '#7BC8A4',          // 민트 - 강조 컬러
  },
  
  // 중성 컬러
  neutral: {
    lightBeige: '#F5F1EB',    // 라이트베이지 - 배경 컬러
    cream: '#FFF8F0',         // 크림 - 카드 배경
    midGray: '#636E72',       // 미드 그레이 - 텍스트
    darkGray: '#2D3436',      // 다크 그레이 - 강조 텍스트
  },
  
  // 시맨틱 컬러
  semantic: {
    success: '#4CAF50',       // 성공
    warning: '#FF9800',       // 경고
    error: '#F44336',         // 에러
    info: '#2196F3',          // 정보
  },
  
  // 그라데이션 컬러
  gradient: {
    primary: ['#90C695', '#7BC8A4'],
    secondary: ['#A8D8EA', '#90C695'],
    warm: ['#F5F1EB', '#FFF8F0'],
  }
};

// 라이트/다크 모드별 컬러
export const Colors = {
  light: {
    // 배경
    background: ColorPalette.neutral.cream,
    surface: ColorPalette.neutral.lightBeige,
    card: '#FFFFFF',
    
    // 텍스트
    text: ColorPalette.neutral.darkGray,
    textSecondary: ColorPalette.neutral.midGray,
    textTertiary: '#9E9E9E',
    
    // 브랜드
    primary: ColorPalette.primary.lightGreen,
    secondary: ColorPalette.primary.lightBlue,
    accent: ColorPalette.primary.mint,
    
    // 테두리
    border: '#E0E0E0',
    divider: '#F0F0F0',
    
    // 상태
    success: ColorPalette.semantic.success,
    warning: ColorPalette.semantic.warning,
    error: ColorPalette.semantic.error,
    info: ColorPalette.semantic.info,
  },
  
  dark: {
    // 배경
    background: ColorPalette.neutral.darkGray,
    surface: '#424242',
    card: '#616161',
    
    // 텍스트
    text: ColorPalette.neutral.cream,
    textSecondary: ColorPalette.neutral.lightBeige,
    textTertiary: '#BDBDBD',
    
    // 브랜드
    primary: ColorPalette.primary.mint,
    secondary: ColorPalette.primary.lightBlue,
    accent: ColorPalette.primary.lightGreen,
    
    // 테두리
    border: '#757575',
    divider: '#424242',
    
    // 상태
    success: ColorPalette.semantic.success,
    warning: ColorPalette.semantic.warning,
    error: ColorPalette.semantic.error,
    info: ColorPalette.semantic.info,
  },
};

// 컬러 유틸리티 함수
export const ColorUtils = {
  // 투명도 조절
  withOpacity: (color: string, opacity: number) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
  
  // 밝기 조절
  lighten: (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
  
  // 어둡게 조절
  darken: (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};

export default Colors;
