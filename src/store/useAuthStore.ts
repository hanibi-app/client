import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isSignedIn: boolean;
  isOnboarded: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  } | null;
  setSignedIn: (signedIn: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isSignedIn: false,
      isOnboarded: false,
      user: null,
      setSignedIn: signedIn => set({ isSignedIn: signedIn }),
      setOnboarded: onboarded => set({ isOnboarded: onboarded }),
      setUser: user => set({ user }),
      logout: () => set({ isSignedIn: false, isOnboarded: false, user: null }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        isSignedIn: state.isSignedIn,
        isOnboarded: state.isOnboarded,
        user: state.user,
      }),
    },
  ),
);
