import { useCallback, useState } from 'react';

export type CameraConnectionStatus = {
  cameraId: string;
  connected: boolean;
};

export const DEFAULT_CAMERA_ID = 'TEST_0016';

export const useCameraStatus = (initialCameraId = DEFAULT_CAMERA_ID) => {
  const [cameraStatus, setCameraStatus] = useState<CameraConnectionStatus>({
    cameraId: initialCameraId,
    connected: false,
  });
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsChecking(true);
      setError(null);
      // TODO: 실제 API 호출로 교체
      // - GET /api/cameras/{cameraId}/status 엔드포인트 호출
      // - 응답 형식: { cameraId: string, connected: boolean }
      // - 네트워크 에러 및 타임아웃 처리 필요
      // - 관련 이슈: #카메라상태API
      await new Promise((resolve) => setTimeout(resolve, 400));
      setCameraStatus((prev) => ({ ...prev }));
    } catch (err) {
      setError('연결 상태를 가져오는 중 문제가 발생했어요.');
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    cameraStatus,
    isChecking,
    error,
    refresh,
  };
};
