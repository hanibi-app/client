/**
 * Sensor Report 조회 React Query 훅
 * 센서 타입별 리포트 정보를 조회하는 훅입니다.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchSensorReport } from '@/api/reports';
import type { SensorReportResponse } from '@/api/types/reports';
import type { UiReportType } from '@/constants/reportTypes';

/**
 * Sensor Report 조회 쿼리 키
 */
export const SENSOR_REPORT_QUERY_KEY = ['reports', 'sensor'] as const;

/**
 * Sensor Report를 조회하는 React Query 훅
 * 1분간 캐시를 유지합니다.
 *
 * @param uiType UI에서 사용하는 센서 타입 (예: 'temperature', 'humidity', 'weight', 'gas')
 * @param range 조회 범위 (예: '1일', '1주', '1개월' 등)
 * @returns useQuery 객체 - Sensor Report 정보를 반환합니다.
 *
 * @example
 * ```tsx
 * function SensorReportView() {
 *   const { data, isLoading, isError, refetch } = useSensorReport('temperature', '1일');
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>에러 발생</Text>;
 *
 *   return (
 *     <View>
 *       <Text>현재 온도: {data?.summary.current}°C</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useSensorReport(
  uiType: UiReportType,
  range: string,
  options?: { enabled?: boolean },
) {
  return useQuery<SensorReportResponse>({
    queryKey: [...SENSOR_REPORT_QUERY_KEY, uiType, range],
    queryFn: async () => {
      try {
        const data = await fetchSensorReport(uiType, range);
        if (__DEV__) {
          console.log(
            `[useSensorReport] 데이터 수신 성공: typeRaw=${uiType}, range=${range}, dataPoints=${data.dataPoints.length}`,
          );
        }
        return data;
      } catch (error) {
        console.error(`[useSensorReport] API 호출 실패: typeRaw=${uiType}, range=${range}`, error);
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, // 1분간 캐시 유지
    retry: 1,
    enabled: options?.enabled !== false, // 기본값은 true
  });
}
