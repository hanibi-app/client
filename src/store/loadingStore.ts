/**
 * 전역 로딩 상태 관리 스토어
 * 앱 전체에서 사용할 수 있는 로딩 상태를 관리합니다.
 */

import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>, message?: string) => Promise<T>;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: undefined,

  /**
   * 로딩 시작
   * @param message 로딩 메시지 (선택사항)
   */
  startLoading: (message?: string) => {
    set({ isLoading: true, message });
  },

  /**
   * 로딩 중지
   */
  stopLoading: () => {
    set({ isLoading: false, message: undefined });
  },

  /**
   * 비동기 함수를 실행하며 자동으로 로딩 상태 관리
   * @param asyncFn 실행할 비동기 함수
   * @param message 로딩 메시지 (선택사항)
   */
  withLoading: async <T>(asyncFn: () => Promise<T>, message?: string): Promise<T> => {
    try {
      set({ isLoading: true, message });
      return await asyncFn();
    } finally {
      set({ isLoading: false, message: undefined });
    }
  },
}));
