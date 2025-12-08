/**
 * 카메라 관련 API 함수
 * Hanibi 백엔드의 Camera 엔드포인트를 호출하는 함수들을 제공합니다.
 *
 * TODO: 실제 카메라 API 엔드포인트 및 응답 스펙이 확정되면 이 파일을 업데이트해야 합니다.
 */

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';

/**
 * 카메라 스냅샷 응답 타입
 * TODO: 실제 API 응답 스펙에 맞게 수정 필요
 */
export type CameraSnapshotResponse = {
  /**
   * 이미지 URL 또는 base64 인코딩된 이미지 데이터
   * TODO: 실제 응답 형식에 맞게 수정 (URL인지 base64인지 확인 필요)
   */
  imageUrl: string;
  /**
   * 스냅샷 생성 시간 (ISO 8601 형식)
   * TODO: 실제 응답에 포함되는지 확인 필요
   */
  timestamp?: string;
};

/**
 * 디버그 기기용 가상 카메라 스냅샷 데이터 생성
 * 개발자 모드에서 사용할 가짜 카메라 스냅샷 데이터입니다.
 */
function generateDebugCameraSnapshot(): CameraSnapshotResponse {
  // 디버그 기기용 가상 이미지 URL (placeholder 이미지)
  return {
    imageUrl: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Debug+Camera+Snapshot',
    timestamp: new Date().toISOString(),
  };
}

/**
 * 카메라 스냅샷 조회
 * 특정 기기의 카메라 스냅샷을 가져옵니다.
 *
 * @param deviceId 조회할 기기의 ID
 * @returns Promise<CameraSnapshotResponse> 카메라 스냅샷 데이터
 *
 * @example
 * ```tsx
 * const snapshot = await fetchCameraSnapshot('HANIBI-ESP32-001');
 * console.log(`이미지 URL: ${snapshot.imageUrl}`);
 * ```
 *
 * TODO: 실제 카메라 API 엔드포인트로 교체 필요
 * 현재는 placeholder URL(/api/v1/camera/{deviceId}/snapshot)을 사용합니다.
 */
export async function fetchCameraSnapshot(deviceId: string): Promise<CameraSnapshotResponse> {
  // 디버그 기기인 경우 가상 데이터 반환 (개발자 모드용)
  if (deviceId === 'HANIBI-DEBUG-001') {
    console.log('[Camera API] 디버그 기기 감지 - 가상 데이터 반환');
    // 약간의 지연을 추가하여 실제 API 호출처럼 보이게 함
    await new Promise((resolve) => setTimeout(resolve, 500));
    return generateDebugCameraSnapshot();
  }

  // TODO: 실제 카메라 API 엔드포인트로 교체 필요
  // 예상 엔드포인트: /api/v1/camera/{deviceId}/snapshot
  const response = await apiClient.get<ApiResponse<CameraSnapshotResponse>>(
    `/api/v1/camera/${deviceId}/snapshot`,
  );
  return response.data.data;
}
