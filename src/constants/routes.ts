/**
 * 라우트 이름 상수 정의
 *
 * React Navigation에서 사용하는 모든 라우트 이름을 중앙에서 관리합니다.
 * 문자열 하드코딩을 방지하고 타입 안정성을 보장합니다.
 *
 * 구조:
 * - ROOT_ROUTES: RootNavigator에서 사용하는 최상위 라우트
 * - ONBOARDING_ROUTES: 온보딩 플로우 관련 라우트
 * - MAIN_TAB_ROUTES: MainTabs에서 사용하는 탭 라우트
 * - HOME_STACK_ROUTES: HomeStack에서 사용하는 라우트
 * - DASHBOARD_STACK_ROUTES: DashboardStack에서 사용하는 라우트
 */

// Root Navigator Routes (최상위 네비게이터)
export const ROOT_ROUTES = {
  LOGIN: 'Login',
  EMAIL_LOGIN: 'EmailLogin',
  REGISTER: 'Register',
  NOTIFICATION_REQUEST: 'NotificationRequest',
  CAUTION_SLIDES: 'CautionSlides',
  CHARACTER_CUSTOMIZE: 'CharacterCustomize',
  MAIN_TABS: 'MainTabs',
  CAMERA_PERMISSION: 'CameraPermission',
  CAMERA_CAPTURE: 'CameraCapture',
  CAMERA_PREVIEW: 'CameraPreview',
  PROFILE: 'Profile',
  DEVICE_PAIRING_MODAL: 'DevicePairingModal',
  DEVICE_DETAIL: 'DeviceDetail',
  DEVELOPER_MODE: 'DeveloperMode',
  CAMERA_PREVIEW_DEBUG: 'CameraPreviewDebug',
} as const;

// Onboarding Navigator Routes (온보딩 플로우 - 현재는 RootNavigator에 통합됨)
export const ONBOARDING_ROUTES = {
  LOGIN: 'Login',
  NOTIFICATION_REQUEST: 'NotificationRequest',
  CAUTION_SLIDES: 'CautionSlides',
  CHARACTER_CUSTOMIZE: 'CharacterCustomize',
} as const;

// Main Tabs Routes (하단 탭 네비게이터)
export const MAIN_TAB_ROUTES = {
  HOME_TAB: 'HomeTab',
  DASHBOARD_TAB: 'DashboardTab',
  SETTINGS_TAB: 'SettingsTab',
} as const;

// Home Stack Routes (홈 스택 네비게이터)
export const HOME_STACK_ROUTES = {
  HOME: 'Home',
  CHARACTER_CUSTOMIZE: 'CharacterCustomize',
  CHARACTER_NAME_EDIT: 'CharacterNameEdit',
  PAIR_DEVICE: 'PairDevice',
} as const;

// Dashboard Stack Routes (대시보드 스택 네비게이터)
export const DASHBOARD_STACK_ROUTES = {
  DASHBOARD: 'Dashboard',
  REPORTS: 'Reports',
  ECO_SCORE: 'EcoScore',
} as const;

// 모든 라우트를 하나로 통합 (타입 체크용)
export const ROUTES = {
  ...ROOT_ROUTES,
  ...ONBOARDING_ROUTES,
  ...MAIN_TAB_ROUTES,
  ...HOME_STACK_ROUTES,
  ...DASHBOARD_STACK_ROUTES,
} as const;

// 타입 추출
export type RootRoute = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];
export type OnboardingRoute = (typeof ONBOARDING_ROUTES)[keyof typeof ONBOARDING_ROUTES];
export type MainTabRoute = (typeof MAIN_TAB_ROUTES)[keyof typeof MAIN_TAB_ROUTES];
export type HomeStackRoute = (typeof HOME_STACK_ROUTES)[keyof typeof HOME_STACK_ROUTES];
export type DashboardStackRoute =
  (typeof DASHBOARD_STACK_ROUTES)[keyof typeof DASHBOARD_STACK_ROUTES];
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
