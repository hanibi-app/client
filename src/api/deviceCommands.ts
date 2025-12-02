/**
 * 기기 명령 관련 API
 * 기기에 명령을 전송하고 명령 이력을 조회하는 함수들을 제공합니다.
 */

import { ApiResponse } from './authTypes';
import { Device } from './devices';
import { apiClient } from './httpClient';

/**
 * 기기 명령 페이로드 타입
 */
export type DeviceCommandPayload = {
  temperature?: number;
  intervalSeconds?: number;
  // Flatten extraPayload for convenience (we can just spread it)
  [key: string]: unknown;
};

/**
 * 기기 명령 상태 타입
 */
export type DeviceCommandStatus = 'PENDING' | 'ACKED' | 'FAILED' | string;

/**
 * 기기 명령 타입
 */
export type DeviceCommand = {
  id: number;
  createdAt: string;
  updatedAt: string;
  device: Device;
  user: {
    id: number;
    email: string;
    nickname: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  commandType: string;
  payload: DeviceCommandPayload;
  status: DeviceCommandStatus;
  sentAt: string | null;
  acknowledgedAt: string | null;
};

/**
 * 기기 명령 생성 요청 타입
 */
export type CreateDeviceCommandRequest = {
  commandType: string; // e.g. "START", "STOP"
  temperature?: number;
  intervalSeconds?: number;
  extraPayload?: Record<string, unknown>;
};

/**
 * 기기 명령 이력 조회
 * 특정 기기의 명령 이력을 조회합니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @returns Promise<DeviceCommand[]> 명령 이력 배열
 *
 * @example
 * ```tsx
 * const commands = await getDeviceCommands('HANIBI-ESP32-001');
 * console.log(`명령 수: ${commands.length}`);
 * ```
 */
export async function getDeviceCommands(deviceId: string): Promise<DeviceCommand[]> {
  const response = await apiClient.get<ApiResponse<DeviceCommand[]>>(
    `/api/v1/devices/${deviceId}/commands`,
  );
  return response.data.data;
}

/**
 * 기기 명령 전송
 * 특정 기기에 명령을 전송합니다.
 *
 * @param deviceId 명령을 전송할 기기의 ID
 * @param body 명령 정보 (commandType, temperature, intervalSeconds, extraPayload)
 * @returns Promise<DeviceCommand> 생성된 명령 정보
 *
 * @example
 * ```tsx
 * const command = await sendDeviceCommand('HANIBI-ESP32-001', {
 *   commandType: 'START',
 *   temperature: 22,
 *   intervalSeconds: 5,
 *   extraPayload: { custom: true },
 * });
 * console.log(`명령 ID: ${command.id}, 상태: ${command.status}`);
 * ```
 */
export async function sendDeviceCommand(
  deviceId: string,
  body: CreateDeviceCommandRequest,
): Promise<DeviceCommand> {
  const response = await apiClient.post<ApiResponse<DeviceCommand>>(
    `/api/v1/devices/${deviceId}/commands`,
    body,
  );
  return response.data.data;
}
