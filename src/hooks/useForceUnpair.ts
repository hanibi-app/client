import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { unpairDevice } from '@/api/devices';

const executionTracker = new Set<string>();
const SESSION_DURATION_MS = 5 * 60 * 1000;

function hasExecutedInSession(deviceId: string): boolean {
  return executionTracker.has(deviceId);
}

function markExecuted(deviceId: string): void {
  executionTracker.add(deviceId);
  setTimeout(() => {
    executionTracker.delete(deviceId);
  }, SESSION_DURATION_MS);
}

export function useForceUnpairDevice(defaultDeviceId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (deviceId: string) => {
      try {
        await unpairDevice({ deviceId });
      } catch (error) {
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status === 429) {
            console.warn('[useForceUnpairDevice] 429 Rate limit - 무시됨:', deviceId);
            return;
          }
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });

  const forceUnpair = async (deviceId?: string) => {
    const targetId = deviceId ?? defaultDeviceId;
    if (!targetId) {
      return;
    }

    if (hasExecutedInSession(targetId)) {
      return;
    }

    markExecuted(targetId);

    try {
      await mutation.mutateAsync(targetId);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 429) {
        return;
      }
    }
  };

  return { forceUnpair, ...mutation };
}
