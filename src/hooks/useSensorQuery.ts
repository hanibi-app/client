import { useQuery } from '@tanstack/react-query';

// 센서 데이터 타입 정의
export interface SensorData {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  metal: number;
  voc: number;
  status: 'normal' | 'warning' | 'danger';
}

// 센서 데이터 조회 훅
export function useSensorData() {
  return useQuery({
    queryKey: ['sensor', 'data'],
    queryFn: async (): Promise<SensorData> => {
      // TODO: 실제 API 호출로 교체
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연 시뮬레이션

      return {
        id: 'sensor-001',
        timestamp: new Date().toISOString(),
        temperature: 25.3,
        humidity: 65.2,
        metal: 0.8,
        voc: 120.5,
        status: 'normal',
      };
    },
    refetchInterval: 30000, // 30초마다 자동 갱신
    staleTime: 10000, // 10초간 캐시 유지
  });
}

// 특정 지표 데이터 조회 훅
export function useMetricData(metric: 'temperature' | 'humidity' | 'metal' | 'voc') {
  return useQuery({
    queryKey: ['sensor', 'metric', metric],
    queryFn: async (): Promise<{
      value: number;
      unit: string;
      status: string;
    }> => {
      // TODO: 실제 API 호출로 교체
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockData = {
        temperature: { value: 25.3, unit: '°C', status: 'normal' },
        humidity: { value: 65.2, unit: '%', status: 'normal' },
        metal: { value: 0.8, unit: 'mg/kg', status: 'normal' },
        voc: { value: 120.5, unit: 'ppb', status: 'normal' },
      };

      return mockData[metric];
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

// 센서 히스토리 데이터 조회 훅
export function useSensorHistory(metric: string, days: number = 7) {
  return useQuery({
    queryKey: ['sensor', 'history', metric, days],
    queryFn: async (): Promise<Array<{ timestamp: string; value: number }>> => {
      // TODO: 실제 API 호출로 교체
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 최근 7일간의 더미 데이터 생성
      const data = [];
      const now = new Date();
      for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          timestamp: date.toISOString(),
          value: Math.random() * 50 + 20, // 20-70 사이의 랜덤 값
        });
      }

      return data;
    },
    refetchInterval: 60000, // 1분마다 갱신
    staleTime: 30000,
  });
}
