import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useAuthStore } from '@/store/auth.store';

// Screen imports will be added during migration
const SignInScreen = () => require('@/screens/Auth/SignInScreen').default;
const SignUpScreen = () => require('@/screens/Auth/SignUpScreen').default;
const HomeScreen = () => require('@/screens/Home/HomeScreen').default;
const DashboardScreen = () => require('@/screens/Dashboard/DashboardScreen').default;
const WelcomeScreen = () => require('@/screens/Onboarding/WelcomeScreen').default;
const NotifyPermissionScreen = () => require('@/screens/Onboarding/NotifyPermissionScreen').default;
const CautionStep1Screen = () => require('@/screens/Onboarding/CautionStep1Screen').default;
const CautionStep2Screen = () => require('@/screens/Onboarding/CautionStep2Screen').default;
const CautionStep3Screen = () => require('@/screens/Onboarding/CautionStep3Screen').default;
const CharacterCustomizeScreen = () => require('@/screens/Onboarding/CharacterCustomizeScreen').default;
const ItemDetailScreen = () => require('@/screens/Item/ItemDetailScreen').default;
const ItemNewScreen = () => require('@/screens/Item/ItemNewScreen').default;
const ReportScreen = () => require('@/screens/Report/ReportScreen').default;
const ModalScreen = () => require('@/screens/Modal/ModalScreen').default;
const NotFoundScreen = () => require('@/screens/NotFound/NotFoundScreen').default;

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
