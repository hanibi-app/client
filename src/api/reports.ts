/**
 * Reports 관련 API 래퍼
 * Hanibi 백엔드의 Reports 엔드포인트를 호출하는 함수들을 제공합니다.
 */

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
   * @param type 센서 타입 (예: 'humidity', 'temperature' 등)
   * @param range 조회 범위 (예: '1일', '1주', '1개월' 등)
   * @returns Promise<SensorReportResponse> 센서 리포트 정보
   *
   * @example
   * ```tsx
   * const report = await reportsApi.fetchSensorReport('humidity', '1일');
   * console.log(`현재 습도: ${report.summary.current}`);
   * ```
   */
  fetchSensorReport: async (type: string, range: string): Promise<SensorReportResponse> => {
    const response = await apiClient.get<ApiResponse<SensorReportResponse>>(
      `/api/v1/reports/${type}`,
      {
        params: {
          range,
        },
      },
    );
    return response.data.data;
  },
};

/**
 * 개별 함수 export (하위 호환성)
 */
export const fetchEcoScore = reportsApi.fetchEcoScore;
export const fetchWeeklySummary = reportsApi.fetchWeeklySummary;
export const fetchRanking = reportsApi.fetchRanking;
export const fetchSensorReport = reportsApi.fetchSensorReport;
