/**
 * 인증 상태 디버깅 유틸리티
 * 개발 중 로그인 상태를 확인하는 데 사용합니다.
 */

import { useAuthStore } from '../store/authStore';

/**
 * 현재 인증 상태를 콘솔에 출력합니다.
 */
export const logAuthState = () => {
  const state = useAuthStore.getState();
  console.log('=== 인증 상태 ===');
  console.log('Access Token:', state.accessToken ? `있음 (${state.accessToken.length}자)` : '없음');
  console.log(
    'Refresh Token:',
    state.refreshToken ? `있음 (${state.refreshToken.length}자)` : '없음',
  );
  console.log('================');
};

/**
 * 현재 인증 상태를 반환합니다.
 */
export const getAuthState = () => {
  return useAuthStore.getState();
};

/**
 * 로그인 여부를 확인합니다.
 */
export const isAuthenticated = (): boolean => {
  const state = useAuthStore.getState();
  return !!(state.accessToken && state.refreshToken);
};
