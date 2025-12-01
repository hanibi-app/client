import { AxiosError } from 'axios';

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';

export type Device = {
  deviceId: string;
  deviceName: string;
  connectionStatus?: 'ONLINE' | 'OFFLINE' | string;
  deviceStatus?: 'IDLE' | 'PROCESSING' | 'ERROR' | string;
  createdAt?: string;
  updatedAt?: string;
};

export type PairDeviceBody = {
  deviceId: string;
  deviceName: string;
};

export type NormalizedError = {
  status: number | null;
  message: string;
};

function normalizeAxiosError(error: unknown): NormalizedError {
  if (error instanceof AxiosError) {
    return {
      status: error.response?.status ?? null,
      message: error.response?.data?.message ?? error.message ?? 'An error occurred',
    };
  }
  if (error instanceof Error) {
    return {
      status: null,
      message: error.message,
    };
  }
  return {
    status: null,
    message: 'An unknown error occurred',
  };
}

export async function pairDevice(body: PairDeviceBody): Promise<Device> {
  try {
    const response = await apiClient.post<ApiResponse<Device>>('/api/v1/devices/pair', body);
    return response.data.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
