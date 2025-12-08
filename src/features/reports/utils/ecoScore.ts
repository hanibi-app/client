/**
 * 환경 점수(Eco Score) 관련 유틸리티 함수
 * 점수 구간별 색상, 라벨, 상태를 계산합니다.
 */

/**
 * 환경 점수 상태 타입
 */
export type EcoScoreLevel = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'VERY_POOR';

/**
 * 환경 점수 상태별 색상
 */
export const ECO_SCORE_COLORS: Record<EcoScoreLevel, string> = {
  EXCELLENT: '#40EA87', // 우수 - 초록색
  GOOD: '#6BE092', // 양호 - 연두색
  FAIR: '#FFD700', // 보통 - 노란색
  POOR: '#FF7017', // 부족 - 주황색
  VERY_POOR: '#ED5B5B', // 매우 부족 - 빨간색
};

/**
 * 환경 점수 상태별 한글 라벨
 */
export const ECO_SCORE_LABELS: Record<EcoScoreLevel, string> = {
  EXCELLENT: '우수',
  GOOD: '양호',
  FAIR: '보통',
  POOR: '부족',
  VERY_POOR: '매우 부족',
};

/**
 * 환경 점수 구간 정의
 */
const ECO_SCORE_RANGES: Record<EcoScoreLevel, { min: number; max: number }> = {
  EXCELLENT: { min: 80, max: 100 },
  GOOD: { min: 60, max: 79 },
  FAIR: { min: 40, max: 59 },
  POOR: { min: 20, max: 39 },
  VERY_POOR: { min: 0, max: 19 },
};

/**
 * 환경 점수에 따른 상태 레벨을 계산합니다.
 *
 * @param score 환경 점수 (0~100)
 * @returns 환경 점수 상태 레벨
 */
export function getEcoScoreLevel(score: number): EcoScoreLevel {
  if (score >= 80) return 'EXCELLENT';
  if (score >= 60) return 'GOOD';
  if (score >= 40) return 'FAIR';
  if (score >= 20) return 'POOR';
  return 'VERY_POOR';
}

/**
 * 환경 점수에 따른 색상을 반환합니다.
 *
 * @param score 환경 점수 (0~100)
 * @returns 색상 코드
 */
export function getEcoScoreColor(score: number): string {
  const level = getEcoScoreLevel(score);
  return ECO_SCORE_COLORS[level];
}

/**
 * 환경 점수에 따른 한글 라벨을 반환합니다.
 *
 * @param score 환경 점수 (0~100)
 * @returns 한글 라벨
 */
export function getEcoScoreLabel(score: number): string {
  const level = getEcoScoreLevel(score);
  return ECO_SCORE_LABELS[level];
}

/**
 * 환경 점수 상태 바 위치를 계산합니다.
 * 점수(0~100)를 퍼센트(0~100%)로 사용합니다.
 *
 * @param score 환경 점수 (0~100)
 * @returns 상태 바 위치 (0~100)
 */
export function getEcoScoreBarPosition(score: number): number {
  // 점수를 0~100 범위로 제한
  const clampedScore = Math.max(0, Math.min(100, score));
  return clampedScore;
}
