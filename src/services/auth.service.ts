import { api } from '@/api/client';
import { useAuthStore } from '@/store/auth.store';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export async function signInFlow(payload: SignInPayload): Promise<AuthResponse['user']> {
  const { data } = await api.post<AuthResponse>('/auth/sign-in', payload);
  useAuthStore.getState().setToken(data.token);
  
  // 프로필 정보 저장
  useAuthStore.getState().setMe(data.user);
  
  return data.user;
}

export async function signUpFlow(payload: SignUpPayload): Promise<AuthResponse['user']> {
  const { data } = await api.post<AuthResponse>('/auth/sign-up', payload);
  useAuthStore.getState().setToken(data.token);
  useAuthStore.getState().setMe(data.user);
  
  return data.user;
}

export async function signOutFlow(): Promise<void> {
  try {
    await api.post('/auth/sign-out');
  } catch (error) {
    console.warn('Sign out API call failed:', error);
  } finally {
    useAuthStore.getState().signOut();
  }
}
