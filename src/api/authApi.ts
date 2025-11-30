/**
 * 인증 관련 API 래퍼
 * Hanibi 백엔드의 Auth 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { apiClient } from './httpClient';

/**
 * 회원가입 요청 페이로드 타입
 */
export interface RegisterPayload {
  email: string;
  password: string;
  nickname: string;
}

/**
 * 로그인 요청 페이로드 타입
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * 인증 응답 타입
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * 회원가입 API 호출
 * @param payload 회원가입 정보 (이메일, 비밀번호, 닉네임)
 * @returns Promise<void | unknown>
 */
export const register = async (payload: RegisterPayload): Promise<void | unknown> => {
  return apiClient.post('/api/v1/auth/register', payload).then((res) => res.data);
};

/**
 * 로그인 API 호출
 * @param payload 로그인 정보 (이메일, 비밀번호)
 * @returns Promise<AuthResponse> 액세스 토큰과 리프레시 토큰을 포함한 응답
 */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  return apiClient.post('/api/v1/auth/login', payload).then((res) => res.data);
};

/**
 * 토큰 갱신 API 호출
 * @param refreshToken 리프레시 토큰
 * @returns Promise<AuthResponse> 새로운 액세스 토큰과 리프레시 토큰을 포함한 응답
 */
export const refresh = async (refreshToken: string): Promise<AuthResponse> => {
  return apiClient.post('/api/v1/auth/refresh', { refreshToken }).then((res) => res.data);
};

/**
 * 로그아웃 API 호출
 * @returns Promise<void | unknown>
 */
export const logout = async (): Promise<void | unknown> => {
  return apiClient.post('/api/v1/auth/logout').then((res) => res.data);
};

/**
 * 카카오 로그인 요청 페이로드 타입
 */
export interface KakaoLoginPayload {
  accessToken: string;
}

/**
 * 카카오 로그인 API 호출
 * @param payload 카카오 액세스 토큰
 * @returns Promise<AuthResponse> 액세스 토큰과 리프레시 토큰을 포함한 응답
 */
export const kakaoLogin = async (payload: KakaoLoginPayload): Promise<AuthResponse> => {
  return apiClient.post('/api/v1/auth/kakao', payload).then((res) => res.data);
};
