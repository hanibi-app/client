import type { NavigatorScreenParams } from '@react-navigation/native';

import {
  DASHBOARD_STACK_ROUTES,
  HOME_STACK_ROUTES,
  MAIN_TAB_ROUTES,
  ROOT_ROUTES,
} from '@/constants/routes';

/**
 * 네비게이션 타입 정의
 *
 * 모든 ParamList는 routes.ts의 상수를 기반으로 정의되어
 * 타입 안정성과 일관성을 보장합니다.
 */

// Root Navigator ParamList (최상위 네비게이터)
export type RootStackParamList = {
  [ROOT_ROUTES.LOGIN]: undefined;
  [ROOT_ROUTES.EMAIL_LOGIN]: undefined;
  [ROOT_ROUTES.REGISTER]: undefined;
  [ROOT_ROUTES.NOTIFICATION_REQUEST]: undefined;
  [ROOT_ROUTES.CAUTION_SLIDES]: undefined;
  [ROOT_ROUTES.CHARACTER_CUSTOMIZE]: undefined;
  [ROOT_ROUTES.MAIN_TABS]: undefined;
  [ROOT_ROUTES.CAMERA_PERMISSION]: undefined;
  [ROOT_ROUTES.CAMERA_CAPTURE]: undefined;
  [ROOT_ROUTES.CAMERA_PREVIEW]: { uri: string };
  [ROOT_ROUTES.PROFILE]: undefined;
  [ROOT_ROUTES.DEVICE_PAIRING_MODAL]: undefined;
  [ROOT_ROUTES.DEVICE_DETAIL]: { deviceId: string };
  [ROOT_ROUTES.DEVELOPER_MODE]: undefined;
  [ROOT_ROUTES.CAMERA_PREVIEW_DEBUG]: undefined;
};

// Main Tabs ParamList (하단 탭 네비게이터)
export type TabParamList = {
  [MAIN_TAB_ROUTES.HOME_TAB]: undefined;
  [MAIN_TAB_ROUTES.DASHBOARD_TAB]: NavigatorScreenParams<DashboardStackParamList> | undefined;
  [MAIN_TAB_ROUTES.SETTINGS_TAB]: undefined;
};

// Home Stack ParamList (홈 스택 네비게이터)
export type HomeStackParamList = {
  [HOME_STACK_ROUTES.HOME]: undefined;
  [HOME_STACK_ROUTES.CHARACTER_CUSTOMIZE]: undefined;
  [HOME_STACK_ROUTES.CHARACTER_NAME_EDIT]: undefined;
  [HOME_STACK_ROUTES.PAIR_DEVICE]: undefined;
  [HOME_STACK_ROUTES.RANKING]: undefined;
};

// Dashboard Stack ParamList (대시보드 스택 네비게이터)
export type DashboardStackParamList = {
  [DASHBOARD_STACK_ROUTES.DASHBOARD]: undefined;
  [DASHBOARD_STACK_ROUTES.REPORTS]: undefined;
  [DASHBOARD_STACK_ROUTES.ECO_SCORE]: undefined;
};

// 도메인 타입
export type MetricType = 'temp' | 'humidity' | 'moisture' | 'voc';
