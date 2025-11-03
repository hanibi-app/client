import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ONBOARDING_ROUTES } from '@/constants/routes';
import LoginScreen from '@/screens/LoginScreen';
import NotificationRequestScreen from '@/screens/NotificationRequestScreen';

export type OnboardingStackParamList = {
  [ONBOARDING_ROUTES.LOGIN]: undefined;
  [ONBOARDING_ROUTES.NOTIFICATION_REQUEST]: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export type OnboardingNavigatorProps = {
  onComplete?: () => void;
};

export default function OnboardingNavigator({ onComplete }: OnboardingNavigatorProps) {
  const navigation = useNavigation<any>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleKakaoLogin = () => {
    // 로그인 성공 후 다음 화면으로 이동
    setIsLoggedIn(true);
    navigation.navigate(ONBOARDING_ROUTES.NOTIFICATION_REQUEST as never);
  };

  const handleEnableNotifications = () => {
    // 알림 활성화 후 메인 화면으로 이동
    console.log('알림 활성화 완료');
    onComplete?.();
  };

  const handleSkip = () => {
    // 알림 건너뛰기 후 메인 화면으로 이동
    console.log('알림 건너뛰기');
    onComplete?.();
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ONBOARDING_ROUTES.LOGIN}
    >
      <Stack.Screen name={ONBOARDING_ROUTES.LOGIN}>
        {(props) => <LoginScreen {...props} onKakaoLogin={handleKakaoLogin} />}
      </Stack.Screen>
      <Stack.Screen name={ONBOARDING_ROUTES.NOTIFICATION_REQUEST}>
        {(props) => (
          <NotificationRequestScreen
            {...props}
            onEnableNotifications={handleEnableNotifications}
            onSkip={handleSkip}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

