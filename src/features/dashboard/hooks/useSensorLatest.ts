/**
 * 최신 센서 데이터 조회 React Query 훅
 * 5초마다 자동으로 최신 센서 데이터를 폴링합니다.
 * -999 값은 null로 변환되어 반환됩니다.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchSensorLatest } from '@/api/sensors';
import type { SensorLatestData } from '@/api/types/devices';

/**
 * 센서 데이터 폴링 간격 (밀리초)
 * 기본값: 5초
 */
export const SENSOR_POLLING_INTERVAL = 5000;

/**
 * 최신 센서 데이터를 조회하는 React Query 훅
 * 5초마다 자동으로 데이터를 갱신합니다.
 * 인증이 필요하지 않습니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @param options 추가 옵션 (enabled, refetchInterval 등)
 * @returns useQuery 객체 - 센서 데이터를 반환합니다 (processingStatus 포함)
 *
 * @example
 * ```tsx
 * function DashboardScreen() {
 *   const { data, isLoading, isError, refetch } = useSensorLatest('HANIBI-ESP32-001');
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>에러 발생</Text>;
 *
 *   return (
 *     <View>
 *       <Text>온도: {data?.temperature ?? '--'}°C</Text>
 *       <Text>습도: {data?.humidity ?? '--'}%</Text>
 *       <Text>처리 상태: {data?.processingStatus}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useSensorLatest(
  deviceId?: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery<SensorLatestData>({
    queryKey: ['sensor-latest', deviceId],
    enabled: options?.enabled !== false && !!deviceId,
    queryFn: async () => {
      if (!deviceId) {
        throw new Error('deviceId is required');
      }
      return fetchSensorLatest(deviceId);
    },
    refetchInterval: options?.refetchInterval ?? SENSOR_POLLING_INTERVAL, // 기본 5초마다 자동 폴링
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000, // 10초간 캐시 유지
    retry: 1,
  });
}
