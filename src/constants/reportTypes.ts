/**
 * 리포트 타입 매핑 상수
 * UI에서 사용하는 타입 이름과 실제 API path에서 사용하는 타입 이름을 분리합니다.
 */

/**
 * UI에서 사용하는 리포트 타입 (사용자가 선택하는 타입)
 */
export type UiReportType = 'temperature' | 'humidity' | 'weight' | 'gas';

/**
 * API path에서 사용하는 리포트 타입 (백엔드 엔드포인트 path parameter)
 */
export type ApiReportType = 'temp' | 'humidity' | 'weight' | 'voc';

/**
 * UI 타입을 API path 타입으로 매핑하는 테이블
 */
export const REPORT_TYPE_PATH_MAP: Record<UiReportType, ApiReportType> = {
  temperature: 'temp',
  humidity: 'humidity',
  weight: 'weight',
  gas: 'voc',
} as const;

/**
 * UI 타입을 API path 타입으로 변환하는 함수
 * @param uiType UI에서 사용하는 리포트 타입
 * @returns API path에서 사용하는 리포트 타입
 */
export function mapUiTypeToApiType(uiType: UiReportType): ApiReportType {
  return REPORT_TYPE_PATH_MAP[uiType];
}

/**
 * 리포트 타입의 한글 라벨
 */
export const REPORT_TYPE_LABELS: Record<UiReportType, string> = {
  temperature: '온도',
  humidity: '습도',
  weight: '무게',
  gas: 'VOC',
} as const;
