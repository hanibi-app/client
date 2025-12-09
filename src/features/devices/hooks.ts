/**
 * 기기 관련 React Query 훅
 * useQuery와 useMutation을 활용하여 기기 조회, 페어링, 수정 기능을 제공합니다.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Device, UpdateDeviceRequest, getDeviceById, updateDevice } from '@/api/devices';
import {
  Device as DeviceApiType,
  PairDevicePayload,
  UpdateDevicePayload,
  devicesApi,
} from '@/api/devicesApi';
import { useAuthStore } from '@/store/authStore';

/**
 * 기기 목록 조회 쿼리 키
 */
export const DEVICES_QUERY_KEY = ['devices'] as const;

/**
 * 특정 기기 조회 쿼리 키 생성 함수
 */
export const deviceQueryKey = (deviceId: string) => ['devices', deviceId] as const;

/**
 * 내 기기 목록 조회 훅
 * 현재 사용자가 등록한 모든 기기 목록을 조회합니다.
 *
 * @returns useQuery 객체 - 기기 목록 배열을 반환합니다.
 *
 * @example
 * ```tsx
 * function DeviceListScreen() {
 *   const { data: devices, isLoading, error } = useDevices();
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (error) return <Text>에러 발생: {error.message}</Text>;
 *
 *   return (
 *     <View>
 *       {devices?.map((device) => (
 *         <Text key={device.deviceId}>{device.deviceName}</Text>
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
export function useDevices() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<DeviceApiType[]>({
    queryKey: DEVICES_QUERY_KEY,
    queryFn: devicesApi.getDevices,
    enabled: !!accessToken, // 토큰이 있을 때만 조회
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지 (최적화)
    retry: 1,
  });
}

/**
 * 특정 기기 상세 조회 훅
 * deviceId로 특정 기기의 상세 정보를 조회합니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @returns useQuery 객체 - 기기 상세 정보를 반환합니다.
 *
 * @example
 * ```tsx
 * function DeviceDetailScreen({ deviceId }: { deviceId: string }) {
 *   const { data: device, isLoading } = useDevice(deviceId);
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (!device) return <Text>기기를 찾을 수 없습니다.</Text>;
 *
 *   return (
 *     <View>
 *       <Text>기기 이름: {device.deviceName}</Text>
 *       <Text>연결 상태: {device.connectionStatus}</Text>
 *       <Text>기기 상태: {device.deviceStatus}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useDevice(
  deviceId: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<DeviceApiType>({
    queryKey: deviceQueryKey(deviceId),
    queryFn: () => devicesApi.getDevice(deviceId),
    enabled: options?.enabled !== false && !!deviceId && !!accessToken, // deviceId와 토큰이 있을 때만 조회
    staleTime: 20 * 1000, // 20초간 캐시 유지 (429 에러 방지)
    refetchInterval: options?.refetchInterval ?? 30000, // 기본 30초마다 자동 refetch (429 에러 방지)
    retry: 1,
  });
}

/**
 * 기기 상세 조회 훅 (src/api/devices.ts 사용)
 * deviceId로 특정 기기의 상세 정보를 조회합니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @returns useQuery 객체 - 기기 상세 정보를 반환합니다.
 */
export function useDeviceDetailQuery(deviceId: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<Device>({
    queryKey: deviceQueryKey(deviceId),
    queryFn: () => getDeviceById(deviceId),
    enabled: !!deviceId && !!accessToken,
    staleTime: 1 * 60 * 1000, // 1분간 캐시 유지
    retry: 1,
  });
}

/**
 * 기기 페어링 훅
 * 새로운 기기를 등록하고 페어링합니다.
 * 성공 시 기기 목록 쿼리를 자동으로 최신화합니다.
 *
 * @returns useMutation 객체 - 기기 페어링 요청을 처리합니다.
 *
 * @example
 * ```tsx
 * function PairDeviceScreen() {
 *   const pairDevice = usePairDevice();
 *
 *   const handlePair = async () => {
 *     try {
 *       const device = await pairDevice.mutateAsync({
 *         deviceId: 'DEVICE_001',
 *         deviceName: '한니비 기기 1',
 *       });
 *       console.log('페어링 성공:', device);
 *       // 성공 시 기기 목록이 자동으로 갱신됨
 *     } catch (error) {
 *       console.error('페어링 실패:', error);
 *     }
 *   };
 *
 *   return (
 *     <Button
 *       onPress={handlePair}
 *       disabled={pairDevice.isPending}
 *       title={pairDevice.isPending ? '페어링 중...' : '기기 페어링'}
 *     />
 *   );
 * }
 * ```
 */
export function usePairDevice() {
  const queryClient = useQueryClient();

  return useMutation<DeviceApiType, Error, PairDevicePayload>({
    mutationFn: devicesApi.pairDevice,
    onSuccess: () => {
      // 기기 목록 쿼리 무효화하여 자동으로 최신화
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
    },
  });
}

/**
 * 기기 정보 수정 훅
 * 기기의 이름, 상태 등의 정보를 수정합니다.
 * 성공 시 해당 기기 상세 쿼리와 기기 목록 쿼리를 자동으로 최신화합니다.
 *
 * @param deviceId 수정할 기기의 ID
 * @returns useMutation 객체 - 기기 수정 요청을 처리합니다.
 *
 * @example
 * ```tsx
 * function EditDeviceScreen({ deviceId }: { deviceId: string }) {
 *   const updateDevice = useUpdateDevice(deviceId);
 *
 *   const handleUpdate = async () => {
 *     try {
 *       const updatedDevice = await updateDevice.mutateAsync({
 *         deviceName: '새로운 기기 이름',
 *         deviceStatus: 'IDLE',
 *       });
 *       console.log('수정 성공:', updatedDevice);
 *       // 성공 시 기기 상세와 목록이 자동으로 갱신됨
 *     } catch (error) {
 *       console.error('수정 실패:', error);
 *     }
 *   };
 *
 *   return (
 *     <Button
 *       onPress={handleUpdate}
 *       disabled={updateDevice.isPending}
 *       title={updateDevice.isPending ? '수정 중...' : '기기 수정'}
 *     />
 *   );
 * }
 * ```
 */
export function useUpdateDevice(deviceId: string) {
  const queryClient = useQueryClient();

  return useMutation<DeviceApiType, Error, UpdateDevicePayload>({
    mutationFn: (payload) => devicesApi.updateDevice(deviceId, payload),
    onSuccess: (data) => {
      // 해당 기기 상세 쿼리 데이터 직접 업데이트
      queryClient.setQueryData(deviceQueryKey(deviceId), data);
      // 기기 목록 쿼리 무효화하여 자동으로 최신화
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
    },
  });
}

/**
 * 기기 정보 수정 훅 (src/api/devices.ts 사용)
 * 기기의 이름, 상태 등의 정보를 수정합니다.
 * 성공 시 해당 기기 상세 쿼리와 기기 목록 쿼리를 자동으로 최신화합니다.
 *
 * @returns useMutation 객체 - 기기 수정 요청을 처리합니다.
 */
type UpdateDeviceVariables = {
  deviceId: string;
  payload: UpdateDeviceRequest;
};

export function useUpdateDeviceMutation() {
  const queryClient = useQueryClient();

  return useMutation<Device, Error, UpdateDeviceVariables>({
    mutationFn: ({ deviceId, payload }) => updateDevice(deviceId, payload),
    onSuccess: (updatedDevice, variables) => {
      // 기기 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
      // 해당 기기 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: deviceQueryKey(variables.deviceId) });
      // 기기 상세 쿼리 데이터 직접 업데이트
      queryClient.setQueryData(deviceQueryKey(variables.deviceId), updatedDevice);
    },
  });
}

/**
 * 기기 페어링 해제 훅
 * 등록된 기기의 페어링을 해제합니다.
 * 성공 시 기기 목록 쿼리를 자동으로 최신화합니다.
 *
 * @returns useMutation 객체 - 기기 페어링 해제 요청을 처리합니다.
 *
 * @example
 * ```tsx
 * function UnpairDeviceScreen() {
 *   const unpairDevice = useUnpairDevice();
 *
 *   const handleUnpair = async () => {
 *     try {
 *       await unpairDevice.mutateAsync('DEVICE_001');
 *       console.log('페어링 해제 성공');
 *       // 성공 시 기기 목록이 자동으로 갱신됨
 *     } catch (error) {
 *       console.error('페어링 해제 실패:', error);
 *     }
 *   };
 *
 *   return (
 *     <Button
 *       onPress={handleUnpair}
 *       disabled={unpairDevice.isPending}
 *       title={unpairDevice.isPending ? '해제 중...' : '페어링 해제'}
 *     />
 *   );
 * }
 * ```
 */
export function useUnpairDevice() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: devicesApi.unpairDevice,
    onSuccess: () => {
      // 기기 목록 쿼리 무효화하여 자동으로 최신화
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
    },
  });
}
