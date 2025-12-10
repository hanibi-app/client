/**
 * 빠른 명령(Quick Commands) React Query 훅
 * useQuery와 useMutation을 활용하여 빠른 명령 조회 및 실행 기능을 제공합니다.
 */

import { useMutation, useQuery, type UseMutationOptions } from '@tanstack/react-query';

import { type ChatMessage } from '@/api/chat';
import {
    executeQuickCommand,
    getQuickCommands,
    type QuickCommand,
} from '@/api/chatQuickCommands';

/**
 * 빠른 명령 쿼리 키 생성 함수
 */
export const QUICK_COMMANDS_QUERY_KEY = ['chat', 'quick-commands'] as const;

/**
 * 빠른 명령 목록 조회 훅
 * 활성화된(isActive === true) 빠른 명령만 반환하며, sortOrder 오름차순으로 정렬합니다.
 *
 * @returns useQuery 객체 - 빠른 명령 배열을 반환합니다.
 *
 * @example
 * ```tsx
 * function QuickCommandBar() {
 *   const { data: commands, isLoading, isError } = useQuickCommands();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (isError) return <Text>빠른 명령을 불러오지 못했어요</Text>;
 *
 *   return (
 *     <View>
 *       {commands?.map((cmd) => (
 *         <Button key={cmd.id} title={cmd.label} />
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
export function useQuickCommands() {
  return useQuery<QuickCommand[], Error>({
    queryKey: QUICK_COMMANDS_QUERY_KEY,
    queryFn: async () => {
      try {
        const commands = await getQuickCommands();
        // isActive === true인 것만 필터링하고 sortOrder 오름차순 정렬
        return commands
          .filter((cmd) => cmd.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      } catch (error) {
        console.error('[useQuickCommands] 빠른 명령 목록 조회 실패:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1, // 실패 시 1번 재시도
  });
}

/**
 * 빠른 명령 실행 훅 옵션
 */
export interface UseExecuteQuickCommandOptions {
  deviceId: string;
  onSuccessAppendMessage?: (message: ChatMessage) => void;
}

/**
 * 빠른 명령 실행 훅
 * 특정 기기에 빠른 명령을 실행합니다.
 * 성공 시 반환된 채팅 메시지를 컴포넌트에서 바로 사용할 수 있도록 합니다.
 *
 * @param options 빠른 명령 실행 옵션
 * @returns useMutation 객체 - 빠른 명령 실행 요청을 처리합니다.
 *
 * @example
 * ```tsx
 * function QuickCommandBar({ deviceId, onAppendMessage }: Props) {
 *   const { mutate: executeCommand, isPending } = useExecuteQuickCommand({
 *     deviceId,
 *     onSuccessAppendMessage: onAppendMessage,
 *   });
 *
 *   const handleCommandPress = (commandId: string) => {
 *     executeCommand({ commandId });
 *   };
 *
 *   return (
 *     <Button
 *       onPress={() => handleCommandPress('cmd-001')}
 *       disabled={isPending}
 *       title="처리 시작"
 *     />
 *   );
 * }
 * ```
 */
export function useExecuteQuickCommand(
  options: UseExecuteQuickCommandOptions,
  mutationOptions?: Omit<
    UseMutationOptions<ChatMessage, Error, { commandId: string }>,
    'mutationFn'
  >,
) {
  const { deviceId, onSuccessAppendMessage } = options;

  return useMutation<ChatMessage, Error, { commandId: string }>({
    mutationFn: ({ commandId }) => executeQuickCommand(deviceId, commandId),
    onSuccess: (message, variables, context) => {
      // 1) 채팅 리스트에 새 메시지 추가
      onSuccessAppendMessage?.(message);

      // 2) 옵션으로 전달된 onSuccess 콜백 실행
      if (mutationOptions?.onSuccess) {
        mutationOptions.onSuccess(message, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // 서버 에러 메시지 로깅
      console.error('[useExecuteQuickCommand] 빠른 명령 실행 실패:', error);

      // 옵션으로 전달된 onError 콜백 실행
      if (mutationOptions?.onError) {
        mutationOptions.onError(error, variables, context);
      }
    },
    ...mutationOptions,
  });
}

