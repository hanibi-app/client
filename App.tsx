import { useEffect, useRef } from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from '@/components/useColorScheme';
import RootNavigator from '@/navigation/RootNavigator';
import { RootStackParamList } from '@/navigation/types';

SplashScreen.preventAutoHideAsync();

// QueryClient는 컴포넌트 밖에 생성하여 리렌더링 시 캐시가 초기화되지 않도록 함
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const colorScheme = useColorScheme();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  const [loaded, error] = useFonts({
    // Use a relative path so Metro resolves without alias configuration
    SpaceMono: require('./src/assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer
        ref={navigationRef}
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <RootNavigator navigationRef={navigationRef} />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
