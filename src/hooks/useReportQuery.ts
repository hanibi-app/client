import { useQuery } from '@tanstack/react-query';

import { Metric } from '@/types/navigation';

// 리포트 데이터 타입 정의
export interface ReportData {
  metric: Metric;
  current: number;
  average: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'danger';
  chartData: Array<{ timestamp: string; value: number }>;
}

// 리포트 데이터 조회 훅
export function useReportData(metric: Metric) {
  return useQuery({
    queryKey: ['report', metric],
    queryFn: async (): Promise<ReportData> => {
      // TODO: 실제 API 호출로 교체
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        temperature: {
          current: 25.3,
          average: 24.8,
          min: 22.1,
          max: 28.5,
          trend: 'up' as const,
          status: 'normal' as const,
        },
        humidity: {
          current: 65.2,
          average: 63.8,
          min: 45.0,
          max: 78.3,
          trend: 'stable' as const,
          status: 'normal' as const,
        },
        metal: {
          current: 0.8,
          average: 0.9,
          min: 0.3,
          max: 1.2,
          trend: 'down' as const,
          status: 'normal' as const,
        },
        voc: {
          current: 120.5,
          average: 115.2,
          min: 80.0,
          max: 180.0,
          trend: 'up' as const,
          status: 'normal' as const,
        },
      };

      const baseData = mockData[metric];

      // 차트 데이터 생성 (최근 24시간)
      const chartData = [];
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now);
        timestamp.setHours(timestamp.getHours() - i);
        chartData.push({
          timestamp: timestamp.toISOString(),
          value: baseData.current + (Math.random() - 0.5) * 10,
        });
      }

      return {
        metric,
        ...baseData,
        chartData,
      };
    },
    refetchInterval: 60000, // 1분마다 갱신
    staleTime: 30000,
  });
}

// 알림 데이터 조회 훅
export function useAlertsData() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async (): Promise<
      Array<{
        id: string;
        type: 'temperature' | 'humidity' | 'metal' | 'voc';
        message: string;
        timestamp: string;
        read: boolean;
        severity: 'low' | 'medium' | 'high';
      }>
    > => {
      // TODO: 실제 API 호출로 교체
      await new Promise(resolve => setTimeout(resolve, 500));

      return [
        {
          id: 'alert-001',
          type: 'temperature',
          message: '온도가 정상 범위를 벗어났습니다.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
          read: false,
          severity: 'medium',
        },
        {
          id: 'alert-002',
          type: 'humidity',
          message: '습도가 높습니다. 환기를 권장합니다.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
          read: true,
          severity: 'low',
        },
      ];
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
}
