/**
 * Reports 관련 API 래퍼
 * Hanibi 백엔드의 Reports 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { mapUiTypeToApiType, type UiReportType } from '@/constants/reportTypes';

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';
import type {
  EcoScoreResponse,
  RankingPeriod,
  RankingResponse,
  SensorReportResponse,
  WeeklySummaryResponse,
} from './types/reports';

/**
 * Reports API 함수들
 */
export const reportsApi = {
  /**
   * Eco Score 조회
   * 사용자의 환경 점수를 조회합니다.
   *
   * @returns Promise<EcoScoreResponse> Eco Score 정보
   *
   * @example
   * ```tsx
   * const ecoScore = await reportsApi.fetchEcoScore();
   * console.log(`환경 점수: ${ecoScore.score}`);
   * ```
   */
  fetchEcoScore: async (): Promise<EcoScoreResponse> => {
    const response = await apiClient.get<ApiResponse<EcoScoreResponse>>(
      '/api/v1/reports/eco-score',
    );
    return response.data.data;
  },

  /**
   * Weekly Summary 조회
   * 주간 요약 정보를 조회합니다.
   *
   * @returns Promise<WeeklySummaryResponse> 주간 요약 정보
   *
   * @example
   * ```tsx
   * const summary = await reportsApi.fetchWeeklySummary();
   * console.log(`처리량 변화율: ${summary.processedAmount.changeRate}%`);
   * ```
   */
  fetchWeeklySummary: async (): Promise<WeeklySummaryResponse> => {
    const response = await apiClient.get<ApiResponse<WeeklySummaryResponse>>(
      '/api/v1/reports/weekly-summary',
    );
    return response.data.data;
  },

  /**
   * Ranking 조회
   * 기간별 랭킹 정보를 조회합니다.
   *
   * @param period 랭킹 기간 (HOURLY | DAILY | WEEKLY | MONTHLY)
   * @returns Promise<RankingResponse> 랭킹 정보
   *
   * @example
   * ```tsx
   * const ranking = await reportsApi.fetchRanking('DAILY');
   * console.log(`내 순위: ${ranking.items.find(item => item.isMe)?.rank}`);
   * ```
   */
  fetchRanking: async (period: RankingPeriod): Promise<RankingResponse> => {
    const response = await apiClient.get<ApiResponse<RankingResponse>>('/api/v1/reports/ranking', {
      params: {
        period,
      },
    });
    return response.data.data;
  },

  /**
   * Sensor Report 조회
   * 센서 타입별 리포트 정보를 조회합니다.
   *
   * @param uiType UI에서 사용하는 센서 타입 (예: 'temperature', 'humidity', 'weight', 'gas')
   * @param range 조회 범위 (예: '1일', '1주', '1개월' 등)
   * @returns Promise<SensorReportResponse> 센서 리포트 정보
   *
   * @example
   * ```tsx
   * const report = await reportsApi.fetchSensorReport('temperature', '1일');
   * console.log(`현재 온도: ${report.summary.current}`);
   * ```
   */
  fetchSensorReport: async (uiType: UiReportType, range: string): Promise<SensorReportResponse> => {
    try {
      // UI 타입을 API path 타입으로 변환
      const pathType = mapUiTypeToApiType(uiType);
      const url = `/api/v1/reports/${pathType}`;
      const params = { range };

      if (__DEV__) {
        console.log(
          `[reportsApi.fetchSensorReport] 호출 시작: typeRaw=${uiType}, type=${pathType}, url=${url}, params=`,
          params,
        );
      }

      const response = await apiClient.get<ApiResponse<SensorReportResponse>>(url, {
        params,
      });

      const data = response.data.data;

      // 응답 데이터 검증
      if (!data) {
        throw new Error(
          `[reportsApi.fetchSensorReport] 응답 데이터가 없습니다: typeRaw=${uiType}, type=${pathType}`,
        );
      }

      if (!Array.isArray(data.dataPoints)) {
        throw new Error(
          `[reportsApi.fetchSensorReport] dataPoints가 배열이 아닙니다: typeRaw=${uiType}, type=${pathType}`,
        );
      }

      if (!data.summary) {
        throw new Error(
          `[reportsApi.fetchSensorReport] summary가 없습니다: typeRaw=${uiType}, type=${pathType}`,
        );
      }

      // 데이터 포인트 값 검증 (백엔드에서 number로 변환되지만 안전성 체크)
      const validatedDataPoints = data.dataPoints.map((point) => ({
        time: point.time,
        value: typeof point.value === 'number' && !isNaN(point.value) ? point.value : 0,
      }));

      if (__DEV__) {
        console.log(
          `[reportsApi.fetchSensorReport] 성공: typeRaw=${uiType}, type=${pathType}, range=${range}, dataPoints=${validatedDataPoints.length}`,
        );
      }

      return {
        ...data,
        dataPoints: validatedDataPoints,
      };
    } catch (error) {
      const pathType = mapUiTypeToApiType(uiType);
      console.error(
        `[reportsApi.fetchSensorReport] 실패: typeRaw=${uiType}, type=${pathType}, range=${range}, url=/api/v1/reports/${pathType}`,
        error,
      );
      // AxiosError인 경우 상세 정보 로깅
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } };
        console.error(
          `[reportsApi.fetchSensorReport] 에러 상세: status=${axiosError.response?.status}, data=`,
          axiosError.response?.data,
        );
      }
      throw error;
    }
  },
};

/**
 * 개별 함수 export (하위 호환성)
 */
export const fetchEcoScore = reportsApi.fetchEcoScore;
export const fetchWeeklySummary = reportsApi.fetchWeeklySummary;
export const fetchRanking = reportsApi.fetchRanking;
export const fetchSensorReport = reportsApi.fetchSensorReport;
