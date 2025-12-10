/**
 * Intent 기반 메시지 전송 훅
 * Intent Preset을 사용하여 메시지를 전송하는 헬퍼 훅입니다.
 */

import { useCallback } from 'react';

import { ChatIntent, ChatIntentMetadata } from '@/types/chat';
import { useSendChatMessage } from './useChatSendMessage';

export interface UseSendIntentMessageOptions {
  deviceId: string;
}

export interface SendIntentMessageArgs {
  intent: ChatIntent;
  defaultContent?: string;
  metadata?: ChatIntentMetadata;
}

/**
 * Intent 기반 메시지 전송 훅
 * Intent Preset을 사용하여 메시지를 전송합니다.
 *
 * @param options 옵션
 * @returns sendIntentMessage 함수
 *
 * @example
 * ```tsx
 * function ChatScreen({ deviceId }: { deviceId: string }) {
 *   const sendIntentMessage = useSendIntentMessage({ deviceId });
 *
 *   const handleStatusQuery = () => {
 *     sendIntentMessage({
 *       intent: 'STATUS_QUERY',
 *       defaultContent: '현재 기기 상태 알려줘',
 *       metadata: { intent: 'STATUS_QUERY' },
 *     });
 *   };
 *
 *   return <Button onPress={handleStatusQuery} title="상태 조회" />;
 * }
 * ```
 */
export function useSendIntentMessage({ deviceId }: UseSendIntentMessageOptions) {
  const { mutate: sendMessage } = useSendChatMessage({ deviceId });

  const sendIntentMessage = useCallback(
    (args: SendIntentMessageArgs) => {
      const { intent, defaultContent, metadata } = args;

      sendMessage({
        content: defaultContent ?? '요청을 처리해줘',
        metadata: {
          intent,
          ...(metadata ?? {}),
        },
      });
    },
    [sendMessage],
  );

  return sendIntentMessage;
}
