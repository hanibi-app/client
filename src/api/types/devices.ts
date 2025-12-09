/**
 * 디바이스 및 센서 관련 API 타입 정의
 * Hanibi 백엔드의 Devices 및 Sensors 엔드포인트 응답 구조를 정의합니다.
 */

import { ApiResponse } from '../authTypes';

/**
 * 공통 응답 래퍼 타입 (재export)
 */
export type { ApiResponse };

/**
 * 디바이스 처리 상태
 */
export type DeviceProcessingStatus = 'IDLE' | 'PROCESSING' | 'ERROR';

/**
 * 디바이스 상세 정보
 */
export interface DeviceDetail {
  id: number;
  deviceId: string;
  name: string;
  deviceName?: string; // 호환성을 위해 추가
  createdAt: string;
  updatedAt: string;
  // 기존 Device 타입의 다른 필드들도 포함 가능
  wifiSsid?: string | null;
  connectionStatus?: 'ONLINE' | 'OFFLINE' | string;
  deviceStatus?: DeviceProcessingStatus | string;
  lastHeartbeat?: string | null;
  deviceConfig?: unknown | null;
  rtspUrl?: string | null;
  cameraModel?: string | null;
  cameraUsername?: string | null;
  cameraPassword?: string | null;
}

/**
 * 최신 센서 데이터
 */
export interface SensorLatestData {
  deviceId: string;
  temperature: number | null;
  humidity: number | null;
  weight: number | null;
  gas: number | null;
  processingStatus: DeviceProcessingStatus;
  timestamp: string;
}
