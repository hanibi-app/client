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
 * 디버그 기기용 가상 센서 데이터 생성
 * 개발자 모드에서 사용할 가짜 센서 데이터입니다.
 */
function generateDebugSensorData(): SensorLatestResponse {
  // 디버그 기기용 가상 데이터 (약간 높은 값으로 설정)
  return {
    temperature: '28.5', // 약간 높은 온도
    humidity: 55, // 약간 높은 습도
    weight: '1500', // 1.5kg (g 단위)
    gas: '120', // 약간 높은 VOC
  };
}

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
  // 디버그 기기인 경우 가상 데이터 반환 (개발자 모드용)
  if (deviceId === 'HANIBI-DEBUG-001') {
    console.log('[Sensors API] 디버그 기기 감지 - 가상 데이터 반환');
    // 약간의 지연을 추가하여 실제 API 호출처럼 보이게 함
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateDebugSensorData();
  }

  // 실제 기기의 경우 API 호출
  const response = await apiClient.get<ApiResponse<SensorLatestResponse>>(
    `/sensors/${deviceId}/latest`,
  );
  return response.data.data;
}
