/**
 * 사용자 관련 API 래퍼
 * Hanibi 백엔드의 Users 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { ApiResponse } from './authTypes';
import { apiClient } from './httpClient';

/**
 * 공통 응답 타입
 */
export type { ApiResponse };

/**
 * 사용자 프로필 정보 타입 (Me)
 */
export type Me = {
  id: number;
  email: string;
  nickname: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * 프로필 수정 요청 페이로드 타입
 */
export type UpdateProfilePayload = {
  nickname: string;
};

/**
 * 내 프로필 조회 API 호출
 * @returns Promise<Me> 사용자 프로필 정보
 */
export const usersApi = {
  getMe: async (): Promise<Me> => {
    const response = await apiClient.get<ApiResponse<Me>>('/api/v1/users/me');
    return response.data.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<Me> => {
    const response = await apiClient.patch<ApiResponse<Me>>('/api/v1/users/me', payload);
    return response.data.data;
  },
};

/**
 * @deprecated useMe는 usersApi.getMe를 사용하세요
 * 내 프로필 조회 API 호출 (하위 호환성 유지)
 */
export const getMe = usersApi.getMe;

/**
 * @deprecated updateProfile은 usersApi.updateProfile을 사용하세요
 * 내 프로필 수정 API 호출 (하위 호환성 유지)
 */
export const updateMe = async (payload: UpdateProfilePayload): Promise<Me> => {
  return usersApi.updateProfile(payload);
};

/**
 * @deprecated UserProfile 대신 Me 타입을 사용하세요
 * 사용자 프로필 정보 타입 (하위 호환성 유지)
 */
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}
