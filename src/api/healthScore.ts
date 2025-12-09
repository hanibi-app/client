/**
 * Health Score 관련 API 함수
 * Hanibi 백엔드의 Health Score 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';

/**
 * Health Score 상세 정보
 */
export type HealthScoreDetails = {
  timeRange: {
    from: string;
    to: string;
  };
  temperaturePenalty: number;
  humidityPenalty: number;
  offlinePenalty: number;
  errorPenalty: number;
  [key: string]: unknown;
};

/**
 * Health Score 응답 타입
 */
export type HealthScoreResponse = {
  deviceId: string;
  score: number; // 0-100
  details: HealthScoreDetails;
};

/**
 * Health Score 조회 쿼리 파라미터
 */
export type GetHealthScoreParams = {
  from?: string; // ISO date string
  to?: string; // ISO date string
};

/**
 * 기기의 헬스 스코어 조회
 *
 * @param deviceId 조회할 기기의 ID
 * @param params 쿼리 파라미터 (from, to)
 * @returns Promise<HealthScoreResponse> 헬스 스코어 정보
 *
 * @example
 * ```tsx
 * const healthScore = await fetchHealthScore('HANIBI-ESP32-001', {
 *   from: '2024-01-01T00:00:00Z',
 *   to: '2024-01-02T00:00:00Z',
 * });
 * console.log(`헬스 스코어: ${healthScore.score}`);
 * ```
 */
export async function fetchHealthScore(
  deviceId: string,
  params?: GetHealthScoreParams,
): Promise<HealthScoreResponse> {
  const response = await apiClient.get<ApiResponse<HealthScoreResponse>>(
    `/api/v1/devices/${deviceId}/health-score`,
    {
      params,
    },
  );
  return response.data.data;
}

/**
 * Reports 네임스페이스를 통한 헬스 스코어 조회
 *
 * @param deviceId 조회할 기기의 ID
 * @param params 쿼리 파라미터 (from, to)
 * @returns Promise<HealthScoreResponse> 헬스 스코어 정보
 *
 * @example
 * ```tsx
 * const healthScore = await fetchHealthScoreFromReports('HANIBI-ESP32-001');
 * console.log(`헬스 스코어: ${healthScore.score}`);
 * ```
 */
export async function fetchHealthScoreFromReports(
  deviceId: string,
  params?: GetHealthScoreParams,
): Promise<HealthScoreResponse> {
  const response = await apiClient.get<ApiResponse<HealthScoreResponse>>(
    '/api/v1/reports/health-score',
    {
      params: {
        deviceId,
        ...params,
      },
    },
  );
  return response.data.data;
}
