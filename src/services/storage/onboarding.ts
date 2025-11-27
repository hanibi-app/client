import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_STORAGE_KEY = '@hanibi:onboarding_complete';

/**
 * 저장된 온보딩 완료 여부를 반환합니다.
 */
export async function readOnboardingStatus(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    return value === 'true';
  } catch (error) {
    console.error('온보딩 상태를 불러오지 못했습니다.', error);
    return false;
  }
}

/**
 * 온보딩 완료 상태를 저장합니다.
 */
export async function markOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
}

/**
 * 온보딩 완료 상태를 초기화합니다.
 */
export async function resetOnboardingProgress(): Promise<void> {
  await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
}

