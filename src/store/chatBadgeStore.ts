/**
 * 채팅 뱃지 상태 관리 스토어
 * Zustand를 사용하여 채팅 알림 상태를 전역으로 관리합니다.
 * 추후 서버에서 unreadCount를 내려주는 GET API가 추가되면 그 값으로 교체할 수 있도록
 * 느슨한 구조로 설계되었습니다.
 */

import { create } from 'zustand';

interface ChatBadgeState {
  /**
   * 기기별 새 채팅 알림 상태
   * deviceId를 키로 하여 해당 기기에 새 메시지가 있는지 여부를 저장합니다.
   * 추후 unreadCount로 확장 가능하도록 구조를 유연하게 설계했습니다.
   */
  hasNewChatForDevice: Record<string, boolean>;

  /**
   * 특정 기기의 새 채팅 알림 상태를 설정합니다.
   * @param deviceId 기기 ID
   * @param hasNewChat 새 메시지 여부
   */
  setHasNewChat: (deviceId: string, hasNewChat: boolean) => void;

  /**
   * 특정 기기의 새 채팅 알림 상태를 가져옵니다.
   * @param deviceId 기기 ID
   * @returns 새 메시지 여부 (기본값: false)
   */
  getHasNewChat: (deviceId: string) => boolean;

  /**
   * 모든 기기의 새 채팅 알림 상태를 초기화합니다.
   */
  clearAllBadges: () => void;

  /**
   * 특정 기기의 새 채팅 알림 상태를 초기화합니다.
   * @param deviceId 기기 ID
   */
  clearBadge: (deviceId: string) => void;
}

export const useChatBadgeStore = create<ChatBadgeState>((set, get) => ({
  hasNewChatForDevice: {},

  setHasNewChat: (deviceId: string, hasNewChat: boolean) => {
    console.log(`[ChatBadgeStore] ${deviceId}의 새 채팅 상태 설정:`, hasNewChat);
    set((state) => ({
      hasNewChatForDevice: {
        ...state.hasNewChatForDevice,
        [deviceId]: hasNewChat,
      },
    }));
  },

  getHasNewChat: (deviceId: string) => {
    return get().hasNewChatForDevice[deviceId] ?? false;
  },

  clearAllBadges: () => {
    console.log('[ChatBadgeStore] 모든 뱃지 초기화');
    set({ hasNewChatForDevice: {} });
  },

  clearBadge: (deviceId: string) => {
    console.log(`[ChatBadgeStore] ${deviceId}의 뱃지 초기화`);
    set((state) => {
      const newState = { ...state.hasNewChatForDevice };
      delete newState[deviceId];
      return { hasNewChatForDevice: newState };
    });
  },
}));
