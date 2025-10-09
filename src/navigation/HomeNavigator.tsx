import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AlertsScreen from '@/screens/home/AlertsScreen';
import CameraScreen from '@/screens/home/CameraScreen';
import DashboardScreen from '@/screens/home/DashboardScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import MetricTabsScreen from '@/screens/home/MetricTabsScreen';
import { HomeStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          headerShown: false, // 홈 화면은 헤더 숨김 (캐릭터가 메인)
        }}
      />
      <Stack.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          title: '알림 내역',
          headerBackTitle: '홈',
        }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: '대시보드',
          headerBackTitle: '홈',
        }}
      />
      <Stack.Screen
        name="MetricTabs"
        component={MetricTabsScreen}
        options={{
          title: '지표 상세',
          headerBackTitle: '대시보드',
        }}
      />
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          title: '카메라',
          headerBackTitle: '홈',
        }}
      />
    </Stack.Navigator>
  );
}
