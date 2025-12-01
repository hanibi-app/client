/**
 * 로그아웃 네비게이션 훅
 *
 * 로그아웃 시 안전하게 루트 네비게이터를 Login 화면으로 리셋합니다.
 * 하위 화면(Tab, Stack 등)에서도 항상 루트 네비게이터 기준으로 RESET을 수행합니다.
 */

import { CommonActions } from '@react-navigation/native';

import { ROOT_ROUTES } from '@/constants/routes';
import { useLogout } from '@/features/auth/hooks';
import { useAppState } from '@/state/useAppState';

import { getRootNavigationRef, isRootNavigationReady } from './navigationRef';

/**
 * 로그아웃 후 Login 화면으로 안전하게 리셋합니다.
 *
 * 이 함수는:
 * 1. 로그아웃 API 호출
 * 2. 토큰 및 전역 상태 초기화
 * 3. 루트 네비게이터를 Login 화면으로 RESET
 *
 * @returns Promise<void>
 */
export const navigateToLoginAfterLogout = async (): Promise<void> => {
  try {
    // 1. 로그아웃 API 호출 및 토큰 초기화
    // useLogout 훅을 직접 사용할 수 없으므로, 여기서는 상태 변경만 처리
    // 실제 로그아웃 API 호출은 useLogout 훅에서 처리됨

    // 2. 루트 네비게이터가 준비될 때까지 대기
    const waitForNavigation = (maxAttempts = 10, delay = 100): Promise<void> => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const checkReady = () => {
          if (isRootNavigationReady()) {
            resolve();
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkReady, delay);
          } else {
            reject(new Error('Navigation is not ready'));
          }
        };
        checkReady();
      });
    };

    await waitForNavigation();

    // 3. 루트 네비게이터로 RESET 액션 디스패치
    const navigationRef = getRootNavigationRef();
    if (navigationRef) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ROOT_ROUTES.LOGIN }],
        }),
      );
      console.log('[navigateToLoginAfterLogout] Login 화면으로 리셋 완료');
    } else {
      console.error('[navigateToLoginAfterLogout] Navigation ref가 없습니다.');
    }
  } catch (error) {
    console.error('[navigateToLoginAfterLogout] 에러:', error);
    throw error;
  }
};

/**
 * 로그아웃 네비게이션 훅
 *
 * 로그아웃을 처리하고 Login 화면으로 이동하는 통합 훅입니다.
 *
 * @returns 로그아웃 함수
 */
export const useLogoutNavigation = () => {
  const logoutMutation = useLogout();
  const setHasOnboarded = useAppState((s) => s.setHasOnboarded);

  const handleLogout = async (): Promise<void> => {
    try {
      // 1. 로그아웃 API 호출 및 토큰 초기화
      await logoutMutation.mutateAsync();

      // 2. hasOnboarded를 false로 설정 (RootNavigator가 감지하여 처리)
      setHasOnboarded(false);

      // 3. 루트 네비게이터로 RESET (안전하게 처리)
      // 약간의 지연을 두어 상태 업데이트가 완료되도록 함
      setTimeout(async () => {
        try {
          await navigateToLoginAfterLogout();
        } catch (error) {
          console.error('[useLogoutNavigation] 네비게이션 리셋 실패:', error);
          // 실패해도 hasOnboarded가 false이므로 RootNavigator의 useEffect가 처리할 것
        }
      }, 150);
    } catch (error) {
      console.error('[useLogoutNavigation] 로그아웃 실패:', error);
      // 에러가 발생해도 hasOnboarded를 false로 설정하여 Login 화면으로 이동
      setHasOnboarded(false);

      // 네비게이션 리셋 시도
      setTimeout(async () => {
        try {
          await navigateToLoginAfterLogout();
        } catch (navError) {
          console.error('[useLogoutNavigation] 네비게이션 리셋 실패:', navError);
        }
      }, 150);
    }
  };

  return {
    handleLogout,
    isLoggingOut: logoutMutation.isPending,
  };
};
