/**
 * 앱 설정 및 환경 변수
 *
 * 이 파일은 앱의 설정과 환경 변수를 관리합니다.
 */

// 환경 변수
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  KAKAO_API_KEY: process.env.EXPO_PUBLIC_KAKAO_API_KEY || '',
};

// 앱 설정
export const APP_CONFIG = {
  name: '한니비',
  version: '1.0.0',
  description: '음식물 쓰레기 관리 앱',
};

// API 설정
export const API_CONFIG = {
  timeout: 10000,
  retryCount: 3,
  baseURL: ENV.API_BASE_URL,
};

// 스토리지 키
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_INFO: 'user_info',
  APP_SETTINGS: 'app_settings',
  THEME: 'theme',
} as const;
