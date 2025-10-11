/**
 * 색상 유틸리티 함수들
 *
 * 색상 변환, 투명도 조절, 대비 계산 등의 기능을 제공합니다.
 */

/**
 * hex 색상을 rgba로 변환
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * rgba 색상을 hex로 변환
 */
export function rgbaToHex(rgba: string): string {
  const values = rgba.match(/\d+/g);
  if (!values || values.length < 3) return '#000000';

  const r = parseInt(values[0]);
  const g = parseInt(values[1]);
  const b = parseInt(values[2]);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * 색상에 투명도 적용
 */
export function withOpacity(color: string, opacity: number): string {
  if (color.startsWith('#')) {
    return hexToRgba(color, opacity);
  }

  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }

  if (color.startsWith('rgba(')) {
    const values = color.match(/\d+/g);
    if (values && values.length >= 4) {
      const [r, g, b] = values;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }

  return color;
}

/**
 * 색상의 밝기 계산 (0-1)
 */
export function getLuminance(color: string): number {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const [rs, gs, bs] = [r, g, b].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 두 색상 간의 대비비 계산
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 접근성 기준 대비비 확인
 */
export function isAccessibleContrast(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA 기준
}

/**
 * 색상이 밝은지 어두운지 판단
 */
export function isLightColor(color: string): boolean {
  return getLuminance(color) > 0.5;
}

/**
 * 텍스트 색상 자동 선택 (배경에 따라)
 */
export function getTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}

/**
 * 색상 보정 (밝기 조절)
 */
export function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 색상 채도 조절
 */
export function adjustSaturation(color: string, amount: number): string {
  // 간단한 채도 조절 구현
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const gray = (r + g + b) / 3;
  const newR = Math.max(0, Math.min(255, gray + (r - gray) * amount));
  const newG = Math.max(0, Math.min(255, gray + (g - gray) * amount));
  const newB = Math.max(0, Math.min(255, gray + (b - gray) * amount));

  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}
