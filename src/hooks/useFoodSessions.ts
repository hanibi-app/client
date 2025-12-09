/**
 * 음식 투입 세션 조회 React Query 훅
 * 센서 이벤트와 스냅샷을 조합하여 세션 단위로 묶어 반환하는 훅입니다.
 */

import { useMemo } from 'react';

import type { FoodInputSession } from '@/types/foodSession';
import { buildSessionsFromEventsAndSnapshots } from '@/utils/foodSession';

import { useSensorEvents } from './useSensorEvents';

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
export function useFoodSessions(deviceId: string) {
  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useSensorEvents(deviceId);

  // TODO: 카메라 API가 정상 작동하면 주석 해제
  // const {
  //   data: snapshots,
  //   isLoading: snapshotsLoading,
  //   isError: snapshotsError,
  // } = useSnapshots(deviceId);

  // 임시: 카메라 API가 정상 작동할 때까지 undefined 전달
  const snapshots = undefined;
  const snapshotsLoading = false;
  const snapshotsError = false;

  const sessions = useMemo<FoodInputSession[] | undefined>(() => {
    if (!events) return undefined;

    // 이벤트와 스냅샷을 조합하여 세션 배열 생성
    return buildSessionsFromEventsAndSnapshots(events, snapshots);
  }, [events, snapshots]);

  return {
    data: sessions,
    isLoading: eventsLoading || snapshotsLoading,
    isError: eventsError || snapshotsError,
  };
}
