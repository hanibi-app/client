import { create } from 'zustand';

type AppState = {
  hasOnboarded: boolean;
  notificationsEnabled: boolean;
  // 홈 상태 (보드 하단 8개 카드 표현용)
  hungryLevel: 'low' | 'high';
  humidityLevel: 'low' | 'high';
  smellIndex: number; // 0~100
  setHasOnboarded(b: boolean): void;
  setNotificationsEnabled(b: boolean): void;
  setHungryLevel(v: 'low' | 'high'): void;
  setHumidityLevel(v: 'low' | 'high'): void;
  setSmellIndex(n: number): void;
};

export const useAppState = create<AppState>((set) => ({
  hasOnboarded: false,
  notificationsEnabled: false,
  hungryLevel: 'low',
  humidityLevel: 'high',
  smellIndex: 12,
  setHasOnboarded: (b) => set({ hasOnboarded: b }),
  setNotificationsEnabled: (b) => set({ notificationsEnabled: b }),
  setHungryLevel: (v) => set({ hungryLevel: v }),
  setHumidityLevel: (v) => set({ humidityLevel: v }),
  setSmellIndex: (n) => set({ smellIndex: n }),
}));
