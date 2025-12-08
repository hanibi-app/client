/**
 * Reports 관련 API 타입 정의
 * Hanibi 백엔드의 Reports 엔드포인트 응답 구조를 정의합니다.
 */

import { ApiResponse } from '../authTypes';

/**
 * 공통 응답 래퍼 타입 (재export)
 */
export type { ApiResponse };

/**
 * Eco Score 관련 타입
 */
export type EcoScoreComponents = {
  processedAmount: number;
  efficiency: number;
  co2Savings: number;
  metrics: Record<string, number | string | null>;
};

export type EcoScoreResponse = {
  score: number;
  components: EcoScoreComponents;
};

/**
 * Weekly Summary 관련 타입
 */
export type WeeklyMetricSummary = {
  value: number;
  previousValue: number;
  changeRate: number;
};

export type WeeklySummaryResponse = {
  weekStart: string;
  weekEnd: string;
  processedAmount: WeeklyMetricSummary;
  co2Savings: WeeklyMetricSummary;
  energyEfficiency: WeeklyMetricSummary;
};

/**
 * Ranking 관련 타입
 */
export type RankingPeriod = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type RankingItem = {
  rank: number;
  name: string;
  score: number;
  isMe?: boolean;
};

export type RankingResponse = {
  period: RankingPeriod;
  items: RankingItem[];
};

/**
 * Sensor Report 관련 타입
 */
export type SensorDataPoint = {
  time: string; // 'HH:mm' 또는 ISO String
  value: number;
};

export type SensorSummaryItem = {
  value: number;
  time: string;
};

export type SensorSummary = {
  current: number;
  max: SensorSummaryItem;
  min: SensorSummaryItem;
  average: number;
  referenceDate: string;
};

export type SensorReportResponse = {
  dataPoints: SensorDataPoint[];
  summary: SensorSummary;
};
