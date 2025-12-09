/**
 * 센서 이벤트 조회 React Query 훅
 * 특정 기기의 센서 이벤트 목록을 조회하는 훅입니다.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchSensorRequestLogs } from '@/api/sensors';
import type { SensorEvent } from '@/types/foodSession';

/**
 * 센서 이벤트 조회 쿼리 키 생성 함수
 */
export const SENSOR_EVENTS_QUERY_KEY = (deviceId: string, limit?: number) =>
  ['sensors', 'events', deviceId, limit] as const;

/**
 * 센서 이벤트를 조회하는 React Query 훅
 *
 * @param deviceId 조회할 기기의 ID
 * @param limit 조회할 최대 이벤트 수 (기본값: 100)
 * @returns useQuery 객체 - 센서 이벤트 배열을 반환합니다.
 *
 * @example
 * ```tsx
 * function SensorEventsList({ deviceId }: { deviceId: string }) {
 *   const { data: events, isLoading, isError } = useSensorEvents(deviceId);
 *
 *   if (isLoading) return <Text>이벤트를 불러오는 중...</Text>;
 *   if (isError) return <Text>이벤트를 불러오지 못했습니다.</Text>;
 *
 *   return (
 *     <View>
 *       {events?.map((event) => (
 *         <Text key={event.id}>{event.eventType} - {event.createdAt}</Text>
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
export function useSensorEvents(
  deviceId: string,
  limit = 100,
  options?: { refetchInterval?: number | false; enabled?: boolean },
) {
  return useQuery<SensorEvent[], Error>({
    queryKey: SENSOR_EVENTS_QUERY_KEY(deviceId, limit),
    queryFn: async () => {
      const events = await fetchSensorRequestLogs({
        deviceId,
        status: 'SUCCESS',
        limit,
      });

      // 디버깅 로그 제거 (429 에러 방지)

      return events;
    },
    enabled: options?.enabled !== false && !!deviceId,
    staleTime: 0, // 캐시 없이 항상 최신 데이터 가져오기
    refetchOnWindowFocus: false,
    refetchInterval: options?.refetchInterval ?? false, // 기본값은 자동 갱신 안 함, 옵션으로 전달 가능
  });
}
