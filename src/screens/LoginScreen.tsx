import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import { useKakaoLogin } from '@/features/auth/hooks';
import { RootStackParamList } from '@/navigation/types';
import { getKakaoAccessToken, loginWithKakao } from '@/services/auth/kakaoLogin';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const kakaoLoginMutation = useKakaoLogin();

  // 화면 중앙에 적절한 크기로 표시
  const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.85, SCREEN_HEIGHT * 0.8));

  const handleKakaoLogin = async () => {
    if (isLoading || kakaoLoginMutation.isPending) {
      return;
    }

    try {
      setIsLoading(true);

      // 리다이렉트 URI 설정 (앱의 스킴 또는 웹 URL)
      const redirectUri = process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI || 'hanibi://kakao-login';

      // 카카오 로그인 실행
      const code = await loginWithKakao(redirectUri);

      if (!code) {
        Alert.alert('로그인 취소', '카카오 로그인이 취소되었습니다.');
        setIsLoading(false);
        return;
      }

      // 카카오 액세스 토큰 가져오기
      const kakaoAccessToken = await getKakaoAccessToken(code);

      // 백엔드 API를 통해 카카오 로그인 처리
      kakaoLoginMutation.mutate(
        { accessToken: kakaoAccessToken },
        {
          onSuccess: () => {
            console.log('[LoginScreen] 카카오 로그인 성공');
            navigation.navigate('NotificationRequest');
          },
          onError: (error) => {
            console.error('[LoginScreen] 카카오 로그인 실패:', error);
            Alert.alert('로그인 실패', '카카오 로그인에 실패했습니다. 다시 시도해주세요.');
          },
          onSettled: () => {
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error('[LoginScreen] 카카오 로그인 오류:', error);
      Alert.alert('오류', '카카오 로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const characterContainerStyle = {
    position: 'absolute' as const,
    top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 + 50,
    left: (SCREEN_WIDTH - CHARACTER_SIZE) / 2,
    width: CHARACTER_SIZE,
    height: CHARACTER_SIZE,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    alignSelf: 'center' as const,
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>지금부터 음식물 쓰레기</Text>
          <Text style={styles.titleHighlight}>고민 STOP!</Text>
          <Text style={styles.subtitle}>한니비와 함께 음식물 쓰레기 고민 해결해 봐요</Text>
        </View>

        <View style={characterContainerStyle}>
          <HanibiCharacter2D level="medium" animated={true} size={CHARACTER_SIZE} />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleKakaoLogin}
            style={[
              styles.kakaoButton,
              (isLoading || kakaoLoginMutation.isPending) && styles.kakaoButtonDisabled,
            ]}
            disabled={isLoading || kakaoLoginMutation.isPending}
          >
            <View style={styles.kakaoIconPlaceholder}>
              <KakaoLogoIcon />
            </View>
            <Text style={styles.kakaoButtonText}>
              {isLoading || kakaoLoginMutation.isPending ? '로그인 중...' : '카카오로 시작하기'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    bottom: 60,
    paddingHorizontal: spacing.xl,
    position: 'absolute',
    width: '100%',
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  kakaoButton: {
    alignItems: 'center',
    backgroundColor: colors.kakao,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    width: '100%',
  },
  kakaoButtonDisabled: {
    opacity: 0.6,
  },
  kakaoButtonText: {
    color: colors.black,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginLeft: spacing.sm,
  },
  kakaoIconPlaceholder: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 150,
    width: '100%',
    zIndex: 1,
  },
  titleHighlight: {
    color: colors.text,
    fontSize: 28,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

function KakaoLogoIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 20.625C17.0751 20.625 22 16.3157 22 11C22 5.68426 17.0751 1.375 11 1.375C4.92487 1.375 0 5.68426 0 11C0 13.4212 1.02171 15.6336 2.70845 17.3251C2.56821 18.7899 2.09219 20.4024 1.57748 21.5684C1.49604 21.7528 1.64863 21.9604 1.84782 21.9289C5.05613 21.4223 6.9548 20.6185 7.77265 20.2041C8.79323 20.4777 9.87696 20.625 11 20.625Z"
        fill="#040404"
      />
    </Svg>
  );
}
