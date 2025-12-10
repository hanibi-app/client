/**
 * 빠른 명령(Quick Commands) 관련 API 래퍼
 * Hanibi 백엔드의 Quick Commands 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { ApiResponse } from './authTypes';
import { ChatMessage } from './chat';
import { apiClient } from './httpClient';

/**
 * 빠른 명령 액션 타입
 */
export type QuickCommandAction =
  | 'device:start'
  | 'device:stop'
  | 'device:pause'
  | 'device:resume'
  | 'device:set_temperature'
  | 'device:update_interval';

/**
 * 빠른 명령 페이로드 타입
 */
export interface QuickCommandPayload {
  temperature?: number; // set_temperature일 때
  intervalSeconds?: number; // update_interval일 때
}

/**
 * 빠른 명령 타입
 */
export interface QuickCommand {
  id: string;
  label: string; // 예: "처리 시작", "온도 25도로 설정"
  action: QuickCommandAction;
  payload: QuickCommandPayload | null;
  sortOrder: number;
  isActive: boolean;
}

/**
 * 빠른 명령 목록 조회 API 호출
 * @returns Promise<QuickCommand[]> 활성화된 빠른 명령 목록
 */
export async function getQuickCommands(): Promise<QuickCommand[]> {
  const response = await apiClient.get<ApiResponse<QuickCommand[]>>(
    '/api/v1/chat/quick-commands/list',
  );

  if (!response.data.success || !response.data.data) {
    throw new Error('빠른 명령 목록 조회 응답 형식이 올바르지 않습니다.');
  }

  return response.data.data;
}

/**
 * 빠른 명령 실행 API 호출
 * @param deviceId 기기 ID (예: "ETCOM-001")
 * @param commandId 빠른 명령 ID
 * @returns Promise<ChatMessage> 실행 결과로 생성된 채팅 메시지
 */
export async function executeQuickCommand(
  deviceId: string,
  commandId: string,
): Promise<ChatMessage> {
  const response = await apiClient.post<ApiResponse<ChatMessage>>(
    `/api/v1/chat/${deviceId}/quick-commands/${commandId}`,
  );

  if (!response.data.success || !response.data.data) {
    throw new Error('빠른 명령 실행 응답 형식이 올바르지 않습니다.');
  }

  return response.data.data;
}
