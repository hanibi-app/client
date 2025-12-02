import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HOME_STACK_ROUTES } from '@/constants/routes';
import CharacterCustomizeScreen from '@/screens/Home/CharacterCustomizeScreen';
import CharacterNameEditScreen from '@/screens/Home/CharacterNameEditScreen';
import HomeScreen from '@/screens/Home/HomeScreen';
import PairDeviceScreen from '@/screens/Home/PairDeviceScreen';

import { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={HOME_STACK_ROUTES.HOME}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={HOME_STACK_ROUTES.CHARACTER_CUSTOMIZE}
        component={CharacterCustomizeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={HOME_STACK_ROUTES.CHARACTER_NAME_EDIT}
        component={CharacterNameEditScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={HOME_STACK_ROUTES.PAIR_DEVICE}
        component={PairDeviceScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
