/**
 * 기기 상태 관리 스토어
 * Zustand를 사용하여 현재 선택된 기기 ID를 전역으로 관리합니다.
 * 개발자 모드에서 디버그 기기를 선택하거나, 일반 사용자가 기기를 페어링할 때
 * 이 스토어를 통해 currentDeviceId를 설정합니다.
 */

import { create } from 'zustand';

/**
 * 디버그 기기 ID (기본값)
 * 개발자 모드에서 사용할 가짜 기기 ID입니다.
 */
export const DEBUG_DEVICE_ID = 'HANIBI-DEBUG-001';

interface DeviceState {
  /**
   * 현재 선택된 기기 ID
   * null이면 아직 기기가 선택되지 않은 상태입니다.
   */
  currentDeviceId: string | null;

  /**
   * 디버그 기기 ID
   * 개발자 모드에서 사용할 기기 ID입니다.
   */
  debugDeviceId: string;

  /**
   * 현재 기기 ID를 설정합니다.
   * @param id 설정할 기기 ID (null이면 초기화)
   */
  setCurrentDeviceId: (id: string | null) => void;

  /**
   * 디버그 기기를 현재 기기로 설정합니다.
   */
  setDebugDevice: () => void;

  /**
   * 현재 기기를 초기화합니다 (null로 설정).
   */
  clearCurrentDevice: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  currentDeviceId: null,
  debugDeviceId: DEBUG_DEVICE_ID,

  setCurrentDeviceId: (id: string | null) => {
    console.log('[DeviceStore] currentDeviceId 설정:', id);
    set({ currentDeviceId: id });
  },

  setDebugDevice: () => {
    console.log('[DeviceStore] 디버그 기기로 설정:', DEBUG_DEVICE_ID);
    set({ currentDeviceId: DEBUG_DEVICE_ID });
  },

  clearCurrentDevice: () => {
    console.log('[DeviceStore] currentDeviceId 초기화');
    set({ currentDeviceId: null });
  },
}));

/**
 * 현재 기기 ID를 가져오는 헬퍼 훅
 * currentDeviceId가 null이면 fallbackDeviceId를 반환합니다.
 * fallbackDeviceId도 없으면 빈 문자열을 반환합니다 (요청하지 않음).
 *
 * @param fallbackDeviceId currentDeviceId가 null일 때 사용할 기본 기기 ID
 * @returns 현재 기기 ID (없으면 빈 문자열)
 */
export function useCurrentDeviceId(fallbackDeviceId?: string): string {
  const currentDeviceId = useDeviceStore((state) => state.currentDeviceId);

  // currentDeviceId가 있으면 그대로 반환
  if (currentDeviceId) {
    return currentDeviceId;
  }

  // fallbackDeviceId가 제공되면 사용
  if (fallbackDeviceId) {
    return fallbackDeviceId;
  }

  // 둘 다 없으면 빈 문자열 반환 (요청하지 않음)
  return '';
}
