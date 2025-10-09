/**
 * 다크 테마 색상 매핑
 * 
 * 다크 모드에서 사용되는 색상 토큰 매핑을 정의합니다.
 * 눈의 피로를 줄이고 배터리 수명을 절약하기 위해 설계되었습니다.
 */

import { brandColors, colorUtils, neutralColors, SemanticTokens, signalColors } from './tokens';

export const darkTheme: SemanticTokens = {
  // 브랜드 색상
  brand: {
    primary: brandColors.green[400],
    primaryText: colorUtils.getAccessibleTextColor(brandColors.green[400]),
    secondary: brandColors.mint[400],
    secondaryText: colorUtils.getAccessibleTextColor(brandColors.mint[400]),
  },

  // 배경/표면 색상
  surface: {
    background: neutralColors.gray[950],
    card: neutralColors.gray[900],
    elevated: neutralColors.gray[800],
    border: neutralColors.gray[700],
    divider: neutralColors.gray[700],
  },

  // 텍스트 색상
  text: {
    primary: neutralColors.gray[50],
    secondary: neutralColors.gray[300],
    muted: neutralColors.gray[400],
    inverse: neutralColors.gray[900],
  },

  // 상태 색상
  state: {
    safe: signalColors.blue[400],      // 안전 (밝은 파란색)
    caution: signalColors.orange[400], // 주의 (밝은 주황색)
    danger: signalColors.red[500],     // 위험 (밝은 빨간색)
    info: signalColors.blue[400],     // 정보 (밝은 파란색)
    success: brandColors.green[400],   // 성공 (밝은 초록색)
    warning: signalColors.yellow[400], // 경고 (밝은 노란색)
    error: signalColors.red[500],      // 오류 (밝은 빨간색)
  },

  // 상호작용 색상
  action: {
    focus: colorUtils.withOpacity(brandColors.green[400], 0.3),
    hover: colorUtils.withOpacity(brandColors.green[400], 0.15),
    pressed: colorUtils.withOpacity(brandColors.green[400], 0.3),
    disabledBg: neutralColors.gray[800],
    disabledText: neutralColors.gray[600],
  },

  // 차트 색상
  chart: {
    temperature: signalColors.red[400],    // 온도 (밝은 빨간색)
    humidity: signalColors.blue[400],     // 습도 (밝은 파란색)
    metal: signalColors.teal[400],        // 금속 (밝은 청록색)
    voc: brandColors.green[400],          // VOC (밝은 초록색)
    grid: neutralColors.gray[700],        // 그리드 (어두운 회색)
    axis: neutralColors.gray[400],        // 축 (중간 회색)
  },

  // 오버레이 색상
  overlay: {
    scrim: colorUtils.withOpacity(neutralColors.gray[950], 0.8),
    subtle: colorUtils.withOpacity(neutralColors.gray[0], 0.1),
  },
};
