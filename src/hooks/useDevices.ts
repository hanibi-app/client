import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Device, PairDevicePayload, pairDevice } from '@/api/devices';
import { clearPairedDevice, setPairedDevice } from '@/services/storage/deviceStorage';

export function usePairDeviceMutation() {
  const queryClient = useQueryClient();

  return useMutation<Device, Error, PairDevicePayload>({
    mutationFn: async (body) => {
      const device = await pairDevice(body);
      await setPairedDevice({
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        apiSynced: true,
        syncedAt: new Date().toISOString(),
      });
      return device;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
}

export function useForceUnpairLocalDevice() {
  const queryClient = useQueryClient();

  return async (): Promise<void> => {
    try {
      await clearPairedDevice();
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.removeQueries({ queryKey: ['devices'] });
      console.log('[forceUnpairLocalDevice] 로컬 기기 정보 초기화 완료');
    } catch (error) {
      console.error('[forceUnpairLocalDevice] 초기화 실패 (무시됨):', error);
    }
  };
}
