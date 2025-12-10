/**
 * 채팅 관련 API 래퍼
 * Hanibi 백엔드의 Chat 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { ChatIntentMetadata } from '@/types/chat';

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';

/**
 * 채팅 메시지 역할 타입
 */
export type ChatMessageRole = 'system' | 'user' | 'assistant' | 'device' | string;

/**
 * 디바이스 상태 타입
 */
export type DeviceStatus = 'IDLE' | 'PROCESSING' | 'PAUSED' | 'ERROR' | 'OFFLINE' | string;

/**
 * 기기 요약 정보 타입
 * 채팅 메시지에 포함되는 기기 정보입니다.
 */
export type DeviceSummary = {
  id: number;
  deviceId: string;
  deviceName: string | null;
  connectionStatus: 'ONLINE' | 'OFFLINE' | string;
  deviceStatus: 'IDLE' | 'PROCESSING' | string;
  lastHeartbeat: string | null;
  rtspUrl: string | null;
  // TODO: RTSP 기반 실시간 스트림/스냅샷 연동은 추후 Camera 모듈과 함께 구현
  // cameraModel: string | null;
  // cameraUsername: string | null;
  // cameraPassword: string | null;
};

/**
 * 채팅 사용자 요약 정보 타입
 * 채팅 메시지에 포함되는 사용자 정보입니다.
 */
export type ChatUserSummary = {
  id: number;
  email: string;
  nickname: string;
  emailVerified?: boolean;
};

/**
 * 채팅 메시지 타입
 */
export type ChatMessage = {
  id: number;
  createdAt: string;
  updatedAt: string;
  device: DeviceSummary;
  user: ChatUserSummary | null; // system/assistant는 null일 수 있음
  role: ChatMessageRole;
  content: string;
  metadata?: Record<string, unknown> | null;
};

/**
 * 채팅 메시지 전송 요청 페이로드 타입
 */
export type SendChatMessageRequest = {
  content: string;
  metadata?: ChatIntentMetadata;
};

/**
 * 채팅 메시지 목록 조회 API 호출
 * @param deviceId 기기 ID (예: "ETCOM-001")
 * @param limit 조회할 최대 메시지 수 (기본 50)
 * @returns Promise<ChatMessage[]> 메시지 목록 (서버는 DESC 순으로 반환)
 *
 * @example
 * ```ts
 * const messages = await fetchChatMessages('ETCOM-001', 50);
 * ```
 */
export async function fetchChatMessages(deviceId: string, limit = 50): Promise<ChatMessage[]> {
  const response = await apiClient.get<ApiResponse<ChatMessage[]>>(
    `/api/v1/chat/${deviceId}/messages`,
    {
      params: { limit },
    },
  );

  // 응답 구조 검증
  if (!response.data.success || !response.data.data) {
    throw new Error('채팅 메시지 목록 조회 응답 형식이 올바르지 않습니다.');
  }

  return response.data.data;
}

/**
 * 채팅 메시지 전송 API 호출
 * @param deviceId 기기 ID (예: "ETCOM-001")
 * @param payload 메시지 내용 및 메타데이터
 * @returns Promise<ChatMessage> 전송된 메시지 정보
 *
 * @example
 * ```ts
 * const message = await sendChatMessage('ETCOM-001', {
 *   content: '현재 기기 상태 알려줘',
 *   metadata: {
 *     intent: 'STATUS_QUERY'
 *   }
 * });
 * ```
 */
export async function sendChatMessage(
  deviceId: string,
  payload: SendChatMessageRequest,
): Promise<ChatMessage> {
  const response = await apiClient.post<ApiResponse<ChatMessage>>(
    `/api/v1/chat/${deviceId}/messages`,
    payload,
  );

  // 응답 구조 검증
  if (!response.data.success || !response.data.data) {
    throw new Error('채팅 메시지 전송 응답 형식이 올바르지 않습니다.');
  }

  return response.data.data;
}
