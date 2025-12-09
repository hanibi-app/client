/**
 * 센서 관련 API 함수
 * Hanibi 백엔드의 Sensors 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import type { SensorEvent } from '../types/foodSession';

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

/**
 * 센서 요청 로그 조회 파라미터
 */
export interface SensorRequestLogsParams {
  deviceId?: string;
  status?: 'SUCCESS' | 'VALIDATION_FAILED' | 'ERROR';
  limit?: number;
}

/**
 * 센서 요청 로그 응답 타입 (백엔드 원본)
 * TODO: 실제 백엔드 응답 구조에 맞게 수정 필요
 */
export interface SensorRequestLogResponse {
  id: string;
  deviceId?: string;
  eventType?: string;
  status: string;
  createdAt: string;
  payload?: Record<string, unknown>;
  requestBody?: string | Record<string, unknown>; // JSON 문자열 또는 파싱된 객체
  // 기타 필드들...
}

/**
 * 센서 요청 로그 조회
 * 센서 요청 로그를 조회하여 센서 이벤트로 변환합니다.
 *
 * @param params 조회 파라미터 (deviceId, status, limit)
 * @returns Promise<SensorEvent[]> 센서 이벤트 배열
 *
 * @example
 * ```tsx
 * const events = await fetchSensorRequestLogs({
 *   deviceId: 'HANIBI-001',
 *   status: 'SUCCESS',
 *   limit: 100,
 * });
 * ```
 */
export async function fetchSensorRequestLogs(
  params: SensorRequestLogsParams = {},
): Promise<SensorEvent[]> {
  const { deviceId, status = 'SUCCESS', limit = 100 } = params;

  const response = await apiClient.get<ApiResponse<SensorRequestLogResponse[]>>(
    '/api/v1/sensors/request-logs',
    {
      params: {
        ...(deviceId && { deviceId }),
        ...(status && { status }),
        limit,
      },
    },
  );

  // 디버깅: API 응답 확인
  if (__DEV__) {
    console.log('[fetchSensorRequestLogs] API 응답:', {
      deviceId,
      status,
      totalLogs: response.data.data?.length || 0,
      sampleLogs: response.data.data?.slice(0, 3).map((log) => ({
        id: log.id,
        eventType: log.eventType,
        requestBody: log.requestBody,
        status: log.status,
        createdAt: log.createdAt,
      })),
    });
  }

  // requestBody 파싱 헬퍼 함수
  const parseRequestBody = (
    requestBody: string | Record<string, unknown> | undefined,
  ): Record<string, unknown> | undefined => {
    if (!requestBody) return undefined;
    try {
      return typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody;
    } catch (e) {
      if (__DEV__) {
        console.warn('[fetchSensorRequestLogs] requestBody 파싱 실패:', requestBody, e);
      }
      return undefined;
    }
  };

  // 백엔드 응답을 SensorEvent 형태로 변환
  const events = response.data.data
    .map((log) => {
      // eventType 추출: 직접 필드가 있으면 사용, 없으면 requestBody에서 파싱
      let eventType: string | undefined = log.eventType;

      // requestBody에서 eventType 추출 시도
      if (!eventType && log.requestBody) {
        const parsedBody = parseRequestBody(log.requestBody);
        eventType = parsedBody?.eventType as string | undefined;
      }

      // deviceId 추출: 직접 필드가 있으면 사용, 없으면 requestBody에서 파싱
      let extractedDeviceId: string | undefined = log.deviceId;
      if (!extractedDeviceId && log.requestBody) {
        const parsedBody = parseRequestBody(log.requestBody);
        extractedDeviceId = parsedBody?.deviceId as string | undefined;
      }

      return {
        log,
        eventType,
        deviceId: extractedDeviceId,
        parsedBody: log.requestBody ? parseRequestBody(log.requestBody) : undefined,
      };
    })
    .filter(({ eventType }) => {
      // eventType이 있고, 유효한 이벤트 타입인지 확인
      return (
        eventType &&
        ['FOOD_INPUT_BEFORE', 'FOOD_INPUT_AFTER', 'PROCESSING_COMPLETED', 'DOOR_OPENED'].includes(
          eventType,
        )
      );
    })
    .map(({ log, eventType, deviceId: extractedDeviceId, parsedBody }) => ({
      id: log.id,
      deviceId: extractedDeviceId || log.deviceId || '',
      eventType: eventType as SensorEvent['eventType'],
      createdAt: log.createdAt,
      payload: log.payload || parsedBody,
      requestLogId: log.id,
    }));

  // 디버깅: 변환된 이벤트 확인
  if (__DEV__) {
    console.log('[fetchSensorRequestLogs] 변환된 이벤트:', {
      deviceId,
      eventsCount: events.length,
      events: events.slice(0, 5).map((e) => ({
        id: e.id,
        eventType: e.eventType,
        createdAt: e.createdAt,
      })),
    });
  }

  return events;
}
