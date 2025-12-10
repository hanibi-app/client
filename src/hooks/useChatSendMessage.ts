/**
 * 채팅 메시지 전송 React Query 훅
 * useMutation을 활용하여 채팅 메시지 전송 기능을 제공합니다.
 */

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { sendChatMessage, type ChatMessage, type SendChatMessageRequest } from '@/api/chat';

/**
 * 채팅 메시지 쿼리 키 생성 함수
 * 추후 GET /api/v1/chat/:deviceId/messages 연동 시 사용할 수 있습니다.
 */
export const CHAT_MESSAGES_QUERY_KEY = (deviceId: string) =>
  ['chat', deviceId, 'messages'] as const;

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
export function useChatSendMessage(
  deviceId: string,
  options?: Omit<UseMutationOptions<ChatMessage, Error, SendChatMessageRequest>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, Error, SendChatMessageRequest>({
    mutationFn: (payload) => sendChatMessage(deviceId, payload),
    onSuccess: (data, variables, context) => {
      // 성공 시 채팅 메시지 쿼리 캐시 무효화 (추후 GET API 연동 시 자동 갱신)
      queryClient.invalidateQueries({
        queryKey: CHAT_MESSAGES_QUERY_KEY(deviceId),
      });

      // 옵션으로 전달된 onSuccess 콜백 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // 서버 에러 메시지 로깅
      console.error('[useChatSendMessage] 메시지 전송 실패:', error);

      // 옵션으로 전달된 onError 콜백 실행
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
}
