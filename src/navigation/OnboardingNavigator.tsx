import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ONBOARDING_ROUTES } from '@/constants/routes';
import LoginScreen from '@/screens/LoginScreen';
import NotificationRequestScreen from '@/screens/NotificationRequestScreen';
import PrecautionsScreen from '@/screens/PrecautionsScreen';

export type OnboardingStackParamList = {
  [ONBOARDING_ROUTES.LOGIN]: undefined;
  [ONBOARDING_ROUTES.NOTIFICATION_REQUEST]: undefined;
  [ONBOARDING_ROUTES.PRECAUTIONS]: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export type OnboardingNavigatorProps = {
  onComplete?: () => void;
};

export default function OnboardingNavigator({ onComplete }: OnboardingNavigatorProps) {
  const handleComplete = () => {
    // 온보딩 완료 후 홈으로 이동
    console.log('온보딩 완료 - 홈으로 이동');
    onComplete?.();
  };

  const handleEnableNotifications = () => {
    // 알림 활성화 후 주의사항 화면으로 이동 (이미 NotificationRequestScreen에서 처리)
    console.log('알림 활성화');
  };

  const handleSkip = () => {
    // 알림 건너뛰기 후 메인 화면으로 이동
    console.log('알림 건너뛰기');
    handleComplete();
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ONBOARDING_ROUTES.LOGIN}
    >
      <Stack.Screen name={ONBOARDING_ROUTES.LOGIN}>
        {(props: NativeStackScreenProps<OnboardingStackParamList, typeof ONBOARDING_ROUTES.LOGIN>) => (
          <LoginScreen
            {...props}
            onKakaoLogin={() => {
              props.navigation.navigate(ONBOARDING_ROUTES.NOTIFICATION_REQUEST);
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={ONBOARDING_ROUTES.NOTIFICATION_REQUEST}>
        {(props) => (
          <NotificationRequestScreen
            {...props}
            navigation={props.navigation}
            onEnableNotifications={handleEnableNotifications}
            onSkip={handleSkip}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name={ONBOARDING_ROUTES.PRECAUTIONS}>
        {(props) => (
          <PrecautionsScreen
            {...props}
            onComplete={handleComplete}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

