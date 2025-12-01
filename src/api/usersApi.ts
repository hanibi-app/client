/**
 * 사용자 관련 API 래퍼
 * Hanibi 백엔드의 Users 엔드포인트를 호출하는 함수들을 제공합니다.
 */

import { apiClient } from './httpClient';

/**
 * 사용자 프로필 정보 타입
 */
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 프로필 수정 요청 페이로드 타입
 */
export interface UpdateProfilePayload {
  nickname?: string;
}

/**
 * 내 프로필 조회 API 호출
 * @returns Promise<UserProfile> 사용자 프로필 정보
 */
export const getMe = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/api/v1/users/me');
  return response.data;
};

/**
 * 내 프로필 수정 API 호출
 * @param payload 수정할 프로필 정보
 * @returns Promise<UserProfile> 수정된 사용자 프로필 정보
 */
export const updateMe = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const response = await apiClient.patch<UserProfile>('/api/v1/users/me', payload);
  return response.data;
};
