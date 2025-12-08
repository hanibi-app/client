/**
 * Eco Score 조회 React Query 훅
 * 환경 점수를 조회하는 훅입니다.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchEcoScore } from '@/api/reports';
import type { EcoScoreResponse } from '@/api/types/reports';

/**
 * Eco Score 조회 쿼리 키
 */
export const ECO_SCORE_QUERY_KEY = ['reports', 'eco-score'] as const;

/**
 * Eco Score를 조회하는 React Query 훅
 * 5분간 캐시를 유지합니다.
 *
 * @returns useQuery 객체 - Eco Score 정보를 반환합니다.
 *
 * @example
 * ```tsx
 * function EcoScoreCard() {
 *   const { data, isLoading, isError, refetch } = useEcoScore();
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>에러 발생</Text>;
 *
 *   return (
 *     <View>
 *       <Text>환경 점수: {data?.score}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useEcoScore() {
  return useQuery<EcoScoreResponse>({
    queryKey: ECO_SCORE_QUERY_KEY,
    queryFn: fetchEcoScore,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });
}
