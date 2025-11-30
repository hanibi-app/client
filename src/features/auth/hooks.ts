/**
 * 인증 관련 React Query 훅
 * useMutation을 활용하여 회원가입, 로그인, 로그아웃 기능을 제공합니다.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as authApi from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';

/**
 * 회원가입 훅
 * @returns useMutation 객체 - 회원가입 요청을 처리합니다.
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: authApi.RegisterPayload) => authApi.register(payload),
  });
};

/**
 * 로그인 훅
 * 로그인 성공 시 토큰을 authStore에 저장하고, 사용자 정보 캐시를 무효화합니다.
 * @returns useMutation 객체 - 로그인 요청을 처리합니다.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (payload: authApi.LoginPayload) => authApi.login(payload),
    onSuccess: (data: authApi.AuthResponse) => {
      // 로그인 성공 시 토큰 저장
      setTokens(data.accessToken, data.refreshToken);
      // 사용자 정보 캐시 무효화 (추후 사용자 정보를 가져올 때 사용)
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

/**
 * 로그아웃 훅
 * 로그아웃 요청 후 성공/실패 여부와 관계없이 클라이언트의 토큰을 초기화합니다.
 * @returns useMutation 객체 - 로그아웃 요청을 처리합니다.
 */
export const useLogout = () => {
  const clear = useAuthStore((state) => state.clear);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // 성공/실패 여부와 관계없이 클라이언트 토큰 초기화
      clear();
    },
  });
};
