import React, { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@/screens/LoginScreen';
import NotificationRequestScreen from '@/screens/NotificationRequestScreen';
import PrecautionsScreen from '@/screens/PrecautionsScreen';
import { useAppState } from '@/state/useAppState';

import MainTabs from './MainTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ONBOARDING_COMPLETE_KEY = '@hanibi:onboarding_complete';

export default function RootNavigator() {
  const hasOnboarded = useAppState((s) => s.hasOnboarded);
  const setHasOnboarded = useAppState((s) => s.setHasOnboarded);
  const [isLoading, setIsLoading] = useState(true);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      if (value === 'true') {
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

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
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
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="NotificationRequest" component={NotificationRequestScreen} />
          <Stack.Screen name="CautionSlides">
            {(props) => <PrecautionsScreen {...props} onComplete={completeOnboarding} />}
          </Stack.Screen>
        </>
      ) : null}
      <Stack.Screen name="MainTabs" component={MainTabs} />
      {/* 카메라 모달 그룹 (나중에 구현) */}
    </Stack.Navigator>
  );
}
