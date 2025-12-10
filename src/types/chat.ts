/**
 * 채팅 Intent 및 Metadata 타입 정의
 * 백엔드 API는 그대로 두고, 프론트엔드에서 추상화 레이어를 추가합니다.
 */

/**
 * 채팅 Intent 타입
 * 사용자가 요청하는 의도를 나타냅니다.
 */
export type ChatIntent =
  | 'STATUS_QUERY'
  | 'TEMPERATURE_QUERY'
  | 'HUMIDITY_QUERY'
  | 'WEIGHT_QUERY'
  | 'GAS_QUERY'
  | 'PROCESSING_STATUS_QUERY'
  | 'HISTORY_QUERY'
  | 'REPORT_QUERY'
  | 'ECO_SCORE_QUERY'
  | 'RANKING_QUERY'
  | 'SETTINGS_QUERY'
  | 'HELP_QUERY'
  | 'COMMAND_REQUEST';

/**
 * 채팅 Intent Metadata 타입
 * 메시지와 함께 전송되는 추가 정보입니다.
 */
export interface ChatIntentMetadata {
  intent?: ChatIntent;
  command?: string; // "device:start" 등
  payload?: Record<string, unknown>;
  context?: Record<string, unknown>;
  notificationType?: string;
  period?: 'TODAY' | 'WEEKLY' | 'MONTHLY' | string;
  sensors?: string[]; // ['temperature', 'humidity', 'weight', 'gas']
  [key: string]: unknown; // 백엔드는 Record<string, any>라서 열어둠
}

/**
 * Intent Preset 타입
 * Intent 버튼의 설정을 정의합니다.
 */
export interface IntentPreset {
  intent: ChatIntent;
  label: string; // 버튼 텍스트
  description?: string; // Tooltip이나 서브텍스트에 쓰기
  defaultContent: string; // 기본 채팅 문장
  buildMetadata?: (options?: unknown) => ChatIntentMetadata;
  category: 'STATUS' | 'SENSOR' | 'HISTORY' | 'REPORT' | 'SYSTEM' | 'HELP';
  icon?: string; // MaterialIcons 이름 (선택적)
}

