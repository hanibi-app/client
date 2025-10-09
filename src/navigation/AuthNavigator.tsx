import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@/screens/auth/LoginScreen';
import OnboardingAlertRequestScreen from '@/screens/auth/OnboardingAlertRequestScreen';
import OnboardingCharacterScreen from '@/screens/auth/OnboardingCharacterScreen';
import OnboardingWarningPagerScreen from '@/screens/auth/OnboardingWarningPagerScreen';
import { AuthStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: '한니비',
          headerShown: false, // 로그인 화면은 헤더 숨김
        }}
      />
      <Stack.Screen
        name="OnboardingAlertRequest"
        component={OnboardingAlertRequestScreen}
        options={{
          title: '알림 권한',
          headerBackTitle: '이전',
        }}
      />
      <Stack.Screen
        name="OnboardingWarningPager"
        component={OnboardingWarningPagerScreen}
        options={{
          title: '주의사항',
          headerBackTitle: '이전',
        }}
      />
      <Stack.Screen
        name="OnboardingCharacter"
        component={OnboardingCharacterScreen}
        options={{
          title: '캐릭터 꾸미기',
          headerBackTitle: '이전',
        }}
      />
    </Stack.Navigator>
  );
}
