/**
 * 스냅샷 조회 React Query 훅
 * 특정 기기의 카메라 스냅샷 목록을 조회하는 훅입니다.
 *
 * 주의: 카메라 이미지 URL은 RTSP가 안되어서 에러가 날 수 있지만,
 * 스냅샷 메타데이터는 받을 수 있도록 활성화했습니다.
 */

import { useQuery } from '@tanstack/react-query';

import { ApiResponse } from '@/api/authTypes';
import { apiClient } from '@/api/httpClient';
import type { SnapshotMeta } from '@/types/foodSession';

/**
 * 스냅샷 조회 쿼리 키 생성 함수
 */
export const SNAPSHOTS_QUERY_KEY = (deviceId: string, limit?: number) =>
  ['cameras', 'snapshots', deviceId, limit] as const;

/**
 * 스냅샷 응답 타입 (백엔드 원본)
 * TODO: 실제 백엔드 응답 구조에 맞게 수정 필요
 */
export interface SnapshotResponse {
  id: string;
  deviceId: string;
  triggerType?: 'FOOD_INPUT_BEFORE' | 'FOOD_INPUT_AFTER';
  createdAt: string;
}

/**
 * 스냅샷을 조회하는 React Query 훅
 *
 * @param deviceId 조회할 기기의 ID
 * @param limit 조회할 최대 스냅샷 수 (기본값: 20, 최대: 100)
 * @param from 시작 시간 (ISO 8601, optional)
 * @param to 종료 시간 (ISO 8601, optional)
 * @returns useQuery 객체 - 스냅샷 메타데이터 배열을 반환합니다.
 *
 * @example
 * ```tsx
 * function SnapshotsList({ deviceId }: { deviceId: string }) {
 *   const { data: snapshots, isLoading, isError } = useSnapshots(deviceId);
 *
 *   if (isLoading) return <Text>스냅샷을 불러오는 중...</Text>;
 *   if (isError) return <Text>스냅샷을 불러오지 못했습니다.</Text>;
 *
 *   return (
 *     <View>
 *       {snapshots?.map((snapshot) => (
 *         <Image key={snapshot.id} source={{ uri: snapshot.imageUrl }} />
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
export function useSnapshots(
  deviceId: string,
  limit = 20,
  from?: string,
  to?: string,
  options?: { refetchInterval?: number | false; enabled?: boolean },
) {
  return useQuery<SnapshotMeta[], Error>({
    queryKey: SNAPSHOTS_QUERY_KEY(deviceId, limit),
    queryFn: async () => {
      try {
        const response = await apiClient.get<ApiResponse<SnapshotResponse[]>>(
          `/api/v1/cameras/${deviceId}/snapshots`,
          {
            params: {
              limit: Math.min(limit, 100), // 최대 100으로 제한
              ...(from && { from }),
              ...(to && { to }),
            },
          },
        );

        // 백엔드 응답을 SnapshotMeta 형태로 변환
        // 이미지 URL은 RTSP가 안되어서 에러가 날 수 있지만 메타데이터는 받을 수 있음
        return response.data.data.map((snapshot) => ({
          id: snapshot.id,
          deviceId: snapshot.deviceId,
          triggerType: snapshot.triggerType,
          createdAt: snapshot.createdAt,
          imageUrl: `/api/v1/cameras/${deviceId}/snapshots/${snapshot.id}/image`,
        }));
      } catch (error) {
        // 카메라 이미지 API 에러는 무시하고 빈 배열 반환
        // 스냅샷 메타데이터만 받을 수 있도록 함
        console.warn('[useSnapshots] 스냅샷 조회 실패 (이미지 에러는 무시):', error);
        return [];
      }
    },
    enabled: options?.enabled !== false && !!deviceId,
    staleTime: 1000 * 30, // 30초
    refetchOnWindowFocus: false,
    refetchInterval: options?.refetchInterval ?? false, // 기본값은 자동 갱신 안 함, 옵션으로 전달 가능
    retry: false, // 에러 발생 시 재시도하지 않음 (이미지 에러 무시)
  });
}
