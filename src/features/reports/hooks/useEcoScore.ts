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
// 디버그 모드 플래그
const DEBUG_MODE = true;

// 더미 환경 점수 데이터
const dummyEcoScore: EcoScoreResponse = {
  score: 75,
  components: {
    processedAmount: 1250.5,
    efficiency: 85.2,
    co2Savings: 320.8,
    metrics: {},
  },
};

export function useEcoScore() {
  return useQuery<EcoScoreResponse>({
    queryKey: ECO_SCORE_QUERY_KEY,
    queryFn: DEBUG_MODE
      ? async () => {
          // 디버그 모드에서는 더미 데이터 반환
          await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
          return dummyEcoScore;
        }
      : fetchEcoScore,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });
}
