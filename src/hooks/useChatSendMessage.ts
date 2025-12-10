/**
 * 채팅 메시지 전송 React Query 훅
 * useMutation을 활용하여 채팅 메시지 전송 기능을 제공합니다.
 */

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { sendChatMessage, type ChatMessage, type SendChatMessageRequest } from '@/api/chat';

import { chatMessagesQueryKey } from './useChatMessages';

/**
 * 채팅 메시지 전송 훅
 * 특정 기기에 채팅 메시지를 전송합니다.
 * 성공 시 반환된 메시지를 컴포넌트에서 바로 사용할 수 있도록 합니다.
 *
 * @param deviceId 기기 ID
 * @param options 추가 useMutation 옵션
 * @returns useMutation 객체 - 채팅 메시지 전송 요청을 처리합니다.
 *
 * @example
 * ```tsx
 * function ChatScreen({ deviceId }: { deviceId: string }) {
 *   const [messages, setMessages] = useState<ChatMessage[]>([]);
 *   const { sendMessage, isPending, error } = useChatSendMessage(deviceId, {
 *     onSuccess: (data) => {
 *       // 성공 시 메시지 리스트에 추가
 *       setMessages(prev => [...prev, data]);
 *     },
 *     onError: (error) => {
 *       console.error('메시지 전송 실패:', error);
 *       // UI에서 Snackbar/Toast로 에러 표시 가능
 *     },
 *   });
 *
 *   const handleSend = () => {
 *     sendMessage({
 *       content: '현재 기기 상태 알려줘',
 *       metadata: { intent: 'STATUS_QUERY' }
 *     });
 *   };
 *
 *   return (
 *     <Button
 *       onPress={handleSend}
 *       disabled={isPending}
 *       title={isPending ? '전송 중...' : '전송'}
 *     />
 *   );
 * }
 * ```
 */
export interface UseSendChatMessageOptions {
  deviceId: string;
}

export function useSendChatMessage({ deviceId }: UseSendChatMessageOptions) {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, Error, SendChatMessageRequest>({
    mutationFn: (body) => sendChatMessage(deviceId, body),
    onSuccess: (newMessage) => {
      // 1) 캐시에 바로 추가 (optimistic update)
      queryClient.setQueryData<ChatMessage[] | undefined>(
        chatMessagesQueryKey(deviceId, 50),
        (old) => {
          if (!old) return [newMessage];
          // 이미 ASC 정렬된 상태라고 가정하고, 새 메시지를 끝에 추가
          return [...old, newMessage];
        },
      );

      // 2) 다른 limit 값들도 업데이트 (선택적)
      queryClient.setQueryData<ChatMessage[] | undefined>(
        chatMessagesQueryKey(deviceId, 100),
        (old) => {
          if (!old) return [newMessage];
          return [...old, newMessage];
        },
      );
    },
    onError: (error) => {
      // 서버 에러 메시지 로깅
      console.error('[useSendChatMessage] 메시지 전송 실패:', error);
      // 필요 시 별도 토스트/알림
    },
  });
}

/**
 * @deprecated useSendChatMessage를 사용하세요
 * 기존 코드 호환성을 위해 유지
 */
export function useChatSendMessage(
  deviceId: string,
  _options?: Omit<UseMutationOptions<ChatMessage, Error, SendChatMessageRequest>, 'mutationFn'>,
) {
  const { mutate, ...rest } = useSendChatMessage({ deviceId });
  return {
    ...rest,
    mutate,
    sendMessage: mutate,
  };
}
