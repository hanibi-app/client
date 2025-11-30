/**
 * 공통 HTTP 클라이언트
 * Axios 인스턴스를 생성하고, 요청/응답 인터셉터를 설정하여
 * 인증 토큰 자동 추가 및 401 에러 처리 등을 담당합니다.
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { useAuthStore } from '../store/authStore';

// 환경 변수에서 API baseURL 가져오기
const API_BASE_URL = process.env.EXPO_PUBLIC_HANIBI_API_BASE_URL || '';

if (!API_BASE_URL) {
  console.warn(
    '[HttpClient] EXPO_PUBLIC_HANIBI_API_BASE_URL이 설정되지 않았습니다. .env 파일을 확인해주세요.',
  );
}

/**
 * Axios 인스턴스 생성
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * authStore에서 accessToken을 읽어서 Authorization 헤더에 추가합니다.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터
 * 401 Unauthorized 응답이 오면 authStore의 handleUnauthorized를 호출합니다.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().handleUnauthorized();
    }

    return Promise.reject(error);
  },
);
