import { Linking } from 'react-native';

import { DeepLinkParams, RouteValidation } from '@/types/navigation';

/**
 * 딥링크 URL을 파싱하여 라우트 파라미터를 추출합니다.
 * @param url - 딥링크 URL
 * @returns 파싱된 딥링크 파라미터
 */
export function parseDeepLink(url: string): DeepLinkParams {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);

    // URL 스키마에 따른 라우트 매핑
    const routeMap: Record<string, string> = {
      tabs: 'Tabs',
      modal: 'Modal',
      keyboard: 'SampleKeyboard',
    };

    const screen = pathSegments[0] ? routeMap[pathSegments[0]] : undefined;
    const params = Object.fromEntries(urlObj.searchParams.entries());

    return {
      screen: screen as keyof import('@/types/navigation').RootStackParamList | undefined,
      params: Object.keys(params).length > 0 ? params : undefined,
    };
  } catch (error) {
    console.warn('Failed to parse deep link:', error);
    return {};
  }
}

/**
 * 라우트 파라미터를 검증합니다.
 * @param route - 검증할 라우트 이름
 * @param params - 검증할 파라미터
 * @returns 검증 결과
 */
export function validateRoute(route: string, params?: Record<string, unknown>): RouteValidation {
  const validRoutes = ['Tabs', 'Modal', 'SampleKeyboard', 'TabOne', 'TabTwo'];

  if (!validRoutes.includes(route)) {
    return {
      isValid: false,
      error: `Invalid route: ${route}`,
    };
  }

  // 특정 라우트별 파라미터 검증 로직
  if (route === 'Modal' && params) {
    // Modal은 파라미터가 없어야 함
    if (Object.keys(params).length > 0) {
      return {
        isValid: false,
        error: 'Modal route does not accept parameters',
      };
    }
  }

  return {
    isValid: true,
    params,
  };
}

/**
 * 딥링크를 처리합니다.
 * @param url - 딥링크 URL
 * @param navigation - 네비게이션 객체
 */
export function handleDeepLink(
  url: string,
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  },
) {
  const deepLinkParams = parseDeepLink(url);

  if (!deepLinkParams.screen) {
    console.warn('No valid screen found in deep link');
    return;
  }

  const validation = validateRoute(deepLinkParams.screen, deepLinkParams.params);

  if (!validation.isValid) {
    console.error('Deep link validation failed:', validation.error);
    return;
  }

  // 네비게이션 실행
  navigation.navigate(deepLinkParams.screen, deepLinkParams.params);
}

/**
 * 외부 링크를 열기 위한 헬퍼 함수
 * @param url - 열 URL
 */
export async function openExternalLink(url: string): Promise<void> {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn(`Cannot open URL: ${url}`);
    }
  } catch (error) {
    console.error('Failed to open external link:', error);
  }
}

/**
 * 앱 내부 링크를 생성합니다.
 * @param screen - 대상 화면
 * @param params - 라우트 파라미터
 * @returns 생성된 딥링크 URL
 */
export function createInternalLink(screen: string, params?: Record<string, unknown>): string {
  const baseUrl = 'hanibi://';
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `${baseUrl}${screen.toLowerCase()}${queryString}`;
}

/**
 * 네비게이션 스택을 리셋합니다.
 * @param navigation - 네비게이션 객체
 * @param screenName - 리셋할 화면 이름
 * @param params - 화면 파라미터
 */
export function resetNavigationStack(
  navigation: {
    reset: (config: { index: number; routes: Array<{ name: string; params?: unknown }> }) => void;
  },
  screenName: string,
  params?: unknown,
) {
  navigation.reset({
    index: 0,
    routes: [{ name: screenName, params }],
  });
}

/**
 * 네비게이션 히스토리를 확인합니다.
 * @param navigation - 네비게이션 객체
 * @returns 히스토리 정보
 */
export function getNavigationHistory(navigation: {
  canGoBack: () => boolean;
  getState: () => unknown;
}) {
  return {
    canGoBack: navigation.canGoBack(),
    state: navigation.getState(),
  };
}
