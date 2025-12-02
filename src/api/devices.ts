import { AxiosError } from 'axios';

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';

export type Device = {
  id: number;
  deviceId: string;
  deviceName: string;
  wifiSsid: string | null;
  connectionStatus: 'ONLINE' | 'OFFLINE' | string;
  deviceStatus: 'IDLE' | 'PROCESSING' | string;
  lastHeartbeat: string | null;
  deviceConfig: unknown | null;
  rtspUrl: string | null;
  cameraModel: string | null;
  cameraUsername: string | null;
  cameraPassword: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    email: string;
    nickname: string;
    emailVerified: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
};

export type PairDevicePayload = {
  deviceId: string;
  deviceName: string;
};

export type UnpairDevicePayload = {
  deviceId: string;
};

export async function pairDevice(payload: PairDevicePayload): Promise<Device> {
  const response = await apiClient.post<ApiResponse<Device>>('/api/v1/devices/pair', payload);
  return response.data.data;
}

export async function unpairDevice(payload: UnpairDevicePayload): Promise<Device> {
  const response = await apiClient.delete<ApiResponse<Device>>('/api/v1/devices/pair', {
    data: payload,
  });
  return response.data.data;
}

export async function getDevices(): Promise<Device[]> {
  const response = await apiClient.get<ApiResponse<Device[]>>('/api/v1/devices');
  return response.data.data;
}
