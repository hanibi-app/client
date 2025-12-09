/**
 * Device Events 관련 API 함수
 * Hanibi 백엔드의 Device Events 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';

/**
 * Device Event 타입
 */
export type DeviceEventType =
  | 'FOOD_INPUT'
  | 'ERROR'
  | 'MAINTENANCE_REQUIRED'
  | 'OVER_TEMPERATURE'
  | 'OVER_HUMIDITY'
  | 'LONG_INACTIVE'
  | 'SENSOR_OFFLINE';

/**
 * Device Event 메타데이터
 */
export type DeviceEventMetadata = {
  beforeWeight?: number;
  afterWeight?: number;
  deltaWeight?: number;
  errorCode?: string;
  errorMessage?: string;
  reason?: string;
  sensorValues?: {
    temperature?: number;
    humidity?: number;
    gas?: number;
  };
  [key: string]: unknown;
};

/**
 * Device Event 응답 타입
 */
export type DeviceEvent = {
  id: number;
  deviceId: string;
  type: DeviceEventType;
  metadata: DeviceEventMetadata | null;
  createdAt: string;
};

/**
 * Device Event 목록 응답 타입
 */
export type DeviceEventListResponse = {
  events: DeviceEvent[];
  total: number;
};

/**
 * Device Events 조회 쿼리 파라미터
 */
export type GetDeviceEventsParams = {
  type?: DeviceEventType;
  limit?: number;
  since?: string; // ISO date string
};

/**
 * 기기의 이벤트 목록 조회
 *
 * @param deviceId 조회할 기기의 ID
 * @param params 쿼리 파라미터 (type, limit, since)
 * @returns Promise<DeviceEventListResponse> 이벤트 목록
 *
 * @example
 * ```tsx
 * const events = await fetchDeviceEvents('HANIBI-ESP32-001', {
 *   type: 'FOOD_INPUT',
 *   limit: 10,
 * });
 * console.log(`이벤트 수: ${events.total}`);
 * ```
 */
export async function fetchDeviceEvents(
  deviceId: string,
  params?: GetDeviceEventsParams,
): Promise<DeviceEventListResponse> {
  const response = await apiClient.get<ApiResponse<DeviceEventListResponse>>(
    `/api/v1/devices/${deviceId}/events`,
    {
      params,
    },
  );
  return response.data.data;
}

/**
 * 기기의 최신 이벤트 조회
 *
 * @param deviceId 조회할 기기의 ID
 * @param type 이벤트 타입 (선택)
 * @returns Promise<DeviceEvent | null> 최신 이벤트
 *
 * @example
 * ```tsx
 * const latestEvent = await fetchLatestDeviceEvent('HANIBI-ESP32-001', 'FOOD_INPUT');
 * if (latestEvent) {
 *   console.log(`최근 음식 투입: ${latestEvent.createdAt}`);
 * }
 * ```
 */
export async function fetchLatestDeviceEvent(
  deviceId: string,
  type?: DeviceEventType,
): Promise<DeviceEvent | null> {
  const url = `/api/v1/devices/${deviceId}/events/latest`;
  const response = await apiClient.get<ApiResponse<DeviceEvent | null>>(url, {
    params: type ? { type } : {},
  });
  return response.data.data;
}
