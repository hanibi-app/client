/**
 * 센서 관련 API 함수
 * Hanibi 백엔드의 Sensors 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';

/**
 * 최신 센서 데이터 응답 타입
 */
export type SensorLatestResponse = {
  temperature: string;
  humidity: number;
  weight: string;
  gas: string;
};

/**
 * 최신 센서 데이터 조회
 * 특정 기기의 최신 센서 데이터를 가져옵니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @returns Promise<SensorLatestResponse> 최신 센서 데이터
 *
 * @example
 * ```tsx
 * const sensorData = await fetchSensorLatest('HANIBI-ESP32-001');
 * console.log(`온도: ${sensorData.temperature}°C`);
 * ```
 */
export async function fetchSensorLatest(deviceId: string): Promise<SensorLatestResponse> {
  const response = await apiClient.get<ApiResponse<SensorLatestResponse>>(
    `/sensors/${deviceId}/latest`,
  );
  return response.data.data;
}
