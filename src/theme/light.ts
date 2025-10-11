/**
 * 라이트 테마 색상 매핑
 *
 * 라이트 모드에서 사용되는 색상 토큰 매핑을 정의합니다.
 * 높은 대비와 가독성을 위해 설계되었습니다.
 */

import { brandColors, colorUtils, neutralColors, SemanticTokens, signalColors } from './tokens';

export const lightTheme: SemanticTokens = {
  // 브랜드 색상
  brand: {
    primary: brandColors.green[500],
    primaryText: colorUtils.getAccessibleTextColor(brandColors.green[500]),
    secondary: brandColors.mint[500],
    secondaryText: colorUtils.getAccessibleTextColor(brandColors.mint[500]),
  },

  // 배경/표면 색상
  surface: {
    overlay: colorUtils.withOpacity(neutralColors.gray[900], 0.5),
    background: neutralColors.gray[50],
    card: neutralColors.gray[0],
    elevated: neutralColors.gray[0],
    border: neutralColors.gray[200],
    divider: neutralColors.gray[200],
  },

  // 텍스트 색상
  text: {
    primary: neutralColors.gray[900],
    secondary: neutralColors.gray[700],
    muted: neutralColors.gray[500],
    inverse: neutralColors.gray[0],
  },

  // 상태 색상
  state: {
    safe: signalColors.blue[500], // 안전 (파란색)
    caution: signalColors.orange[500], // 주의 (주황색)
    danger: signalColors.red[600], // 위험 (빨간색)
    info: signalColors.blue[500], // 정보 (파란색)
    success: brandColors.green[600], // 성공 (초록색)
    warning: signalColors.yellow[600], // 경고 (노란색)
    error: signalColors.red[600], // 오류 (빨간색)
  },

  // 상호작용 색상
  action: {
    focus: colorUtils.withOpacity(brandColors.green[500], 0.2),
    hover: colorUtils.withOpacity(brandColors.green[500], 0.1),
    pressed: colorUtils.withOpacity(brandColors.green[500], 0.2),
    disabledBg: neutralColors.gray[200],
    disabledText: neutralColors.gray[400],
  },

  // 차트 색상
  chart: {
    temperature: signalColors.red[500], // 온도 (빨간색)
    humidity: signalColors.blue[500], // 습도 (파란색)
    metal: signalColors.teal[500], // 금속 (청록색)
    voc: brandColors.green[500], // VOC (초록색)
    grid: neutralColors.gray[200], // 그리드 (연한 회색)
    axis: neutralColors.gray[500], // 축 (중간 회색)
  },

  // 오버레이 색상
  overlay: {
    scrim: colorUtils.withOpacity(neutralColors.gray[900], 0.5),
    subtle: colorUtils.withOpacity(neutralColors.gray[900], 0.1),
  },
  // 신호 색상
  signal: {
    success: brandColors.green[600],
    warning: signalColors.yellow[600],
    danger: signalColors.red[600],
  },
};
