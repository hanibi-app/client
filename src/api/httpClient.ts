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
 * 401 Unauthorized 응답이 오면 토큰 갱신을 시도하고 원래 요청을 재시도합니다.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고, 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authStore = useAuthStore.getState();

      // 리프레시 토큰이 있고, 갱신 중이 아닌 경우에만 갱신 시도
      if (authStore.refreshToken && !authStore.isRefreshing) {
        try {
          // 토큰 갱신
          const newAccessToken = await authStore.refreshAccessToken();

          // 원래 요청의 Authorization 헤더 업데이트
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // 원래 요청 재시도
          return apiClient(originalRequest);
        } catch (refreshError) {
          // 토큰 갱신 실패 시 로그아웃 처리
          console.error('[HttpClient] 토큰 갱신 실패:', refreshError);
          authStore.clear();
          return Promise.reject(refreshError);
        }
      } else if (!authStore.refreshToken) {
        // 리프레시 토큰이 없으면 바로 초기화
        authStore.clear();
      }
    }

    return Promise.reject(error);
  },
);
