import { useMutation, useQueryClient } from '@tanstack/react-query';

import { pairDevice, Device, PairDeviceBody, NormalizedError } from '@/api/devices';

export function usePairDeviceMutation() {
  const queryClient = useQueryClient();

  return useMutation<Device, NormalizedError, PairDeviceBody>({
    mutationFn: pairDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
}
