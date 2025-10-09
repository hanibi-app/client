import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import { MainTabParamList } from '@/types/navigation';

import HomeNavigator from './HomeNavigator';
import ReportNavigator from './ReportNavigator';
import SettingsNavigator from './SettingsNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

// 임시 아이콘 컴포넌트 (실제로는 react-native-vector-icons 사용)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <View style={[styles.iconContainer, focused && styles.focusedIcon]}>
    <Text style={[styles.iconText, focused && styles.focusedText]}>{name}</Text>
  </View>
);

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeNavigator}
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => <TabIcon name="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ReportStack"
        component={ReportNavigator}
        options={{
          title: '리포트',
          tabBarIcon: ({ focused }) => <TabIcon name="📊" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsNavigator}
        options={{
          title: '설정',
          tabBarIcon: ({ focused }) => <TabIcon name="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  focusedIcon: {
    backgroundColor: '#007AFF20',
    borderRadius: 12,
  },
  focusedText: {
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  iconText: {
    fontSize: 16,
  },
});
