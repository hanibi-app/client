import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CharacterCustomizeScreen from '@/screens/Home/CharacterCustomizeScreen';
import HomeScreen from '@/screens/Home/HomeScreen';

import { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="CharacterCustomize"
        component={CharacterCustomizeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
