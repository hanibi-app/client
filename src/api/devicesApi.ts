/**
 * 기기 관련 API 래퍼
 * Hanibi 백엔드의 Devices 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';

/**
 * 기기 정보 타입
 */
export type Device = {
  deviceId: string;
  deviceName: string;
  connectionStatus?: 'ONLINE' | 'OFFLINE' | string;
  deviceStatus?: 'IDLE' | 'PROCESSING' | 'ERROR' | string;
  // 추가 필드가 필요하면 여기에 확장 가능
  createdAt?: string;
  updatedAt?: string;
};

/**
 * 기기 페어링 요청 페이로드 타입
 */
export type PairDevicePayload = {
  deviceId: string;
  deviceName: string;
};

/**
 * 기기 수정 요청 페이로드 타입
 */
export type UpdateDevicePayload = Partial<Omit<Device, 'deviceId'>>;

/**
 * 기기 API 함수들
 */
export const devicesApi = {
  /**
   * 기기 페어링
   * 새로운 기기를 등록하고 페어링합니다.
   *
   * @param payload 페어링할 기기 정보 (deviceId, deviceName)
   * @returns Promise<Device> 페어링된 기기 정보
   *
   * @example
   * ```tsx
   * const device = await devicesApi.pairDevice({
   *   deviceId: 'DEVICE_001',
   *   deviceName: '한니비 기기 1',
   * });
   * ```
   */
  pairDevice: async (payload: PairDevicePayload): Promise<Device> => {
    const response = await apiClient.post<ApiResponse<Device>>('/api/v1/devices/pair', payload);
    return response.data.data;
  },

  /**
   * 내 기기 목록 조회
   * 현재 사용자가 등록한 모든 기기 목록을 가져옵니다.
   *
   * @returns Promise<Device[]> 기기 목록 배열
   *
   * @example
   * ```tsx
   * const devices = await devicesApi.getDevices();
   * console.log(`등록된 기기 수: ${devices.length}`);
   * ```
   */
  getDevices: async (): Promise<Device[]> => {
    const response = await apiClient.get<ApiResponse<Device[]>>('/api/v1/devices');
    return response.data.data;
  },

  /**
   * 특정 기기 상세 조회
   * deviceId로 특정 기기의 상세 정보를 가져옵니다.
   *
   * @param deviceId 조회할 기기의 ID
   * @returns Promise<Device> 기기 상세 정보
   *
   * @example
   * ```tsx
   * const device = await devicesApi.getDevice('DEVICE_001');
   * console.log(`기기 상태: ${device.deviceStatus}`);
   * ```
   */
  getDevice: async (deviceId: string): Promise<Device> => {
    const response = await apiClient.get<ApiResponse<Device>>(`/api/v1/devices/${deviceId}`);
    return response.data.data;
  },

  /**
   * 기기 정보 수정
   * 기기의 이름, 상태 등의 정보를 수정합니다.
   *
   * @param deviceId 수정할 기기의 ID
   * @param payload 수정할 정보 (deviceName, connectionStatus, deviceStatus 등)
   * @returns Promise<Device> 수정된 기기 정보
   *
   * @example
   * ```tsx
   * const updatedDevice = await devicesApi.updateDevice('DEVICE_001', {
   *   deviceName: '새로운 기기 이름',
   *   deviceStatus: 'IDLE',
   * });
   * ```
   */
  updateDevice: async (deviceId: string, payload: UpdateDevicePayload): Promise<Device> => {
    const response = await apiClient.patch<ApiResponse<Device>>(
      `/api/v1/devices/${deviceId}`,
      payload,
    );
    return response.data.data;
  },
};
