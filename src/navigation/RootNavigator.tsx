import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CommonActions, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROOT_ROUTES } from '@/constants/routes';
import CharacterCustomizeScreen from '@/screens/Home/CharacterCustomizeScreen';
import LoginScreen from '@/screens/LoginScreen';
import NotificationRequestScreen from '@/screens/NotificationRequestScreen';
import PrecautionsScreen from '@/screens/PrecautionsScreen';
import { markOnboardingComplete, readOnboardingStatus } from '@/services/storage/onboarding';
import { useAppState } from '@/state/useAppState';

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
      const isComplete = await readOnboardingStatus();
      if (isComplete) {
        setHasOnboarded(true);
      }
    } catch (error) {
      console.error('온보딩 상태 확인 오류:', error);
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

    // hasOnboarded가 true에서 false로 변경된 경우
    if (prevHasOnboardedRef.current === true && hasOnboarded === false) {
      // 다음 렌더링 사이클에서 리셋 실행 (Login 화면이 스택에 추가된 후)
      setTimeout(() => {
        if (navigationRef.current?.isReady()) {
          navigationRef.current.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: ROOT_ROUTES.LOGIN }],
            }),
          );
        }
      }, 0);
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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasOnboarded ? (
        <>
          <Stack.Screen name={ROOT_ROUTES.LOGIN} component={LoginScreen} />
          <Stack.Screen
            name={ROOT_ROUTES.NOTIFICATION_REQUEST}
            component={NotificationRequestScreen}
          />
          <Stack.Screen name={ROOT_ROUTES.CAUTION_SLIDES}>
            {(props) => <PrecautionsScreen {...props} onComplete={completeOnboarding} />}
          </Stack.Screen>
          <Stack.Screen
            name={ROOT_ROUTES.CHARACTER_CUSTOMIZE}
            component={CharacterCustomizeScreen}
          />
        </>
      ) : null}
      <Stack.Screen name={ROOT_ROUTES.MAIN_TABS} component={MainTabs} />
      {/* 카메라 모달 그룹 (나중에 구현) */}
    </Stack.Navigator>
  );
}
