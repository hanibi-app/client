import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token?: string;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token?: string) => void;
  setMe: (user: User | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: undefined,
      user: null,
      isAuthenticated: false,

      setToken: (token) =>
        set({
          token,
          isAuthenticated: Boolean(token),
        }),

      setMe: (user) =>
        set({
          user,
          isAuthenticated: Boolean(get().token && user),
        }),

      signOut: () =>
        set({
          token: undefined,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (_key) => {
          // React Native AsyncStorage will be configured later
          return Promise.resolve(null);
        },
        setItem: (_key, _value) => {
          return Promise.resolve();
        },
        removeItem: (_key) => {
          return Promise.resolve();
        },
      })),
    }
  )
);
