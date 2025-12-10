import React from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MAIN_TAB_ROUTES } from '@/constants/routes';
import SettingsScreen from '@/screens/Settings/SettingsScreen';
import { colors } from '@/theme/Colors';

import DashboardStack from './DashboardStack';
import HomeStack from './HomeStack';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.white,
          // 위쪽 그림자 효과
          shadowColor: 'rgba(0, 0, 0, 0.15)',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8, // Android
        },
      }}
    >
      <Tab.Screen
        name={MAIN_TAB_ROUTES.HOME_TAB}
        component={HomeStack}
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name={MAIN_TAB_ROUTES.DASHBOARD_TAB}
        component={DashboardStack}
        options={{
          title: '대시보드',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={MAIN_TAB_ROUTES.SETTINGS_TAB}
        component={SettingsScreen}
        options={{
          title: '설정',
          tabBarIcon: ({ color, size }) => <FontAwesome name="cog" size={size} color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
