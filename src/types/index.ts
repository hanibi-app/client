/**
 * 전역 타입 정의
 * 
 * 이 파일은 앱 전반에서 사용되는 타입들을 정의합니다.
 */

// 기본 타입
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 사용자 타입
export interface User extends BaseEntity {
  email: string;
  name: string;
  profileImage?: string;
  isActive: boolean;
}

// 앱 설정 타입
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: 'ko' | 'en';
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 네비게이션 타입
export type RootStackParamList = {
  welcome: undefined;
  'notify-permission': undefined;
  'caution/step1': undefined;
  'caution/step2': undefined;
  'caution/step3': undefined;
  'character-customize': undefined;
  dashboard: undefined;
  report: undefined;
  modal: undefined;
  item: {
    id: string;
  };
  'item/new': undefined;
};

export type TabParamList = {
  home: undefined;
  search: undefined;
  settings: undefined;
};

export type AuthParamList = {
  'sign-in': undefined;
  'sign-up': undefined;
};
