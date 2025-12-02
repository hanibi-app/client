/**
 * 기기 명령 관련 React Query 훅
 * useQuery와 useMutation을 활용하여 기기 명령 전송 및 이력 조회 기능을 제공합니다.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';

import {
  getDeviceCommands,
  sendDeviceCommand,
  type CreateDeviceCommandRequest,
  type DeviceCommand,
} from '@/api/deviceCommands';
import { useAuthStore } from '@/store/authStore';

/**
 * 기기 명령 이력 조회 쿼리 키 생성 함수
 */
export const DEVICE_COMMANDS_QUERY_KEY = (deviceId: string) =>
  ['devices', deviceId, 'commands'] as const;

/**
 * 기기 명령 이력 조회 훅
 * 특정 기기의 명령 이력을 조회합니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @param options 추가 useQuery 옵션
 * @returns useQuery 객체 - 명령 이력 배열을 반환합니다.
 *
 * @example
 * ```tsx
 * function DeviceDetailScreen({ deviceId }: { deviceId: string }) {
 *   const { data: commands, isLoading, isError } = useDeviceCommandsQuery(deviceId);
 *
 *   if (isLoading) return <Text>명령 이력을 불러오는 중...</Text>;
 *   if (isError) return <Text>명령 이력을 불러오지 못했습니다.</Text>;
 *
 *   return (
 *     <View>
 *       {commands?.map((cmd) => (
 *         <Text key={cmd.id}>{cmd.commandType} - {cmd.status}</Text>
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
export function useDeviceCommandsQuery(
  deviceId: string,
  options?: Omit<UseQueryOptions<DeviceCommand[], Error>, 'queryKey' | 'queryFn'>,
) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<DeviceCommand[], Error>({
    queryKey: DEVICE_COMMANDS_QUERY_KEY(deviceId),
    queryFn: () => getDeviceCommands(deviceId),
    enabled: !!deviceId && !!accessToken,
    staleTime: 30 * 1000, // 30초간 캐시 유지
    retry: 1,
    ...options,
  });
}

/**
 * 기기 명령 전송 변수 타입
 */
type SendDeviceCommandVariables = {
  deviceId: string;
  body: CreateDeviceCommandRequest;
};

/**
 * 기기 명령 전송 훅
 * 특정 기기에 명령을 전송합니다.
 * 성공 시 명령 이력 쿼리를 자동으로 최신화합니다.
 *
 * @param options 추가 useMutation 옵션
 * @returns useMutation 객체 - 기기 명령 전송 요청을 처리합니다.
 *
 * @example
 * ```tsx
 * function DeviceControlPanel({ deviceId }: { deviceId: string }) {
 *   const { mutate: sendCommand, isPending } = useSendDeviceCommandMutation({
 *     onSuccess: () => {
 *       Alert.alert('완료', '기기에 명령을 전송했어요.');
 *     },
 *     onError: () => {
 *       Alert.alert('오류', '기기에 명령을 전송하지 못했어요.');
 *     },
 *   });
 *
 *   const handleStart = () => {
 *     sendCommand({
 *       deviceId,
 *       body: {
 *         commandType: 'START',
 *         temperature: 22,
 *         intervalSeconds: 5,
 *         extraPayload: { custom: true },
 *       },
 *     });
 *   };
 *
 *   return (
 *     <Button
 *       onPress={handleStart}
 *       disabled={isPending}
 *       title={isPending ? '전송 중...' : '가동 시작'}
 *     />
 *   );
 * }
 * ```
 */
export function useSendDeviceCommandMutation(
  options?: Omit<
    UseMutationOptions<DeviceCommand, Error, SendDeviceCommandVariables>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<DeviceCommand, Error, SendDeviceCommandVariables>({
    mutationFn: ({ deviceId, body }) => sendDeviceCommand(deviceId, body),
    onSuccess: (created, variables, context) => {
      // 명령 전송 후 명령 이력 쿼리 무효화하여 자동으로 최신화
      queryClient.invalidateQueries({
        queryKey: DEVICE_COMMANDS_QUERY_KEY(variables.deviceId),
      });
      if (options?.onSuccess) {
        options.onSuccess(created, variables, context);
      }
    },
    ...options,
  });
}
