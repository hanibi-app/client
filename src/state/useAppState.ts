import { create } from 'zustand';

type AppState = {
  hasOnboarded: boolean;
  notificationsEnabled: boolean;
  displayCharacter: boolean;
  useMonochromeDisplay: boolean;
  dialogueAlertsEnabled: boolean;
  cleaningAlertsEnabled: boolean;
  sensorAlertsEnabled: boolean;
  characterName: string;
  // 홈 상태 (보드 하단 8개 카드 표현용)
  hungryLevel: 'low' | 'high';
  humidityLevel: 'low' | 'high';
  smellIndex: number; // 0~100
  setHasOnboarded(b: boolean): void;
  setNotificationsEnabled(b: boolean): void;
  setDisplayCharacter(b: boolean): void;
  setUseMonochromeDisplay(b: boolean): void;
  setDialogueAlertsEnabled(b: boolean): void;
  setCleaningAlertsEnabled(b: boolean): void;
  setSensorAlertsEnabled(b: boolean): void;
  setCharacterName(name: string): void;
  setHungryLevel(v: 'low' | 'high'): void;
  setHumidityLevel(v: 'low' | 'high'): void;
  setSmellIndex(n: number): void;
};

export const useAppState = create<AppState>((set) => ({
  hasOnboarded: false,
  notificationsEnabled: false,
  displayCharacter: true,
  useMonochromeDisplay: false,
  dialogueAlertsEnabled: true,
  cleaningAlertsEnabled: true,
  sensorAlertsEnabled: true,
  characterName: '한니비',
  hungryLevel: 'low',
  humidityLevel: 'high',
  smellIndex: 12,
  setHasOnboarded: (b) => set({ hasOnboarded: b }),
  setNotificationsEnabled: (b) => set({ notificationsEnabled: b }),
  setDisplayCharacter: (b) => set({ displayCharacter: b }),
  setUseMonochromeDisplay: (b) => set({ useMonochromeDisplay: b }),
  setDialogueAlertsEnabled: (b) => set({ dialogueAlertsEnabled: b }),
  setCleaningAlertsEnabled: (b) => set({ cleaningAlertsEnabled: b }),
  setSensorAlertsEnabled: (b) => set({ sensorAlertsEnabled: b }),
  setCharacterName: (name) => set({ characterName: name }),
  setHungryLevel: (v) => set({ hungryLevel: v }),
  setHumidityLevel: (v) => set({ humidityLevel: v }),
  setSmellIndex: (n) => set({ smellIndex: n }),
}));
