import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CommonActions, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROOT_ROUTES } from '@/constants/routes';
import EmailLoginScreen from '@/screens/EmailLoginScreen';
import CharacterCustomizeScreen from '@/screens/Home/CharacterCustomizeScreen';
import LoginScreen from '@/screens/LoginScreen';
import NotificationRequestScreen from '@/screens/NotificationRequestScreen';
import PrecautionsScreen from '@/screens/PrecautionsScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import { markOnboardingComplete, readOnboardingStatus } from '@/services/storage/onboarding';
import { useAppState } from '@/state/useAppState';
import { restoreTokensFromStorage } from '@/store/authStore';

import MainTabs from './MainTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootNavigatorProps = {
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>;
};

export default function RootNavigator({ navigationRef }: RootNavigatorProps) {
  const hasOnboarded = useAppState((s) => s.hasOnboarded);
  const setHasOnboarded = useAppState((s) => s.setHasOnboarded);
  const [isLoading, setIsLoading] = useState(true);
  const prevHasOnboardedRef = useRef(hasOnboarded);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      // 앱 시작 시 토큰 복원
      await restoreTokensFromStorage();

      // 온보딩 상태 확인
      const isComplete = await readOnboardingStatus();
      if (isComplete) {
        setHasOnboarded(true);
      }
    } catch (error) {
      console.error('초기화 오류:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setHasOnboarded]);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  // hasOnboarded가 false로 변경되면 Login 화면으로 리셋
  useEffect(() => {
    // 초기 로딩 중이거나 이전 값과 같으면 무시
    if (isLoading || prevHasOnboardedRef.current === hasOnboarded) {
      prevHasOnboardedRef.current = hasOnboarded;
      return;
    }

    // hasOnboarded가 true에서 false로 변경된 경우 (로그아웃)
    if (prevHasOnboardedRef.current === true && hasOnboarded === false) {
      // 루트 네비게이터가 준비될 때까지 대기 후 리셋
      const resetToLogin = () => {
        if (navigationRef.current?.isReady()) {
          try {
            navigationRef.current.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: ROOT_ROUTES.LOGIN }],
              }),
            );
            console.log('[RootNavigator] Login 화면으로 리셋 완료');
          } catch (error) {
            console.error('[RootNavigator] 리셋 에러:', error);
          }
        } else {
          // 네비게이터가 준비되지 않았으면 재시도
          setTimeout(resetToLogin, 100);
        }
      };

      // 약간의 지연을 두어 상태 업데이트가 완료되도록 함
      setTimeout(resetToLogin, 100);
    }

    prevHasOnboardedRef.current = hasOnboarded;
  }, [hasOnboarded, isLoading, navigationRef]);

  const completeOnboarding = async () => {
    try {
      await markOnboardingComplete();
      setHasOnboarded(true);
    } catch (error) {
      console.error('온보딩 완료 저장 오류:', error);
    }
  };

  if (isLoading) {
    // 로딩 중에는 아무것도 표시하지 않음 (Splash Screen이 처리)
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={hasOnboarded ? ROOT_ROUTES.MAIN_TABS : ROOT_ROUTES.LOGIN}
    >
      {/* 온보딩 전 화면들 - 항상 등록 (조건부 렌더링 제거) */}
      <Stack.Screen name={ROOT_ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROOT_ROUTES.EMAIL_LOGIN} component={EmailLoginScreen} />
      <Stack.Screen name={ROOT_ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={ROOT_ROUTES.NOTIFICATION_REQUEST} component={NotificationRequestScreen} />
      <Stack.Screen name={ROOT_ROUTES.CAUTION_SLIDES}>
        {(props) => <PrecautionsScreen {...props} onComplete={completeOnboarding} />}
      </Stack.Screen>
      <Stack.Screen name={ROOT_ROUTES.CHARACTER_CUSTOMIZE} component={CharacterCustomizeScreen} />
      {/* 메인 탭 화면 - 항상 등록 */}
      <Stack.Screen name={ROOT_ROUTES.MAIN_TABS} component={MainTabs} />
      {/* 카메라 모달 그룹 (나중에 구현) */}
    </Stack.Navigator>
  );
}
