import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import PrimaryButton from '@/components/common/PrimaryButton';
import { ROOT_ROUTES } from '@/constants/routes';
import { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  // 화면 중앙에 적절한 크기로 표시
  const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.85, SCREEN_HEIGHT * 0.8));

  const handleKakaoLogin = () => {
    // 카카오 로그인 없이 바로 다음 화면으로 이동
    navigation.navigate(ROOT_ROUTES.NOTIFICATION_REQUEST);
  };

  const handleEmailLogin = () => {
    navigation.navigate(ROOT_ROUTES.EMAIL_LOGIN);
  };

  const characterContainerStyle = {
    position: 'absolute' as const,
    top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2 + 20,
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
          <Pressable onPress={handleKakaoLogin} style={styles.kakaoButton}>
            <View style={styles.kakaoIconPlaceholder}>
              <KakaoLogoIcon />
            </View>
            <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
          </Pressable>

          <View style={styles.buttonSpacing} />

          <PrimaryButton label="로그인하기" onPress={handleEmailLogin} />

          <View style={styles.registerLinkContainer}>
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate(ROOT_ROUTES.REGISTER)}
            >
              회원가입하기
            </Text>
          </View>
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
  buttonSpacing: {
    height: spacing.md,
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
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    width: '100%',
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
  registerLink: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  registerLinkContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
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
