import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '@/screens/Dashboard/DashboardScreen';
import ReportsScreen from '@/screens/Reports/ReportsScreen';

import { DashboardStackParamList } from './types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export default function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Reports" component={ReportsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
