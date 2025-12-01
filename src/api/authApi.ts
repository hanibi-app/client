/**
 * 인증 관련 API 래퍼
 * Hanibi 백엔드의 Auth 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import type {
  AuthResponse,
  AuthResponseData,
  LoginPayload,
  LogoutResponse,
  RegisterPayload,
  RefreshPayload,
  KakaoLoginPayload,
  Tokens,
} from './authTypes';
import { apiClient } from './httpClient';

/**
 * 로그인/회원가입 성공 시 반환할 토큰 정보
 * (내부 사용용 - authStore에 저장하기 위한 형태)
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 회원가입 API 호출
 * @param payload 회원가입 정보 (이메일, 비밀번호, 닉네임)
 * @returns Promise<AuthResponseData> 회원가입 성공 시 사용자 및 토큰 정보
 */
export const register = async (payload: RegisterPayload): Promise<AuthResponseData> => {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', payload);

  if (!response.data.success || !response.data.data) {
    throw new Error('회원가입 응답 형식이 올바르지 않습니다.');
  }

  return response.data.data;
};

/**
 * 로그인 API 호출
 * @param payload 로그인 정보 (이메일, 비밀번호)
 * @returns Promise<AuthResponseData> 로그인 성공 시 사용자 및 토큰 정보
 *
 * 응답 구조:
 * {
 *   success: true,
 *   data: {
 *     user: { id, email, nickname, createdAt, updatedAt, emailVerified },
 *     tokens: { accessToken, refreshToken, expiresIn, refreshTokenExpiresIn }
 *   }
 * }
 */
export const login = async (payload: LoginPayload): Promise<AuthResponseData> => {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', payload);

  // 응답 구조 검증: response.data.success, response.data.data 확인
  if (!response.data.success || !response.data.data) {
    throw new Error('로그인 응답 형식이 올바르지 않습니다.');
  }

  // response.data.data에서 user와 tokens 추출
  const { tokens, user } = response.data.data;

  // 토큰 존재 여부 검증
  if (!tokens?.accessToken || !tokens?.refreshToken) {
    throw new Error('토큰이 응답에 포함되어 있지 않습니다.');
  }

  // user 정보 검증
  if (!user) {
    throw new Error('사용자 정보가 응답에 포함되어 있지 않습니다.');
  }

  console.log('[authApi.login] 로그인 성공:', {
    hasAccessToken: !!tokens.accessToken,
    hasRefreshToken: !!tokens.refreshToken,
    accessTokenLength: tokens.accessToken.length,
    refreshTokenLength: tokens.refreshToken.length,
    userId: user.id,
    userEmail: user.email,
  });

  // response.data.data 반환 (올바른 경로)
  return response.data.data;
};

/**
 * 토큰 추출 헬퍼 함수
 * AuthResponseData에서 토큰만 추출합니다.
 */
export const extractTokens = (data: AuthResponseData): AuthTokens => {
  if (!data.tokens?.accessToken || !data.tokens?.refreshToken) {
    throw new Error('토큰 정보가 없습니다.');
  }

  return {
    accessToken: data.tokens.accessToken,
    refreshToken: data.tokens.refreshToken,
  };
};

/**
 * 토큰 갱신 API 호출
 * @param refreshToken 리프레시 토큰
 * @returns Promise<AuthTokens> 새로운 액세스 토큰과 리프레시 토큰
 */
export const refresh = async (refreshToken: string): Promise<AuthTokens> => {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/refresh', {
    refreshToken,
  });

  console.log('[authApi.refresh] 전체 응답:', JSON.stringify(response.data, null, 2));

  if (!response.data.success || !response.data.data) {
    throw new Error('토큰 갱신 응답 형식이 올바르지 않습니다.');
  }

  return extractTokens(response.data.data);
};

/**
 * 로그아웃 API 호출
 * Authorization 헤더에 accessToken을 포함하여 요청합니다.
 * httpClient의 인터셉터가 자동으로 Authorization 헤더를 추가합니다.
 *
 * @param accessToken 로그아웃에 사용할 액세스 토큰 (선택적, 없으면 authStore에서 자동으로 가져옴)
 * @returns Promise<LogoutResponseData> 로그아웃 성공 시 userId 정보
 *
 * 응답 구조:
 * {
 *   success: true,
 *   data: { userId: number }
 * }
 */
export const logout = async (accessToken?: string): Promise<LogoutResponse['data']> => {
  // accessToken이 제공된 경우, 임시로 헤더에 설정
  // (일반적으로는 httpClient 인터셉터가 자동으로 처리)
  const config = accessToken
    ? {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    : undefined;

  const response = await apiClient.post<LogoutResponse>('/api/v1/auth/logout', undefined, config);

  // 응답 구조 검증
  if (!response.data.success || !response.data.data) {
    throw new Error('로그아웃 응답 형식이 올바르지 않습니다.');
  }

  console.log('[authApi.logout] 로그아웃 성공:', {
    userId: response.data.data.userId,
  });

  return response.data.data;
};

/**
 * 카카오 로그인 API 호출
 * @param payload 카카오 액세스 토큰
 * @returns Promise<AuthResponseData> 로그인 성공 시 사용자 및 토큰 정보
 */
export const kakaoLogin = async (payload: KakaoLoginPayload): Promise<AuthResponseData> => {
  const response = await apiClient.post<AuthResponse>('/api/v1/auth/kakao', payload);

  if (!response.data.success || !response.data.data) {
    throw new Error('카카오 로그인 응답 형식이 올바르지 않습니다.');
  }

  return response.data.data;
};
