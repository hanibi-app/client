import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsAlertScreen from '@/screens/settings/SettingsAlertScreen';
import SettingsControlScreen from '@/screens/settings/SettingsControlScreen';
import SettingsDisplayScreen from '@/screens/settings/SettingsDisplayScreen';
import SettingsEtcScreen from '@/screens/settings/SettingsEtcScreen';
import SettingsIndexScreen from '@/screens/settings/SettingsIndexScreen';
import SettingsProfileScreen from '@/screens/settings/SettingsProfileScreen';
import { SettingsStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="SettingsIndex"
        component={SettingsIndexScreen}
        options={{
          title: '설정',
          headerShown: false, // 설정 메인 화면은 헤더 숨김
        }}
      />
      <Stack.Screen
        name="SettingsProfile"
        component={SettingsProfileScreen}
        options={{
          title: '프로필 및 계정',
          headerBackTitle: '설정',
        }}
      />
      <Stack.Screen
        name="SettingsControl"
        component={SettingsControlScreen}
        options={{
          title: '캐릭터 제어',
          headerBackTitle: '설정',
        }}
      />
      <Stack.Screen
        name="SettingsDisplay"
        component={SettingsDisplayScreen}
        options={{
          title: '대시보드 표시',
          headerBackTitle: '설정',
        }}
      />
      <Stack.Screen
        name="SettingsAlert"
        component={SettingsAlertScreen}
        options={{
          title: '알림 설정',
          headerBackTitle: '설정',
        }}
      />
      <Stack.Screen
        name="SettingsEtc"
        component={SettingsEtcScreen}
        options={{
          title: '기타',
          headerBackTitle: '설정',
        }}
      />
    </Stack.Navigator>
  );
}
