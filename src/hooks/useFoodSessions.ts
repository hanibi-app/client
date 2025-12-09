/**
 * 음식 투입 세션 조회 React Query 훅
 * 센서 이벤트와 스냅샷을 조합하여 세션 단위로 묶어 반환하는 훅입니다.
 */

import { useMemo } from 'react';

import type { FoodInputSession } from '@/types/foodSession';
import { buildSessionsFromEventsAndSnapshots } from '@/utils/foodSession';

import { useSensorEvents } from './useSensorEvents';
import { useSnapshots } from './useSnapshots';

/**
 * 음식 투입 세션을 조회하는 훅
 *
 * @param deviceId 조회할 기기의 ID
 * @returns 세션 배열 및 로딩/에러 상태
 *
 * @example
 * ```tsx
 * function FoodSessionsList({ deviceId }: { deviceId: string }) {
 *   const { data: sessions, isLoading, isError } = useFoodSessions(deviceId);
 *
 *   if (isLoading) return <Text>세션을 불러오는 중...</Text>;
 *   if (isError) return <Text>세션을 불러오지 못했습니다.</Text>;
 *
 *   return (
 *     <View>
 *       {sessions?.map((session) => (
 *         <Text key={session.sessionId}>
 *           세션 시작: {session.startedAt}
 *         </Text>
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
export function useFoodSessions(
  deviceId: string,
  options?: { refetchInterval?: number | false; enabled?: boolean },
) {
  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
    refetch: refetchEvents,
  } = useSensorEvents(deviceId, 100, options);

  // 카메라 스냅샷 조회 (이미지 URL은 에러가 나도 괜찮지만 메타데이터는 받을 수 있음)
  const {
    data: snapshots,
    isLoading: snapshotsLoading,
    isError: snapshotsError,
    refetch: refetchSnapshots,
  } = useSnapshots(deviceId, 20, undefined, undefined, options);

  const sessions = useMemo<FoodInputSession[] | undefined>(() => {
    if (!events) return undefined;

    // 이벤트와 스냅샷을 조합하여 세션 배열 생성
    return buildSessionsFromEventsAndSnapshots(events, snapshots);
  }, [events, snapshots]);

  // 디버깅 로그 제거 (429 에러 방지)

  // refetch 함수: 이벤트를 다시 가져오면 세션도 자동으로 재계산됨
  const refetch = async () => {
    const result = await refetchEvents();
    return result;
  };

  return {
    data: sessions,
    isLoading: eventsLoading || snapshotsLoading,
    isError: eventsError || snapshotsError,
    refetch,
  };
}
