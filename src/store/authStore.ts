/**
 * 인증 상태 관리 스토어
 * Zustand를 사용하여 accessToken과 refreshToken을 관리하고,
 * 토큰 설정/초기화 및 인증 실패 처리 로직을 제공합니다.
 */

import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
  handleUnauthorized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,

  /**
   * 액세스 토큰과 리프레시 토큰을 설정합니다.
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    console.log('[AuthStore] 토큰 설정:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length,
    });
    set({ accessToken, refreshToken });
  },

  /**
   * 모든 토큰을 초기화합니다.
   */
  clear: () => {
    console.log('[AuthStore] 토큰 초기화');
    set({ accessToken: null, refreshToken: null });
  },

  /**
   * 401 Unauthorized 응답을 처리합니다.
   * 현재는 토큰을 초기화하고 콘솔에 로그를 남깁니다.
   * 추후 리프레시 토큰을 사용한 자동 갱신 로직을 추가할 예정입니다.
   */
  handleUnauthorized: () => {
    console.warn('[AuthStore] Unauthorized - clearing tokens');
    set({ accessToken: null, refreshToken: null });
    // TODO: 리프레시 토큰을 사용한 자동 갱신 로직 추가
  },
}));
