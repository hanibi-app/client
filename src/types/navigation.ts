import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// 지표 타입 정의
export type Metric = 'temperature' | 'humidity' | 'metal' | 'voc';

// Root Stack Navigator - 인증 상태에 따른 분기
export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
};

// 인증/온보딩 스택
export type AuthStackParamList = {
  Login: undefined;
  OnboardingAlertRequest: undefined;
  OnboardingWarningPager: { initialIndex?: number } | undefined;
  OnboardingCharacter: undefined;
};

// 메인 탭 네비게이터
export type MainTabParamList = {
  HomeStack: undefined;
  ReportStack: undefined;
  SettingsStack: undefined;
};

// 홈 스택 네비게이터
export type HomeStackParamList = {
  Home: undefined;
  Alerts: undefined;
  Dashboard: undefined;
  MetricTabs: { initial?: Metric } | undefined; // Top Tabs 내장
  CameraScreen: { connected?: boolean } | undefined; // 전용 화면
};

// 리포트 스택 네비게이터
export type ReportStackParamList = {
  ReportIndex: undefined;
  ReportMetric: { metric: Metric };
};

// 설정 스택 네비게이터
export type SettingsStackParamList = {
  SettingsIndex: undefined;
  SettingsProfile: undefined;
  SettingsControl: undefined;
  SettingsDisplay: undefined;
  SettingsAlert: undefined;
  SettingsEtc: undefined;
};

// Props 타입 정의
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

export type ReportStackScreenProps<T extends keyof ReportStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ReportStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

export type SettingsStackScreenProps<T extends keyof SettingsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<SettingsStackParamList, T>,
  MainTabScreenProps<keyof MainTabParamList>
>;

// 딥링크 타입 정의
export type DeepLinkParams = {
  screen?: keyof RootStackParamList;
  params?: Record<string, unknown>;
};

// 라우트 검증 타입
export type RouteValidation = {
  isValid: boolean;
  error?: string;
  params?: Record<string, unknown>;
};
