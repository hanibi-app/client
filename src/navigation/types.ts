export type RootStackParamList = {
  // Auth Stack
  SignIn: undefined;
  SignUp: undefined;

  // Main Stack
  Home: undefined;
  Dashboard: undefined;
  Search: undefined;
  Settings: undefined;

  // Onboarding
  Welcome: undefined;
  NotifyPermission: undefined;
  CautionStep1: undefined;
  CautionStep2: undefined;
  CautionStep3: undefined;
  CharacterCustomize: undefined;

  // Features
  ItemDetail: { id: string };
  ItemNew: undefined;
  Report: undefined;

  // Modal
  Modal: undefined;

  // 404
  NotFound: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {

    interface RootParamList extends RootStackParamList {}
  }
}
