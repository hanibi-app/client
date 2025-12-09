/**
 * Ranking 조회 React Query 훅
 * 기간별 랭킹 정보를 조회하는 훅입니다.
 * 429 에러 시 최대 1번만 재시도하고, 그 외 에러는 최대 3번 재시도합니다.
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { fetchRanking } from '@/api/reports';
import type { RankingPeriod, RankingResponse } from '@/api/types/reports';

/**
 * Ranking 조회 쿼리 키 생성 함수
 */
export const RANKING_QUERY_KEY = (period: RankingPeriod) => ['reports', 'ranking', period] as const;

/**
 * Ranking을 조회하는 React Query 훅
 * refetchOnWindowFocus는 false로 설정하여 포커스 시 자동 호출을 방지합니다.
 * 429 에러는 최대 1번만 재시도하고, 그 외 에러는 최대 3번 재시도합니다.
 *
 * @param period 랭킹 기간 (HOURLY | DAILY | WEEKLY | MONTHLY)
 * @param options 추가 useQuery 옵션
 * @returns useQuery 객체 - 랭킹 정보를 반환합니다.
 *
 * @example
 * ```tsx
 * function RankingList() {
 *   const { data, isLoading, isError, error } = useRanking('DAILY');
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) {
 *     if (error instanceof AxiosError && error.response?.status === 429) {
 *       return <Text>요청이 많아 잠시 후 다시 시도해 주세요.</Text>;
 *     }
 *     return <Text>에러 발생</Text>;
 *   }
 *
 *   return (
 *     <View>
 *       {data?.items.map((item) => (
 *         <Text key={item.rank}>{item.rank}. {item.name} - {item.score}</Text>
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 */
export function useRanking(
  period: RankingPeriod,
  options?: Omit<UseQueryOptions<RankingResponse, AxiosError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<RankingResponse, AxiosError>({
    queryKey: RANKING_QUERY_KEY(period),
    queryFn: () => fetchRanking(period),
    refetchOnWindowFocus: false, // 포커스 시 자동 호출 방지
    retry: (failureCount, error) => {
      // 429 에러인 경우 최대 1번만 재시도
      if (error instanceof AxiosError && error.response?.status === 429) {
        return failureCount < 1;
      }
      // 그 외 에러는 최대 3번 재시도
      return failureCount < 3;
    },
    ...options,
  });
}
