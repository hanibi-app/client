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

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useColorScheme } from '@/components/useColorScheme';
import { setRootNavigationRef } from '@/navigation/navigationRef';
import RootNavigator from '@/navigation/RootNavigator';
import { RootStackParamList } from '@/navigation/types';
import { useLoadingStore } from '@/store/loadingStore';

SplashScreen.preventAutoHideAsync();

// QueryClient는 컴포넌트 밖에 생성하여 리렌더링 시 캐시가 초기화되지 않도록 함
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // 포커스 시 자동 refetch 방지 (429 에러 방지)
      staleTime: 60 * 1000, // 기본 60초간 캐시 유지 (429 에러 방지)
      refetchOnMount: false, // 마운트 시 자동 refetch 방지 (429 에러 방지)
      refetchOnReconnect: false, // 재연결 시 자동 refetch 방지 (429 에러 방지)
    },
  },
});

export default function App() {
  const colorScheme = useColorScheme();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const { isLoading, message } = useLoadingStore();

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

  // 루트 네비게이션 참조를 전역으로 설정
  useEffect(() => {
    if (navigationRef.current) {
      setRootNavigationRef(navigationRef.current);
    }
    return () => {
      setRootNavigationRef(null);
    };
  }, []);

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
      {/* 전역 로딩 오버레이 */}
      {isLoading && <LoadingSpinner fullScreen message={message} />}
    </QueryClientProvider>
  );
}
