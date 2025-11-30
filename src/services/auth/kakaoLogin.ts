/**
 * 카카오 로그인 서비스
 * Expo Web Browser를 사용하여 카카오 로그인을 처리합니다.
 */

import * as WebBrowser from 'expo-web-browser';

// 카카오 로그인 완료 후 브라우저를 닫도록 설정
WebBrowser.maybeCompleteAuthSession();

/**
 * 카카오 로그인 URL 생성
 * @param redirectUri 리다이렉트 URI
 * @returns 카카오 로그인 URL
 */
export const getKakaoLoginUrl = (redirectUri: string): string => {
  const kakaoClientId = process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID || '';
  const kakaoRedirectUri = encodeURIComponent(redirectUri);

  if (!kakaoClientId) {
    throw new Error('EXPO_PUBLIC_KAKAO_CLIENT_ID가 설정되지 않았습니다.');
  }

  return `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUri}&response_type=code`;
};

/**
 * 카카오 로그인 실행
 * @param redirectUri 리다이렉트 URI
 * @returns 카카오 인증 코드 또는 null
 */
export const loginWithKakao = async (redirectUri: string): Promise<string | null> => {
  try {
    const loginUrl = getKakaoLoginUrl(redirectUri);

    const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);

    if (result.type === 'success' && result.url) {
      // URL에서 인증 코드 추출
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      return code;
    }

    return null;
  } catch (error) {
    console.error('[KakaoLogin] 로그인 오류:', error);
    throw error;
  }
};

/**
 * 카카오 액세스 토큰 가져오기
 * 백엔드 API를 통해 카카오 인증 코드를 액세스 토큰으로 교환합니다.
 * @param code 카카오 인증 코드
 * @returns 카카오 액세스 토큰
 */
export const getKakaoAccessToken = async (code: string): Promise<string> => {
  // 백엔드 API를 통해 카카오 인증 코드를 액세스 토큰으로 교환
  // 백엔드에서 카카오 API를 호출하여 액세스 토큰을 받아옵니다.
  const apiBaseUrl = process.env.EXPO_PUBLIC_HANIBI_API_BASE_URL || '';

  if (!apiBaseUrl) {
    throw new Error('EXPO_PUBLIC_HANIBI_API_BASE_URL이 설정되지 않았습니다.');
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/auth/kakao/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '카카오 액세스 토큰을 가져오는데 실패했습니다.');
  }

  const data = await response.json();
  return data.accessToken;
};
