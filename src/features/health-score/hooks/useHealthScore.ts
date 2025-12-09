/**
 * Health Score 조회 React Query 훅
 * 기기의 헬스 스코어를 조회하는 훅입니다.
 */

import { useQuery } from '@tanstack/react-query';

import {
  fetchHealthScore,
  fetchHealthScoreFromReports,
  GetHealthScoreParams,
  HealthScoreResponse,
} from '@/api/healthScore';

/**
 * Health Score 조회 쿼리 키
 */
export const HEALTH_SCORE_QUERY_KEY = ['health-score'] as const;

/**
 * 기기의 헬스 스코어를 조회하는 React Query 훅
 *
 * @param deviceId 조회할 기기의 ID
 * @param params 쿼리 파라미터 (from, to)
 * @returns useQuery 객체 - 헬스 스코어 정보를 반환합니다.
 *
 * @example
 * ```tsx
 * function HealthScoreCard({ deviceId }: { deviceId: string }) {
 *   const { data, isLoading, isError, refetch } = useHealthScore(deviceId);
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>에러 발생</Text>;
 *
 *   return (
 *     <View>
 *       <Text>헬스 스코어: {data?.score}</Text>
 *       <Text>온도 감점: {data?.details.temperaturePenalty}</Text>
 *       <Text>습도 감점: {data?.details.humidityPenalty}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useHealthScore(deviceId: string, params?: GetHealthScoreParams) {
  return useQuery<HealthScoreResponse>({
    queryKey: [...HEALTH_SCORE_QUERY_KEY, deviceId, params],
    queryFn: () => fetchHealthScore(deviceId, params),
    enabled: !!deviceId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });
}

/**
 * Reports 네임스페이스를 통한 헬스 스코어 조회 훅
 *
 * @param deviceId 조회할 기기의 ID
 * @param params 쿼리 파라미터 (from, to)
 * @returns useQuery 객체 - 헬스 스코어 정보를 반환합니다.
 */
export function useHealthScoreFromReports(deviceId: string, params?: GetHealthScoreParams) {
  return useQuery<HealthScoreResponse>({
    queryKey: [...HEALTH_SCORE_QUERY_KEY, 'reports', deviceId, params],
    queryFn: () => fetchHealthScoreFromReports(deviceId, params),
    enabled: !!deviceId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });
}
