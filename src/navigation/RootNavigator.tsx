import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROOT_ROUTES } from '@/constants/routes';
import OnboardingNavigator from '@/navigation/OnboardingNavigator';
import TabsNavigator from '@/navigation/TabsNavigator';
import ModalScreen from '@/screens/ModalScreen';

export type RootStackParamList = {
  [ROOT_ROUTES.ONBOARDING]: undefined;
  [ROOT_ROUTES.TABS]: undefined;
  [ROOT_ROUTES.MODAL]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ONBOARDING_COMPLETE_KEY = '@hanibi:onboarding_complete';

export default function RootNavigator() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      setIsOnboardingComplete(value === 'true');
    } catch (error) {
      console.error('온보딩 상태 확인 오류:', error);
      setIsOnboardingComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      setIsOnboardingComplete(true);
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
      {!isOnboardingComplete ? (
        <Stack.Screen name={ROOT_ROUTES.ONBOARDING}>
          {(props) => (
            <OnboardingNavigator {...props} onComplete={completeOnboarding} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name={ROOT_ROUTES.TABS} component={TabsNavigator} />
          <Stack.Screen
            name={ROOT_ROUTES.MODAL}
            component={ModalScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
