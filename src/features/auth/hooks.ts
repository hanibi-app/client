/**
 * 인증 관련 React Query 훅
 * useMutation을 활용하여 회원가입, 로그인, 로그아웃, 토큰 갱신 기능을 제공합니다.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as authApi from '../../api/authApi';
import * as usersApi from '../../api/usersApi';
import { useAppState } from '../../state/useAppState';
import { useAuthStore } from '../../store/authStore';

/**
 * 회원가입 훅
 * 회원가입 성공 시 닉네임을 캐릭터 이름으로 저장합니다.
 * @returns useMutation 객체 - 회원가입 요청을 처리합니다.
 */
export const useRegister = () => {
  const setCharacterName = useAppState((s) => s.setCharacterName);

  return useMutation({
    mutationFn: (payload: authApi.RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      // 회원가입 시 입력한 닉네임을 캐릭터 이름으로 설정
      if (data.user?.nickname) {
        setCharacterName(data.user.nickname);
      }
    },
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
  const setCharacterName = useAppState((s) => s.setCharacterName);

  return useMutation({
    mutationFn: (payload: authApi.LoginPayload) => {
      console.log('[useLogin] 로그인 요청 시작:', { email: payload.email });
      return authApi.login(payload);
    },
    onSuccess: (data) => {
      // response.data.data 구조에서 user와 tokens 추출
      const { user, tokens } = data;

      // 디버깅용 로그: 응답 구조 확인
      console.log('[useLogin] 로그인 응답 데이터:', {
        dataKeys: Object.keys(data),
        hasUser: !!user,
        hasTokens: !!tokens,
        userKeys: user ? Object.keys(user) : [],
        tokensKeys: tokens ? Object.keys(tokens) : [],
      });

      // 토큰 안전하게 추출
      if (!tokens?.accessToken || !tokens?.refreshToken) {
        console.error('[useLogin] 토큰이 응답에 없습니다:', {
          hasAccessToken: !!tokens?.accessToken,
          hasRefreshToken: !!tokens?.refreshToken,
          tokens,
        });
        return; // 조기 return
      }

      // 디버깅용 로그: 토큰 정보 확인
      console.log('[useLogin] 로그인 성공:', {
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        accessTokenLength: tokens.accessToken.length,
        refreshTokenLength: tokens.refreshToken.length,
        userNickname: user?.nickname,
        userId: user?.id,
        dataKeys: Object.keys(data),
      });

      // 로그인 성공 시 토큰 저장 (try-catch로 안전하게 처리)
      try {
        setTokens(tokens.accessToken, tokens.refreshToken);
        console.log('[useLogin] 토큰 저장 완료');
      } catch (error) {
        console.error('[useLogin] 토큰 저장 중 에러:', error);
        // 에러가 발생해도 나머지 로직은 계속 진행
      }

      // 사용자 닉네임을 캐릭터 이름으로 설정
      try {
        if (user?.nickname) {
          setCharacterName(user.nickname);
        }
      } catch (error) {
        console.error('[useLogin] 캐릭터 이름 설정 중 에러:', error);
      }

      // 사용자 정보 캐시 무효화
      try {
        queryClient.invalidateQueries({ queryKey: ['me'] });
      } catch (error) {
        console.error('[useLogin] 쿼리 무효화 중 에러:', error);
      }
    },
    onError: (error: unknown) => {
      console.error('[useLogin] 로그인 실패:', error);
    },
  });
};

/**
 * 토큰 갱신 훅
 * 리프레시 토큰을 사용하여 액세스 토큰을 갱신합니다.
 * @returns useMutation 객체 - 토큰 갱신 요청을 처리합니다.
 */
export const useRefresh = () => {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        throw new Error('Refresh token이 없습니다.');
      }
      return authApi.refresh(refreshToken);
    },
    onSuccess: (tokens) => {
      console.log('[useRefresh] 토큰 갱신 성공:', {
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        accessTokenLength: tokens.accessToken.length,
      });
      // 새 토큰 저장
      setTokens(tokens.accessToken, tokens.refreshToken);
      // 사용자 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: unknown) => {
      console.error('[useRefresh] 토큰 갱신 실패:', error);
    },
  });
};

/**
 * 로그아웃 훅
 * 저장된 accessToken을 사용하여 로그아웃 API를 호출하고,
 * 성공 시 토큰 및 전역 상태를 초기화합니다.
 * @returns useMutation 객체 - 로그아웃 요청을 처리합니다.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const clear = useAuthStore((state) => state.clear);
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: () => {
      // accessToken이 없으면 경고 로그만 남기고 조용히 실패 처리
      if (!accessToken) {
        console.warn('[useLogout] accessToken이 없습니다. 로그아웃 요청을 건너뜁니다.');
        // accessToken이 없어도 로컬 상태는 초기화
        return Promise.resolve({ userId: null });
      }

      console.log('[useLogout] 로그아웃 요청 시작');
      // 저장된 accessToken을 사용하여 로그아웃 API 호출
      // httpClient 인터셉터가 자동으로 Authorization 헤더에 추가하지만,
      // 명시적으로 전달하여 안전성 확보
      return authApi.logout(accessToken);
    },
    onSuccess: (data) => {
      console.log('[useLogout] 로그아웃 성공:', {
        userId: data.userId,
      });

      // 저장된 accessToken/refreshToken 제거
      clear();

      // 전역 user/auth state 초기화 (모든 쿼리 캐시 초기화)
      queryClient.clear();

      console.log('[useLogout] 토큰 및 상태 초기화 완료');
    },
    onError: (error: unknown) => {
      console.error('[useLogout] 로그아웃 실패:', error);

      // 에러가 발생해도 로컬 토큰은 초기화 (보안상 안전)
      clear();
      queryClient.clear();
    },
  });
};

/**
 * 내 프로필 조회 훅
 * @returns useQuery 객체 - 사용자 프로필 정보를 조회합니다.
 */
export const useMe = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['me'],
    queryFn: () => usersApi.getMe(),
    enabled: !!accessToken, // 토큰이 있을 때만 조회
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });
};

/**
 * 내 프로필 수정 훅
 * @returns useMutation 객체 - 사용자 프로필 수정 요청을 처리합니다.
 */
export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: usersApi.UpdateProfilePayload) => usersApi.updateMe(payload),
    onSuccess: (data: usersApi.UserProfile) => {
      console.log('[useUpdateMe] 프로필 수정 성공:', data);
      // 프로필 정보 캐시 업데이트
      queryClient.setQueryData(['me'], data);
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: unknown) => {
      console.error('[useUpdateMe] 프로필 수정 실패:', error);
    },
  });
};

/**
 * 카카오 로그인 훅
 * 카카오 로그인 성공 시 토큰을 authStore에 저장하고, 사용자 정보 캐시를 무효화합니다.
 * @returns useMutation 객체 - 카카오 로그인 요청을 처리합니다.
 */
export const useKakaoLogin = () => {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setCharacterName = useAppState((s) => s.setCharacterName);

  return useMutation({
    mutationFn: (payload: authApi.KakaoLoginPayload) => {
      console.log('[useKakaoLogin] 카카오 로그인 요청 시작');
      return authApi.kakaoLogin(payload);
    },
    onSuccess: (data) => {
      // 토큰 추출
      const tokens = authApi.extractTokens(data);

      console.log('[useKakaoLogin] 카카오 로그인 성공:', {
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        accessTokenLength: tokens.accessToken.length,
        userNickname: data.user?.nickname,
      });

      // 로그인 성공 시 토큰 저장
      setTokens(tokens.accessToken, tokens.refreshToken);

      // 사용자 닉네임을 캐릭터 이름으로 설정
      if (data.user?.nickname) {
        setCharacterName(data.user.nickname);
      }

      // 사용자 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['me'] });
      console.log('[useKakaoLogin] 토큰 저장 완료');
    },
    onError: (error: unknown) => {
      console.error('[useKakaoLogin] 카카오 로그인 실패:', error);
    },
  });
};
