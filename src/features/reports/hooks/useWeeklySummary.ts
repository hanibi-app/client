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
// 디버그 모드 플래그
const DEBUG_MODE = true;

// 더미 주간 성과 요약 데이터
const dummyWeeklySummary: WeeklySummaryResponse = {
  weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  weekEnd: new Date().toISOString(),
  processedAmount: {
    value: 1250.5,
    previousValue: 1100.3,
    changeRate: 0.136, // +13.6%
  },
  co2Savings: {
    value: 320.8,
    previousValue: 280.5,
    changeRate: 0.144, // +14.4%
  },
  energyEfficiency: {
    value: 85.2,
    previousValue: 82.1,
    changeRate: 0.038, // +3.8%
  },
};

export function useWeeklySummary() {
  return useQuery<WeeklySummaryResponse>({
    queryKey: WEEKLY_SUMMARY_QUERY_KEY,
    queryFn: DEBUG_MODE
      ? async () => {
          // 디버그 모드에서는 더미 데이터 반환
          await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
          return dummyWeeklySummary;
        }
      : fetchWeeklySummary,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });
}
