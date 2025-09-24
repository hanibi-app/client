/**
 * 전역 상태 관리
 * 
 * 이 파일은 앱의 전역 상태를 관리합니다.
 */

// 상태 관리 도구 (Zustand 또는 Redux Toolkit)
// TODO: 상태 관리 도구 도입 후 구현

// 사용자 상태
export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 앱 설정 상태
export interface AppState {
  settings: AppSettings;
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
}

// 전역 상태 타입
export interface GlobalState {
  user: UserState;
  app: AppState;
}

// 상태 관리 훅 (구현 예정)
export const useUserStore = () => {
  // TODO: Zustand 또는 Redux Toolkit 구현
  throw new Error('상태 관리 도구가 아직 구현되지 않았습니다.');
};

export const useAppStore = () => {
  // TODO: Zustand 또는 Redux Toolkit 구현
  throw new Error('상태 관리 도구가 아직 구현되지 않았습니다.');
};
