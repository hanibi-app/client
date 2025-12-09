/**
 * Device Events 조회 React Query 훅
 * 기기의 이벤트 목록을 조회하는 훅입니다.
 */

import { useQuery } from '@tanstack/react-query';

import {
  DeviceEvent,
  DeviceEventListResponse,
  DeviceEventType,
  GetDeviceEventsParams,
  fetchDeviceEvents,
  fetchLatestDeviceEvent,
} from '@/api/deviceEvents';

/**
 * Device Events 조회 쿼리 키
 */
export const DEVICE_EVENTS_QUERY_KEY = ['device-events'] as const;

/**
 * 기기의 이벤트 목록을 조회하는 React Query 훅
 *
 * @param deviceId 조회할 기기의 ID
 * @param params 쿼리 파라미터 (type, limit, since)
 * @returns useQuery 객체 - 이벤트 목록을 반환합니다.
 *
 * @example
 * ```tsx
 * function DeviceEventsList({ deviceId }: { deviceId: string }) {
 *   const { data, isLoading, isError, refetch } = useDeviceEvents(deviceId, {
 *     type: 'FOOD_INPUT',
 *     limit: 10,
 *   });
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>에러 발생</Text>;
 *
 *   return (
 *     <View>
 *       {data?.events.map((event) => (
 *         <Text key={event.id}>{event.type}: {event.createdAt}</Text>
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
export function useDeviceEvents(deviceId: string, params?: GetDeviceEventsParams) {
  return useQuery<DeviceEventListResponse>({
    queryKey: [...DEVICE_EVENTS_QUERY_KEY, deviceId, params],
    queryFn: () => fetchDeviceEvents(deviceId, params),
    enabled: !!deviceId,
    staleTime: 30 * 1000, // 30초간 캐시 유지
    retry: 1,
  });
}

/**
 * 기기의 최신 이벤트를 조회하는 React Query 훅
 *
 * @param deviceId 조회할 기기의 ID
 * @param type 이벤트 타입 (선택)
 * @returns useQuery 객체 - 최신 이벤트를 반환합니다.
 *
 * @example
 * ```tsx
 * function LatestFoodInput({ deviceId }: { deviceId: string }) {
 *   const { data: latestEvent } = useLatestDeviceEvent(deviceId, 'FOOD_INPUT');
 *
 *   if (!latestEvent) return <Text>이벤트 없음</Text>;
 *
 *   return (
 *     <View>
 *       <Text>최근 음식 투입: {latestEvent.createdAt}</Text>
 *       <Text>무게 변화: {latestEvent.metadata?.deltaWeight}g</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useLatestDeviceEvent(deviceId: string, type?: DeviceEventType) {
  return useQuery<DeviceEvent | null>({
    queryKey: [...DEVICE_EVENTS_QUERY_KEY, deviceId, 'latest', type],
    queryFn: () => fetchLatestDeviceEvent(deviceId, type),
    enabled: !!deviceId,
    staleTime: 30 * 1000, // 30초간 캐시 유지
    retry: 1,
  });
}
