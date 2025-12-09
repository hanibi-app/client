/**
 * 센서 관련 API 함수
 * Hanibi 백엔드의 Sensors 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';
import type { DeviceProcessingStatus, SensorLatestData } from './types/devices';

/**
 * 최신 센서 데이터 응답 타입 (백엔드 원본)
 */
export type SensorLatestResponse = {
  temperature: string | number;
  humidity: number;
  weight: string | number;
  gas: string | number;
  processingStatus?: DeviceProcessingStatus;
  timestamp?: string;
  deviceId?: string;
};

/**
 * 센서 값을 정규화합니다 (-999를 null로 변환)
 */
function normalizeSensorValue(value: string | number | null | undefined): number | null {
  if (value === undefined || value === null) return null;
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue) || numValue === -999) return null;
  return numValue;
}

/**
 * 디버그 기기용 가상 센서 데이터 생성
 * 개발자 모드에서 사용할 가짜 센서 데이터입니다.
 */
function generateDebugSensorData(deviceId: string): SensorLatestResponse {
  // 디버그 기기용 가상 데이터 (약간 높은 값으로 설정)
  return {
    deviceId,
    temperature: '28.5', // 약간 높은 온도
    humidity: 55, // 약간 높은 습도
    weight: '1500', // 1.5kg (g 단위)
    gas: '120', // 약간 높은 VOC
    processingStatus: 'IDLE',
    timestamp: new Date().toISOString(),
  };
}

/**
 * 최신 센서 데이터 조회
 * 특정 기기의 최신 센서 데이터를 가져옵니다.
 * -999 값은 null로 변환됩니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @returns Promise<SensorLatestData> 최신 센서 데이터 (정규화됨)
 *
 * @example
 * ```tsx
 * const sensorData = await fetchSensorLatest('HANIBI-ESP32-001');
 * console.log(`온도: ${sensorData.temperature}°C`);
 * console.log(`처리 상태: ${sensorData.processingStatus}`);
 * ```
 */
export async function fetchSensorLatest(deviceId: string): Promise<SensorLatestData> {
  // 디버그 기기인 경우 가상 데이터 반환 (개발자 모드용)
  if (deviceId === 'HANIBI-DEBUG-001') {
    console.log('[Sensors API] 디버그 기기 감지 - 가상 데이터 반환');
    // 약간의 지연을 추가하여 실제 API 호출처럼 보이게 함
    await new Promise((resolve) => setTimeout(resolve, 300));
    const debugData = generateDebugSensorData(deviceId);
    return {
      deviceId,
      temperature: normalizeSensorValue(debugData.temperature),
      humidity: normalizeSensorValue(debugData.humidity),
      weight: normalizeSensorValue(debugData.weight),
      gas: normalizeSensorValue(debugData.gas),
      processingStatus: debugData.processingStatus || 'IDLE',
      timestamp: debugData.timestamp || new Date().toISOString(),
    };
  }

  // 실제 기기의 경우 API 호출
  const response = await apiClient.get<ApiResponse<SensorLatestResponse>>(
    `/api/v1/sensors/${deviceId}/latest`,
  );
  const rawData = response.data.data;

  // 응답 데이터 정규화 (-999를 null로 변환)
  return {
    deviceId: rawData.deviceId || deviceId,
    temperature: normalizeSensorValue(rawData.temperature),
    humidity: normalizeSensorValue(rawData.humidity),
    weight: normalizeSensorValue(rawData.weight),
    gas: normalizeSensorValue(rawData.gas),
    processingStatus: rawData.processingStatus || 'IDLE',
    timestamp: rawData.timestamp || new Date().toISOString(),
  };
}
