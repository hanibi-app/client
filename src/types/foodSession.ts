/**
 * 음식 투입 세션 관련 타입 정의
 * 센서 이벤트와 스냅샷을 조합하여 세션 단위로 묶기 위한 타입들을 정의합니다.
 */

/**
 * 센서 이벤트 타입
 */
export type SensorEventType =
  | 'FOOD_INPUT_BEFORE'
  | 'FOOD_INPUT_AFTER'
  | 'PROCESSING_COMPLETED'
  | 'DOOR_OPENED';

/**
 * 센서 이벤트 인터페이스
 */
export interface SensorEvent {
  id: string;
  deviceId: string;
  eventType: SensorEventType;
  createdAt: string; // ISO 8601
  // 필요하면 raw payload, requestLogId 등 추가
  payload?: Record<string, unknown>;
  requestLogId?: string;
}

/**
 * 스냅샷 메타데이터 인터페이스
 * 카메라 이미지는 RTSP가 안되어서 에러가 날 수 있지만 메타데이터는 받을 수 있음
 */
export interface SnapshotMeta {
  id: string;
  deviceId: string;
  triggerType?: 'FOOD_INPUT_BEFORE' | 'FOOD_INPUT_AFTER';
  createdAt: string;
  imageUrl: string; // GET /snapshots/:snapshotId/image 에 대한 URL (이미지는 에러가 날 수 있음)
}

/**
 * 음식 투입 세션 인터페이스
 * 여러 이벤트/스냅샷을 하나의 세션 단위로 묶기 위한 구조
 */
export interface FoodInputSession {
  sessionId: string;
  deviceId: string;
  startedAt: string; // FOOD_INPUT_BEFORE 시점
  endedAt?: string; // FOOD_INPUT_AFTER 또는 PROCESSING_COMPLETED 시점
  beforeEvent?: SensorEvent;
  afterEvent?: SensorEvent;
  processingCompletedEvent?: SensorEvent;
  // TODO: 카메라 API가 정상 작동하면 주석 해제
  // beforeSnapshot?: SnapshotMeta;
  // afterSnapshot?: SnapshotMeta;
  weightChange?: {
    before?: number;
    after?: number;
    diff?: number;
  };
  /**
   * 세션 상태
   * - 'in_progress': BEFORE만 있고 AFTER/PROCESSING_COMPLETED 없음
   * - 'completed': AFTER 또는 PROCESSING_COMPLETED 있음
   */
  status: 'in_progress' | 'completed';
}
