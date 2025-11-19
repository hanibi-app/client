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

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ONBOARDING_ROUTES.LOGIN}
    >
      <Stack.Screen name={ONBOARDING_ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen
        name={ONBOARDING_ROUTES.NOTIFICATION_REQUEST}
        component={NotificationRequestScreen}
      />
      <Stack.Screen name={ONBOARDING_ROUTES.PRECAUTIONS}>
        {(
          props: NativeStackScreenProps<
            OnboardingStackParamList,
            typeof ONBOARDING_ROUTES.PRECAUTIONS
          >,
        ) => (
          <PrecautionsScreen
            {...(props as unknown as Parameters<typeof PrecautionsScreen>[0])}
            onComplete={handleComplete}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
