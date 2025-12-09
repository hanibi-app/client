/**
 * 처리 진행률 계산 유틸 함수
 * 하드웨어의 weight_to_motor_time 로직과 동일하게 무게를 시간으로 변환하고
 * 진행률을 계산합니다.
 */

import type { FoodInputSession } from '@/types/foodSession';

/**
 * 무게 차이를 모터 동작 시간(밀리초)으로 변환합니다
 * 하드웨어의 weight_to_motor_time 함수와 동일한 로직
 *
 * @param weightDiff 무게 차이 (그램)
 * @returns 모터 동작 시간 (밀리초)
 */
export function weightToMotorTime(weightDiff: number): number {
  // 하드웨어와 동일한 변환 공식
  // 일반적으로 무게 1g당 처리 시간이 필요함
  // 예: 100g = 60초 = 60000ms → 600ms/g
  // TODO: 실제 하드웨어 사양에 맞게 조정 필요
  const MILLISECONDS_PER_GRAM = 600; // 1g당 600ms (0.6초)

  // 음수 무게는 0으로 처리
  const positiveWeight = Math.max(0, weightDiff);

  return Math.round(positiveWeight * MILLISECONDS_PER_GRAM);
}

/**
 * 처리 진행률을 계산합니다
 *
 * @param session 음식 투입 세션 (optional)
 * @param fallbackStartTime 세션이 없을 때 사용할 시작 시점 (optional)
 * @returns 진행률 (0~100) 및 남은 퍼센트, null이면 계산 불가
 */
export function calculateProcessingProgress(
  session: FoodInputSession | null,
  fallbackStartTime?: string,
): {
  progress: number; // 진행률 (0~100)
  remainingPercent: number; // 남은 퍼센트 (0~100)
} | null {
  // 처리 시작 시점 확인
  // 우선순위: 1) afterEvent.createdAt, 2) session.startedAt, 3) fallbackStartTime
  let processingStartTime: string | undefined;

  if (session) {
    // FOOD_INPUT_AFTER 이벤트가 있으면 그 시점부터 처리 시작
    // (하드웨어에서 STATE_MIXING으로 변경되는 시점 = FOOD_INPUT_AFTER 직후)
    processingStartTime = session.afterEvent?.createdAt || session.startedAt;
  } else {
    // 세션이 없으면 fallbackStartTime 사용
    processingStartTime = fallbackStartTime;
  }

  if (!processingStartTime) {
    // 시작 시점을 알 수 없으면 계산 불가
    return null;
  }

  // 총 처리 시간 계산 - 무조건 7분(420초) 사용
  const totalTimeMs = 7 * 60 * 1000; // 7분 = 420초 = 420000ms

  // 현재 시간
  const now = new Date().getTime();
  const startTime = new Date(processingStartTime).getTime();

  // 경과 시간
  const elapsedTimeMs = now - startTime;

  // 진행률 계산 (0~100)
  const progress = Math.min(100, Math.max(0, (elapsedTimeMs / totalTimeMs) * 100));

  // 남은 퍼센트
  const remainingPercent = Math.max(0, 100 - progress);

  return {
    progress,
    remainingPercent,
  };
}
