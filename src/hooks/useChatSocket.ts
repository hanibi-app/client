/**
 * 채팅 WebSocket 훅
 * Socket.io를 사용하여 실시간 채팅 메시지를 수신합니다.
 */

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

import { useAuthStore } from '@/store/authStore';

// 환경 변수에서 API baseURL 가져오기
const API_BASE_URL = process.env.EXPO_PUBLIC_HANIBI_API_BASE_URL || '';

export interface UseChatSocketOptions {
  deviceId: string;
}

/**
 * 채팅 WebSocket 훅
 * 특정 deviceId에 대해 joinChannel하고, chatMessage 이벤트가 오면 메시지 목록을 갱신합니다.
 *
 * @param options WebSocket 옵션
 *
 * @example
 * ```tsx
 * function ChatScreen({ deviceId }: { deviceId: string }) {
 *   useChatSocket({ deviceId });
 *   // ...
 * }
 * ```
 */
export function useChatSocket({ deviceId }: UseChatSocketOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!deviceId || !API_BASE_URL) {
      return;
    }

    // JWT 토큰 가져오기
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      console.warn('[useChatSocket] Access token이 없어 WebSocket 연결을 건너뜁니다.');
      return;
    }

    // Socket.io 클라이언트 생성
    const socket: Socket = io(`${API_BASE_URL}/chat`, {
      transports: ['websocket'],
      auth: {
        token: accessToken,
      },
      // 필요 시 추가 옵션
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // 채널 입장
    socket.emit('joinChannel', { deviceId });

    // 새 메시지 이벤트 수신
    socket.on('chatMessage', (payload: { deviceId: string; messageId: number }) => {
      if (payload.deviceId === deviceId) {
        // 메시지 목록 쿼리 무효화하여 refetch
        queryClient.invalidateQueries({
          queryKey: ['chat', 'messages', deviceId],
        });
      }
    });

    // 연결 성공 이벤트
    socket.on('connect', () => {
      console.log('[useChatSocket] WebSocket 연결 성공:', socket.id);
    });

    // 연결 실패 이벤트
    socket.on('connect_error', (error) => {
      console.error('[useChatSocket] WebSocket 연결 실패:', error);
    });

    // 연결 해제 이벤트
    socket.on('disconnect', (reason) => {
      console.log('[useChatSocket] WebSocket 연결 해제:', reason);
    });

    // cleanup: 컴포넌트 unmount 시 소켓 정리
    return () => {
      socket.off('chatMessage');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [deviceId, queryClient]);
}
