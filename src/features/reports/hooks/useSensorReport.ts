/**
 * Sensor Report 조회 React Query 훅
 * 센서 타입별 리포트 정보를 조회하는 훅입니다.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchSensorReport } from '@/api/reports';
import type { SensorReportResponse } from '@/api/types/reports';

/**
 * Sensor Report 조회 쿼리 키
 */
export const SENSOR_REPORT_QUERY_KEY = ['reports', 'sensor'] as const;

/**
 * Sensor Report를 조회하는 React Query 훅
 * 1분간 캐시를 유지합니다.
 *
 * @param type 센서 타입 (예: 'humidity', 'temperature', 'weight' 등)
 * @param range 조회 범위 (예: '1일', '1주', '1개월' 등)
 * @returns useQuery 객체 - Sensor Report 정보를 반환합니다.
 *
 * @example
 * ```tsx
 * function SensorReportView() {
 *   const { data, isLoading, isError, refetch } = useSensorReport('humidity', '1일');
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>에러 발생</Text>;
 *
 *   return (
 *     <View>
 *       <Text>현재 습도: {data?.summary.current}%</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useSensorReport(type: string, range: string, options?: { enabled?: boolean }) {
  return useQuery<SensorReportResponse>({
    queryKey: [...SENSOR_REPORT_QUERY_KEY, type, range],
    queryFn: () => fetchSensorReport(type, range),
    staleTime: 1 * 60 * 1000, // 1분간 캐시 유지
    retry: 1,
    enabled: options?.enabled !== false, // 기본값은 true
  });
}
