/**
 * 카메라 스냅샷 조회 React Query 훅
 * useQuery를 활용하여 특정 기기의 카메라 스냅샷을 조회합니다.
 *
 * TODO: 실제 카메라 API 엔드포인트 및 응답 스펙이 확정되면 이 파일을 업데이트해야 합니다.
 */

import { useQuery } from '@tanstack/react-query';

import { CameraSnapshotResponse, fetchCameraSnapshot } from '@/api/camera';

/**
 * 카메라 스냅샷 조회 쿼리 키 생성 함수
 */
export const cameraSnapshotQueryKey = (deviceId: string) => ['camera-snapshot', deviceId] as const;

/**
 * 카메라 스냅샷 조회 훅
 * 특정 기기의 카메라 스냅샷을 조회합니다.
 * 10초마다 자동으로 데이터를 갱신합니다. (최적화됨)
 *
 * @param deviceId 조회할 기기의 ID
 * @param options 추가 옵션 (enabled, refetchInterval 등)
 * @returns useQuery 객체 - 카메라 스냅샷 데이터를 반환합니다.
 *
 * @example
 * ```tsx
 * function CameraPreviewScreen() {
 *   const deviceId = useCurrentDeviceId();
 *   const { data: snapshot, isLoading, isError, refetch } = useCameraSnapshot(deviceId);
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>에러 발생</Text>;
 *
 *   return (
 *     <View>
 *       <Image source={{ uri: snapshot?.imageUrl }} />
 *     </View>
 *   );
 * }
 * ```
 *
 * TODO: 엔드포인트/응답 스펙 확정 필요
 */
export function useCameraSnapshot(
  deviceId: string,
  options?: { enabled?: boolean; refetchInterval?: number | false },
) {
  return useQuery<CameraSnapshotResponse>({
    queryKey: cameraSnapshotQueryKey(deviceId),
    queryFn: () => fetchCameraSnapshot(deviceId),
    refetchInterval: options?.refetchInterval ?? 30000, // 기본 30초마다 자동 폴링 (429 에러 방지)
    staleTime: 20 * 1000, // 20초간 캐시 유지 (429 에러 방지)
    retry: 1,
    enabled: options?.enabled !== false && !!deviceId, // deviceId가 있을 때만 조회
  });
}
