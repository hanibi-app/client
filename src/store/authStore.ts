/**
 * 인증 상태 관리 스토어
 * Zustand를 사용하여 accessToken과 refreshToken을 관리하고,
 * 토큰 설정/초기화 및 인증 실패 처리 로직을 제공합니다.
 * AsyncStorage를 사용하여 토큰을 영구 저장합니다.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const TOKEN_STORAGE_KEY = '@hanibi:auth_tokens';

/**
 * 토큰을 AsyncStorage에 저장하는 헬퍼 함수
 */
const saveTokensToStorage = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    const tokens = JSON.stringify({ accessToken, refreshToken });
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, tokens);
    console.log('[AsyncStorage] 토큰 저장 성공');
  } catch (error) {
    console.error('[AsyncStorage] 토큰 저장 실패:', error);
    // 에러를 throw하지 않음 (앱 크래시 방지)
  }
};

/**
 * AsyncStorage에서 토큰을 불러오는 헬퍼 함수
 */
const loadTokensFromStorage = async (): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> => {
  try {
    const tokens = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (tokens) {
      const parsed = JSON.parse(tokens);
      return {
        accessToken: parsed.accessToken || null,
        refreshToken: parsed.refreshToken || null,
      };
    }
    return { accessToken: null, refreshToken: null };
  } catch (error) {
    console.error('[AsyncStorage] 토큰 불러오기 실패:', error);
    return { accessToken: null, refreshToken: null };
  }
};

/**
 * AsyncStorage에서 토큰을 제거하는 헬퍼 함수
 */
const removeTokensFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    console.log('[AsyncStorage] 토큰 제거 성공');
  } catch (error) {
    console.error('[AsyncStorage] 토큰 제거 실패:', error);
  }
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isRefreshing: boolean;
  refreshPromise: Promise<string> | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
  handleUnauthorized: () => void;
  refreshAccessToken: () => Promise<string>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isRefreshing: false,
  refreshPromise: null,

  /**
   * 액세스 토큰과 리프레시 토큰을 설정합니다.
   * AsyncStorage에 비동기로 저장됩니다.
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    try {
      console.log('[AuthStore] 토큰 설정 시작:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenLength: accessToken?.length,
      });

      // 먼저 메모리 상태 업데이트 (동기적)
      set({ accessToken, refreshToken });

      // 그 다음 AsyncStorage에 비동기로 저장 (에러가 발생해도 앱이 크래시되지 않음)
      // await하지 않아서 메인 스레드를 블로킹하지 않음
      saveTokensToStorage(accessToken, refreshToken).catch((error) => {
        console.error('[AuthStore] AsyncStorage 저장 실패 (무시됨):', error);
      });

      console.log('[AuthStore] 토큰 설정 완료');
    } catch (error) {
      console.error('[AuthStore] 토큰 설정 중 에러:', error);
      // 에러가 발생해도 앱이 크래시되지 않도록 처리
    }
  },

  /**
   * 모든 토큰을 초기화합니다.
   * AsyncStorage에서도 제거됩니다.
   */
  clear: () => {
    console.log('[AuthStore] 토큰 초기화');
    set({
      accessToken: null,
      refreshToken: null,
      isRefreshing: false,
      refreshPromise: null,
    });

    // AsyncStorage에서도 제거 (비동기, 에러 무시)
    removeTokensFromStorage().catch((error) => {
      console.error('[AuthStore] AsyncStorage 제거 실패 (무시됨):', error);
    });
  },

  /**
   * 리프레시 토큰을 사용하여 액세스 토큰을 갱신합니다.
   * 동시에 여러 요청이 401을 받았을 때 중복 갱신을 방지합니다.
   */
  refreshAccessToken: async (): Promise<string> => {
    const state = get();

    // 이미 갱신 중이면 기존 Promise 반환
    if (state.isRefreshing && state.refreshPromise) {
      return state.refreshPromise;
    }

    // 리프레시 토큰이 없으면 에러
    if (!state.refreshToken) {
      throw new Error('Refresh token이 없습니다.');
    }

    // 갱신 시작
    set({ isRefreshing: true });

    const refreshPromise = (async () => {
      try {
        // 동적 import로 순환 참조 방지
        const { refresh } = await import('../api/authApi');
        const tokens = await refresh(state.refreshToken!);

        // 새 토큰 저장
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isRefreshing: false,
          refreshPromise: null,
        });

        console.log('[AuthStore] 토큰 갱신 성공');
        return tokens.accessToken;
      } catch (error) {
        console.error('[AuthStore] 토큰 갱신 실패:', error);
        // 갱신 실패 시 토큰 초기화
        set({
          accessToken: null,
          refreshToken: null,
          isRefreshing: false,
          refreshPromise: null,
        });
        throw error;
      }
    })();

    set({ refreshPromise });
    return refreshPromise;
  },

  /**
   * 401 Unauthorized 응답을 처리합니다.
   * 리프레시 토큰을 사용하여 자동 갱신을 시도합니다.
   */
  handleUnauthorized: async () => {
    const state = get();

    // 리프레시 토큰이 있으면 갱신 시도
    if (state.refreshToken) {
      try {
        console.log('[AuthStore] 401 에러 - 토큰 갱신 시도');
        await state.refreshAccessToken();
        console.log('[AuthStore] 토큰 갱신 완료');
      } catch (error) {
        console.error('[AuthStore] 토큰 갱신 실패 - 로그아웃 처리');
        // 갱신 실패 시 토큰 초기화 (이미 refreshAccessToken에서 처리됨)
      }
    } else {
      // 리프레시 토큰이 없으면 바로 초기화
      console.warn('[AuthStore] Unauthorized - refresh token 없음, 토큰 초기화');
      set({ accessToken: null, refreshToken: null });
    }
  },
}));

/**
 * 앱 시작 시 AsyncStorage에서 토큰을 불러와서 스토어에 복원합니다.
 * 이 함수는 App.tsx나 RootNavigator에서 한 번만 호출하면 됩니다.
 */
export const restoreTokensFromStorage = async (): Promise<void> => {
  try {
    console.log('[AuthStore] 토큰 복원 시작');
    const { accessToken, refreshToken } = await loadTokensFromStorage();

    if (accessToken && refreshToken) {
      useAuthStore.getState().setTokens(accessToken, refreshToken);
      console.log('[AuthStore] 토큰 복원 완료');
    } else {
      console.log('[AuthStore] 저장된 토큰 없음');
    }
  } catch (error) {
    console.error('[AuthStore] 토큰 복원 실패:', error);
  }
};
