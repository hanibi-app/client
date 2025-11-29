import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DASHBOARD_STACK_ROUTES } from '@/constants/routes';
import DashboardScreen from '@/screens/Dashboard/DashboardScreen';
import ReportsScreen from '@/screens/Reports/ReportsScreen';

import { DashboardStackParamList } from './types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export default function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={DASHBOARD_STACK_ROUTES.DASHBOARD}
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={DASHBOARD_STACK_ROUTES.REPORTS}
        component={ReportsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
