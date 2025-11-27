/**
 * 온보딩 상태 리셋 유틸리티
 * 테스트/개발 목적으로 온보딩 상태를 초기화합니다.
 */

import {
  readOnboardingStatus,
  resetOnboardingProgress,
} from '@/services/storage/onboarding';

/**
 * 온보딩 상태를 리셋합니다.
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await resetOnboardingProgress();
    console.log('✅ 온보딩 상태가 리셋되었습니다.');
  } catch (error) {
    console.error('❌ 온보딩 상태 리셋 오류:', error);
    throw error;
  }
}

/**
 * 현재 온보딩 상태를 확인합니다.
 */
export async function checkOnboardingStatus(): Promise<boolean> {
  const isComplete = await readOnboardingStatus();
  console.log('현재 온보딩 상태:', isComplete ? '완료됨' : '미완료');
  return isComplete;
}

