export type RootStackParamList = {
  Login: undefined;
  NotificationRequest: undefined;
  CautionSlides: undefined;
  MainTabs: undefined;
  CameraPermission: undefined;
  CameraCapture: undefined;
  CameraPreview: { uri: string };
};

export type TabParamList = {
  HomeTab: undefined;
  DashboardTab: undefined;
  ReportsTab: undefined;
  SettingsTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  CharacterCustomize: undefined;
};

export type MetricType = 'temp' | 'humidity' | 'moisture' | 'voc';
