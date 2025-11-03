import React from 'react';

import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import HanibiCharacter3D from '@/components/common/HanibiCharacter3D';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type LoginScreenProps = {
  onKakaoLogin?: () => void;
};

export default function LoginScreen({ onKakaoLogin }: LoginScreenProps) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  
  // 화면 중앙에 완전히 크게 표시 - 적절한 크기로 설정
  const CHARACTER_SIZE = Math.floor(Math.min(SCREEN_WIDTH * 0.9, SCREEN_HEIGHT * 0.7));
  
  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 구현
    console.log('카카오 로그인 클릭');
    onKakaoLogin?.();
  };

  const characterContainerStyle = {
    position: 'absolute' as const,
    top: (SCREEN_HEIGHT - CHARACTER_SIZE) / 2,
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
          <HanibiCharacter3D level="medium" animated={true} size={CHARACTER_SIZE} />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={handleKakaoLogin} style={styles.kakaoButton}>
            <View style={styles.kakaoIconPlaceholder}>
              <Text style={styles.kakaoIconText}>💬</Text>
            </View>
            <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    bottom: 100,
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
  kakaoIconText: {
    fontSize: 20,
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

