import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack Navigator 타입 정의
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  Modal: undefined;
  SampleKeyboard: undefined;
};

// Bottom Tab Navigator 타입 정의
export type TabsParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

// 네비게이션 프로퍼티 타입 정의
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: {
    navigate: (screen: T, params?: RootStackParamList[T]) => void;
    goBack: () => void;
    canGoBack: () => boolean;
  };
  route: {
    params: RootStackParamList[T];
  };
};

export type TabsScreenProps<T extends keyof TabsParamList> = {
  navigation: {
    navigate: (screen: T, params?: TabsParamList[T]) => void;
    goBack: () => void;
    canGoBack: () => boolean;
  };
  route: {
    params: TabsParamList[T];
  };
};

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
