/**
 * 디바이스 상세 정보 조회 React Query 훅
 * GET /api/v1/devices/:deviceId를 호출하여 기기 메타 정보 및 상태를 조회합니다.
 */

import { useQuery } from '@tanstack/react-query';

import { devicesApi } from '@/api/devicesApi';
import type { DeviceDetail } from '@/api/types/devices';

/**
 * 디바이스 상세 정보 조회 쿼리 키 생성 함수
 */
export const deviceDetailQueryKey = (deviceId?: string) => ['device', deviceId] as const;

/**
 * 디바이스 상세 정보를 조회하는 React Query 훅
 * JWT 인증이 필요합니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @param options 추가 옵션 (refetchInterval 등)
 * @returns useQuery 객체 - 디바이스 상세 정보를 반환합니다.
 *
 * @example
 * ```tsx
 * function DeviceStatusCard({ deviceId }: { deviceId: string }) {
 *   const { data: device, isLoading, isError } = useDeviceDetail(deviceId, {
 *     refetchInterval: 10000, // 10초마다 자동 갱신
 *   });
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>기기 정보를 불러올 수 없습니다.</Text>;
 *
 *   return (
 *     <View>
 *       <Text>기기 이름: {device?.deviceName || device?.name}</Text>
 *       <Text>상태: {device?.deviceStatus}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useDeviceDetail(
  deviceId?: string,
  options?: { refetchInterval?: number | false; enabled?: boolean },
) {
  return useQuery<DeviceDetail>({
    queryKey: deviceDetailQueryKey(deviceId),
    enabled: options?.enabled !== false && !!deviceId,
    queryFn: async () => {
      if (!deviceId) {
        throw new Error('deviceId is required');
      }
      const device = await devicesApi.getDevice(deviceId);
      // DeviceDetail 타입에 맞게 변환
      return {
        id: device.id,
        deviceId: device.deviceId,
        name: device.deviceName,
        deviceName: device.deviceName,
        createdAt: device.createdAt || '',
        updatedAt: device.updatedAt || '',
        wifiSsid: device.wifiSsid,
        connectionStatus: device.connectionStatus,
        deviceStatus: device.deviceStatus,
        lastHeartbeat: device.lastHeartbeat,
        deviceConfig: device.deviceConfig,
        rtspUrl: device.rtspUrl,
        cameraModel: device.cameraModel,
        cameraUsername: device.cameraUsername,
        cameraPassword: device.cameraPassword,
      };
    },
    staleTime: 20 * 1000, // 20초간 캐시 유지 (429 에러 방지)
    refetchInterval: options?.refetchInterval ?? 20000, // 기본 20초마다 자동 갱신 (429 에러 방지)
    retry: 1,
  });
}
