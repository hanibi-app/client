/**
 * Weekly Summary 조회 React Query 훅
 * 주간 성과 요약 정보를 조회하는 훅입니다.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchWeeklySummary } from '@/api/reports';
import type { WeeklySummaryResponse } from '@/api/types/reports';

/**
 * Weekly Summary 조회 쿼리 키
 */
export const WEEKLY_SUMMARY_QUERY_KEY = ['reports', 'weekly-summary'] as const;

/**
 * Weekly Summary를 조회하는 React Query 훅
 * 5분간 캐시를 유지합니다.
 *
 * @returns useQuery 객체 - 주간 성과 요약 정보를 반환합니다.
 *
 * @example
 * ```tsx
 * function WeeklySummarySection() {
 *   const { data, isLoading, isError, refetch } = useWeeklySummary();
 *
 *   if (isLoading) return <Text>로딩 중...</Text>;
 *   if (isError) return <Text>에러 발생</Text>;
 *
 *   return (
 *     <View>
 *       <Text>처리량: {data?.processedAmount.value}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useWeeklySummary() {
  return useQuery<WeeklySummaryResponse>({
    queryKey: WEEKLY_SUMMARY_QUERY_KEY,
    queryFn: fetchWeeklySummary,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });
}
