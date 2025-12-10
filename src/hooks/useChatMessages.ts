/**
 * 채팅 메시지 조회 React Query 훅
 * 특정 디바이스의 채팅 메시지 목록을 조회합니다.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchChatMessages, type ChatMessage } from '@/api/chat';

export interface UseChatMessagesOptions {
  deviceId: string;
  limit?: number; // default 50
}

/**
 * 채팅 메시지 조회 쿼리 키 생성 함수
 */
export const chatMessagesQueryKey = (deviceId: string, limit: number) =>
  ['chat', 'messages', deviceId, limit] as const;

/**
 * 채팅 메시지 조회 훅
 * 서버는 createdAt DESC(최신순)으로 반환하므로, UI에는 오래된 순(시간순)으로 정렬해서 반환합니다.
 *
 * @param options 채팅 메시지 조회 옵션
 * @returns useQuery 객체 - 채팅 메시지 배열을 반환합니다 (ASC 시간순)
 *
 * @example
 * ```tsx
 * function ChatScreen({ deviceId }: { deviceId: string }) {
 *   const { data: messages, isLoading } = useChatMessages({ deviceId, limit: 50 });
 *
 *   if (isLoading) return <ActivityIndicator />;
 *
 *   return (
 *     <FlatList
 *       data={messages}
 *       renderItem={({ item }) => <MessageBubble message={item} />}
 *     />
 *   );
 * }
 * ```
 */
export function useChatMessages({ deviceId, limit = 50 }: UseChatMessagesOptions) {
  return useQuery<ChatMessage[], Error>({
    queryKey: chatMessagesQueryKey(deviceId, limit),
    queryFn: () => fetchChatMessages(deviceId, limit),
    select: (data) => {
      // 서버는 DESC, UI는 ASC로 사용 (오래된 순 → 최신 순)
      return [...data].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    },
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30초간 캐시 유지 (429 에러 방지)
  });
}
