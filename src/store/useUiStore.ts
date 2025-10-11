import { create } from 'zustand';

interface UiState {
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  notifications: {
    enabled: boolean;
    temperature: boolean;
    humidity: boolean;
    metal: boolean;
    voc: boolean;
  };
  dashboard: {
    showTemperature: boolean;
    showHumidity: boolean;
    showMetal: boolean;
    showVoc: boolean;
  };
  setTheme: (theme: UiState['theme']) => void;
  setLanguage: (language: UiState['language']) => void;
  setNotification: (key: keyof UiState['notifications'], value: boolean) => void;
  setDashboard: (key: keyof UiState['dashboard'], value: boolean) => void;
}

export const useUiStore = create<UiState>(set => ({
  theme: 'system',
  language: 'ko',
  notifications: {
    enabled: true,
    temperature: true,
    humidity: true,
    metal: true,
    voc: true,
  },
  dashboard: {
    showTemperature: true,
    showHumidity: true,
    showMetal: true,
    showVoc: true,
  },
  setTheme: theme => set({ theme }),
  setLanguage: language => set({ language }),
  setNotification: (key, value) =>
    set(state => ({
      notifications: { ...state.notifications, [key]: value },
    })),
  setDashboard: (key, value) =>
    set(state => ({
      dashboard: { ...state.dashboard, [key]: value },
    })),
}));
