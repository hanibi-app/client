/**
 * 라우트 이름 상수 정의
 * 
 * React Navigation에서 사용하는 모든 라우트 이름을 중앙에서 관리합니다.
 * 문자열 하드코딩을 방지하고 타입 안정성을 보장합니다.
 */

// Root Navigator Routes
export const ROOT_ROUTES = {
  ONBOARDING: 'Onboarding',
  TABS: 'Tabs',
  MODAL: 'Modal',
} as const;

// Onboarding Navigator Routes
export const ONBOARDING_ROUTES = {
  LOGIN: 'Login',
  NOTIFICATION_REQUEST: 'NotificationRequest',
  PRECAUTIONS: 'Precautions',
} as const;

// Tabs Navigator Routes
export const TAB_ROUTES = {
  TAB_ONE: 'TabOne',
  TAB_TWO: 'TabTwo',
} as const;

// 모든 라우트를 하나로 통합 (타입 체크용)
export const ROUTES = {
  ...ROOT_ROUTES,
  ...ONBOARDING_ROUTES,
  ...TAB_ROUTES,
} as const;

// 타입 추출
export type RootRoute = typeof ROOT_ROUTES[keyof typeof ROOT_ROUTES];
export type OnboardingRoute = typeof ONBOARDING_ROUTES[keyof typeof ONBOARDING_ROUTES];
export type TabRoute = typeof TAB_ROUTES[keyof typeof TAB_ROUTES];
export type Route = typeof ROUTES[keyof typeof ROUTES];

