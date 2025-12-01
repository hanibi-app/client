/**
 * 사용자 관련 React Query 훅
 * useQuery와 useMutation을 활용하여 사용자 프로필 조회 및 수정 기능을 제공합니다.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usersApi, Me, UpdateProfilePayload } from '@/api/usersApi';
import { useAuthStore } from '@/store/authStore';

/**
 * 사용자 프로필 조회 쿼리 키
 */
export const ME_QUERY_KEY = ['me'] as const;

/**
 * 내 프로필 조회 훅
 * @returns useQuery 객체 - 사용자 프로필 정보를 조회합니다.
 */
export function useMe() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery<Me>({
    queryKey: ME_QUERY_KEY,
    queryFn: usersApi.getMe,
    enabled: !!accessToken, // 토큰이 있을 때만 조회
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });
}

/**
 * 내 프로필 수정 훅
 * 닉네임 수정 후 ['me'] 쿼리를 자동으로 최신화합니다.
 * @returns useMutation 객체 - 사용자 프로필 수정 요청을 처리합니다.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<Me, Error, UpdateProfilePayload>({
    mutationFn: usersApi.updateProfile,
    onSuccess: (data) => {
      // ['me'] 쿼리 데이터 직접 업데이트
      queryClient.setQueryData(ME_QUERY_KEY, data);
    },
  });
}
