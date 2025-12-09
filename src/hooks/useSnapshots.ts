/**
 * 스냅샷 조회 React Query 훅
 * 특정 기기의 카메라 스냅샷 목록을 조회하는 훅입니다.
 *
 * TODO: 카메라 API가 정상 작동하면 주석 해제 및 구현 완료
 */

// import { useQuery } from '@tanstack/react-query';
// import { apiClient } from '@/api/httpClient';
// import { ApiResponse } from '@/api/authTypes';
// import type { SnapshotMeta } from '@/types/foodSession';

/**
 * 스냅샷 조회 쿼리 키 생성 함수
 */
// export const SNAPSHOTS_QUERY_KEY = (deviceId: string, limit?: number) =>
//   ['cameras', 'snapshots', deviceId, limit] as const;

/**
 * 스냅샷 응답 타입 (백엔드 원본)
 * TODO: 실제 백엔드 응답 구조에 맞게 수정 필요
 */
// export interface SnapshotResponse {
//   id: string;
//   deviceId: string;
//   triggerType?: 'FOOD_INPUT_BEFORE' | 'FOOD_INPUT_AFTER';
//   createdAt: string;
// }

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
// export function useSnapshots(
//   deviceId: string,
//   limit = 20,
//   from?: string,
//   to?: string,
// ) {
//   return useQuery<SnapshotMeta[], Error>({
//     queryKey: SNAPSHOTS_QUERY_KEY(deviceId, limit),
//     queryFn: async () => {
//       const response = await apiClient.get<ApiResponse<SnapshotResponse[]>>(
//         `/api/v1/cameras/${deviceId}/snapshots`,
//         {
//           params: {
//             limit: Math.min(limit, 100), // 최대 100으로 제한
//             ...(from && { from }),
//             ...(to && { to }),
//           },
//         },
//       );
//
//       // 백엔드 응답을 SnapshotMeta 형태로 변환
//       return response.data.data.map((snapshot) => ({
//         id: snapshot.id,
//         deviceId: snapshot.deviceId,
//         triggerType: snapshot.triggerType,
//         createdAt: snapshot.createdAt,
//         imageUrl: `/api/v1/cameras/${deviceId}/snapshots/${snapshot.id}/image`,
//       }));
//     },
//     enabled: !!deviceId,
//     staleTime: 1000 * 30, // 30초
//     refetchOnWindowFocus: false,
//   });
// }

/**
 * 임시: 카메라 API가 정상 작동할 때까지 빈 배열 반환
 * TODO: 카메라 API가 정상 작동하면 위의 주석 처리된 코드로 교체
 */
export function useSnapshots(
  deviceId: string,
  limit = 20,
  from?: string,
  to?: string,
): {
  data: undefined;
  isLoading: false;
  isError: false;
} {
  // TODO: 카메라 API가 정상 작동하면 위의 주석 처리된 코드로 교체
  return {
    data: undefined,
    isLoading: false,
    isError: false,
  };
}
