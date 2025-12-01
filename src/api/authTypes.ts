/**
 * 인증 관련 타입 정의
 * API 응답 구조를 명확히 정의합니다.
 */

/**
 * 토큰 정보 타입
 */
export interface Tokens {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
}

/**
 * 사용자 정보 타입
 */
export interface User {
  id: number;
  email: string;
  nickname: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 로그인/회원가입 응답 데이터 구조
 */
export interface AuthResponseData {
  tokens: Tokens;
  user: User;
}

/**
 * API 공통 응답 래퍼
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * 인증 API 응답 타입
 */
export type AuthResponse = ApiResponse<AuthResponseData>;

/**
 * 회원가입 요청 페이로드
 */
export interface RegisterPayload {
  email: string;
  password: string;
  nickname: string;
}

/**
 * 로그인 요청 페이로드
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * 토큰 갱신 요청 페이로드
 */
export interface RefreshPayload {
  refreshToken: string;
}

/**
 * 카카오 로그인 요청 페이로드
 */
export interface KakaoLoginPayload {
  accessToken: string;
}

/**
 * 로그아웃 응답 데이터 구조
 */
export interface LogoutResponseData {
  userId: number;
}

/**
 * 로그아웃 API 응답 타입
 */
export type LogoutResponse = ApiResponse<LogoutResponseData>;
