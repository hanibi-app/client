/**
 * 로그아웃 네비게이션 훅
 *
 * 로그아웃 시 안전하게 루트 네비게이터를 Login 화면으로 리셋합니다.
 * 화면 컴포넌트 안에서만 사용해야 하며, NavigationContainer 바깥에서는 사용할 수 없습니다.
 */

import React from 'react';

import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { ROOT_ROUTES } from '@/constants/routes';
import { useLogout } from '@/features/auth/hooks';
import { useAppState } from '@/state/useAppState';

import type { RootStackParamList } from './types';

type RootStackNavigationProp = NavigationProp<RootStackParamList>;

/**
 * 로그아웃 네비게이션 훅
 *
 * 로그아웃을 처리하고 Login 화면으로 이동하는 통합 훅입니다.
 * 이 훅은 반드시 네비게이션 트리 안에 있는 화면/컴포넌트에서만 사용해야 합니다.
 *
 * @returns 로그아웃 함수 및 로딩 상태
 */
export const useLogoutNavigation = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const logoutMutation = useLogout();
  const setHasOnboarded = useAppState((s) => s.setHasOnboarded);

  const resetToLogin = React.useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: ROOT_ROUTES.LOGIN }],
    });
  }, [navigation]);

  const handleLogout = React.useCallback(async (): Promise<void> => {
    try {
      // 1. 로그아웃 API 호출 및 토큰 초기화
      await logoutMutation.mutateAsync();

      // 2. hasOnboarded를 false로 설정 (RootNavigator가 감지하여 처리)
      setHasOnboarded(false);

      // 3. 루트 네비게이터로 RESET
      // 네비게이션이 준비된 상태에서만 호출되므로 안전함
      resetToLogin();
    } catch (error) {
      console.error('[useLogoutNavigation] 로그아웃 실패:', error);
      // 에러가 발생해도 hasOnboarded를 false로 설정하여 Login 화면으로 이동
      setHasOnboarded(false);

      // 네비게이션 리셋 시도
      resetToLogin();
    }
  }, [logoutMutation, setHasOnboarded, resetToLogin]);

  return {
    handleLogout,
    isLoggingOut: logoutMutation.isPending,
  };
};
