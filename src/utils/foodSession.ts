/**
 * 음식 투입 세션 빌드 유틸 함수
 * 센서 이벤트와 스냅샷을 조합하여 세션 단위로 묶는 로직을 제공합니다.
 */

import type { FoodInputSession, SensorEvent, SnapshotMeta } from '@/types/foodSession';

/**
 * 스냅샷 매칭 시간 윈도우 (밀리초)
 * 이벤트 발생 시점과 ±2분 이내의 스냅샷을 매칭합니다.
 */
const SNAPSHOT_MATCH_WINDOW_MS = 2 * 60 * 1000; // 2분

/**
 * 이벤트를 시간순으로 정렬합니다 (오래된 것부터)
 */
function sortEventsByTime(events: SensorEvent[]): SensorEvent[] {
  return [...events].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeA - timeB;
  });
}

/**
 * 스냅샷을 시간순으로 정렬합니다 (오래된 것부터)
 */
function sortSnapshotsByTime(snapshots: SnapshotMeta[] | undefined): SnapshotMeta[] {
  if (!snapshots) return [];
  return [...snapshots].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeA - timeB;
  });
}

/**
 * 특정 시점에 가장 가까운 스냅샷을 찾습니다
 *
 * @param targetTime 기준 시점 (ISO 8601)
 * @param snapshots 스냅샷 배열
 * @param triggerType 찾을 스냅샷의 triggerType (optional)
 * @returns 매칭된 스냅샷 또는 undefined
 */
function findNearestSnapshot(
  targetTime: string,
  snapshots: SnapshotMeta[],
  triggerType?: 'FOOD_INPUT_BEFORE' | 'FOOD_INPUT_AFTER',
): SnapshotMeta | undefined {
  const targetTimestamp = new Date(targetTime).getTime();

  // triggerType이 지정된 경우 필터링
  const filteredSnapshots = triggerType
    ? snapshots.filter((s) => s.triggerType === triggerType)
    : snapshots;

  let nearest: SnapshotMeta | undefined;
  let minDiff = Infinity;

  for (const snapshot of filteredSnapshots) {
    const snapshotTime = new Date(snapshot.createdAt).getTime();
    const diff = Math.abs(snapshotTime - targetTimestamp);

    // 시간 윈도우 내에 있고, 가장 가까운 스냅샷 선택
    if (diff <= SNAPSHOT_MATCH_WINDOW_MS && diff < minDiff) {
      minDiff = diff;
      nearest = snapshot;
    }
  }

  return nearest;
}

/**
 * 이벤트에서 무게 정보를 추출합니다
 * payload에 weight 정보가 있는 경우 추출
 */
function extractWeightFromEvent(event: SensorEvent): number | undefined {
  if (event.payload && typeof event.payload.weight === 'number') {
    return event.payload.weight;
  }
  return undefined;
}

/**
 * 센서 이벤트와 스냅샷을 조합하여 음식 투입 세션 배열을 생성합니다
 *
 * @param events 센서 이벤트 배열
 * @param snapshots 스냅샷 메타데이터 배열 (optional, 현재는 주석 처리됨)
 * @returns FoodInputSession 배열
 */
export function buildSessionsFromEventsAndSnapshots(
  events: SensorEvent[],
  snapshots?: SnapshotMeta[],
): FoodInputSession[] {
  if (!events || events.length === 0) {
    return [];
  }

  // 이벤트를 시간순으로 정렬
  const sortedEvents = sortEventsByTime(events);
  // 스냅샷을 시간순으로 정렬 (현재는 사용하지 않지만 나중을 위해 준비)
  const sortedSnapshots = sortSnapshotsByTime(snapshots);

  const sessions: FoodInputSession[] = [];
  let currentSession: Partial<FoodInputSession> | null = null;

  for (const event of sortedEvents) {
    // FOOD_INPUT_BEFORE를 만나면 새로운 세션 시작
    if (event.eventType === 'FOOD_INPUT_BEFORE') {
      // 이전 세션이 완료되지 않았다면 저장 (진행 중 세션)
      if (currentSession) {
        sessions.push({
          sessionId:
            currentSession.sessionId || `session-${currentSession.beforeEvent?.id || 'unknown'}`,
          deviceId: currentSession.deviceId || event.deviceId,
          startedAt: currentSession.startedAt || currentSession.beforeEvent?.createdAt || '',
          endedAt: currentSession.endedAt,
          beforeEvent: currentSession.beforeEvent,
          afterEvent: currentSession.afterEvent,
          processingCompletedEvent: currentSession.processingCompletedEvent,
          weightChange: currentSession.weightChange,
          status: 'in_progress',
        });
      }

      // 새 세션 시작
      currentSession = {
        sessionId: `session-${event.id}`,
        deviceId: event.deviceId,
        startedAt: event.createdAt,
        beforeEvent: event,
        // 카메라 이미지는 RTSP가 안되어서 에러가 날 수 있지만 스냅샷 메타데이터는 받을 수 있음
        beforeSnapshot: findNearestSnapshot(event.createdAt, sortedSnapshots, 'FOOD_INPUT_BEFORE'),
        weightChange: {
          before: extractWeightFromEvent(event),
        },
        status: 'in_progress',
      };
    }
    // FOOD_INPUT_AFTER를 만나면 현재 세션에 추가
    else if (event.eventType === 'FOOD_INPUT_AFTER' && currentSession) {
      currentSession.afterEvent = event;
      currentSession.endedAt = event.createdAt;
      currentSession.status = 'completed';
      // 카메라 이미지는 RTSP가 안되어서 에러가 날 수 있지만 스냅샷 메타데이터는 받을 수 있음
      currentSession.afterSnapshot = findNearestSnapshot(
        event.createdAt,
        sortedSnapshots,
        'FOOD_INPUT_AFTER',
      );

      // 무게 정보 업데이트
      const afterWeight = extractWeightFromEvent(event);
      if (afterWeight !== undefined) {
        currentSession.weightChange = {
          ...currentSession.weightChange,
          after: afterWeight,
          diff:
            currentSession.weightChange?.before !== undefined
              ? afterWeight - currentSession.weightChange.before
              : undefined,
        };
      }
    }
    // PROCESSING_COMPLETED를 만나면 현재 세션에 추가하고 완료 처리
    else if (event.eventType === 'PROCESSING_COMPLETED' && currentSession) {
      currentSession.processingCompletedEvent = event;
      // endedAt이 없으면 PROCESSING_COMPLETED 시점을 종료 시점으로 설정
      if (!currentSession.endedAt) {
        currentSession.endedAt = event.createdAt;
      }
      currentSession.status = 'completed';
    }
  }

  // 마지막 세션이 완료되지 않았다면 저장
  if (currentSession) {
    sessions.push({
      sessionId:
        currentSession.sessionId || `session-${currentSession.beforeEvent?.id || 'unknown'}`,
      deviceId: currentSession.deviceId || '',
      startedAt: currentSession.startedAt || currentSession.beforeEvent?.createdAt || '',
      endedAt: currentSession.endedAt,
      beforeEvent: currentSession.beforeEvent,
      afterEvent: currentSession.afterEvent,
      processingCompletedEvent: currentSession.processingCompletedEvent,
      weightChange: currentSession.weightChange,
      status: currentSession.status || 'in_progress',
    });
  }

  // 최신 세션이 위로 오도록 역순 정렬
  return sessions.reverse();
}
