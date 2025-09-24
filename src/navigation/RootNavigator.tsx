import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useAuthStore } from '@/store/auth.store';

// Screen imports
import SignInScreen from '@/screens/Auth/SignInScreen';
import SignUpScreen from '@/screens/Auth/SignUpScreen';
import HomeScreen from '@/screens/Home/HomeScreen';
import DashboardScreen from '@/screens/Dashboard/DashboardScreen';
import WelcomeScreen from '@/screens/Onboarding/WelcomeScreen';
import NotifyPermissionScreen from '@/screens/Onboarding/NotifyPermissionScreen';
import CautionStep1Screen from '@/screens/Onboarding/CautionStep1Screen';
import CautionStep2Screen from '@/screens/Onboarding/CautionStep2Screen';
import CautionStep3Screen from '@/screens/Onboarding/CautionStep3Screen';
import CharacterCustomizeScreen from '@/screens/Onboarding/CharacterCustomizeScreen';
import ItemDetailScreen from '@/screens/Item/ItemDetailScreen';
import ItemNewScreen from '@/screens/Item/ItemNewScreen';
import ReportScreen from '@/screens/Report/ReportScreen';
import ModalScreen from '@/screens/Modal/ModalScreen';
import NotFoundScreen from '@/screens/NotFound/NotFoundScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName={isAuthenticated ? "Home" : "Welcome"}
      >
        {/* Auth Screens */}
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        
        {/* Onboarding Screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="NotifyPermission" component={NotifyPermissionScreen} />
        <Stack.Screen name="CautionStep1" component={CautionStep1Screen} />
        <Stack.Screen name="CautionStep2" component={CautionStep2Screen} />
        <Stack.Screen name="CautionStep3" component={CautionStep3Screen} />
        <Stack.Screen name="CharacterCustomize" component={CharacterCustomizeScreen} />
        
        {/* Main Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        
        {/* Feature Screens */}
        <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
        <Stack.Screen name="ItemNew" component={ItemNewScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        
        {/* Modal */}
        <Stack.Screen 
          name="Modal" 
          component={ModalScreen}
          options={{ presentation: 'modal' }}
        />
        
        {/* 404 */}
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
