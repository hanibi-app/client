import React from 'react';

import { ONBOARDING_ROUTES } from '@/constants/routes';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import AppButton from '@/components/common/AppButton';
import HanibiCharacter3D from '@/components/common/HanibiCharacter3D';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type NotificationRequestScreenProps = {
  onEnableNotifications?: () => void;
  onSkip?: () => void;
  navigation?: any;
};

export default function NotificationRequestScreen({
  onEnableNotifications,
  onSkip,
  navigation,
}: NotificationRequestScreenProps) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  
  // 캐릭터 크기: 화면의 70-80% 정도
  const CHARACTER_SIZE = Math.floor(SCREEN_WIDTH * 0.75);

  const handleEnable = () => {
    // TODO: 알림 권한 요청 구현
    console.log('알림 활성화');
    // 주의사항 화면으로 이동
    if (navigation) {
      navigation.navigate(ONBOARDING_ROUTES.PRECAUTIONS);
    } else {
      onEnableNotifications?.();
    }
  };

  const handleSkip = () => {
    console.log('알림 건너뛰기');
    // 홈으로 바로 이동
    onSkip?.();
  };

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 타이틀 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>알림 요청</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* 메인 제목 */}
          <Text style={styles.title}>알림을 받으면 까먹지 않고 알 수 있어요</Text>
          
          {/* 서브타이틀 */}
          <Text style={styles.subtitle}>음식물 처리가 잘 되고 있는 지 알려줄게요</Text>

          {/* 3D 캐릭터 컨테이너 */}
          <View style={[styles.characterContainer, { width: CHARACTER_SIZE, height: CHARACTER_SIZE }]}>
            <HanibiCharacter3D level="medium" animated={true} size={CHARACTER_SIZE} />
          </View>

          {/* 알림 예시 */}
          <View style={styles.notificationExamples}>
            <View style={styles.notificationBubble}>
              <View style={styles.notificationIcon} />
              <View style={styles.notificationContent}>
                <View style={styles.notificationTopRow}>
                  <Text style={styles.notificationSender}>한니비</Text>
                  <Text style={styles.notificationTime}>2분전</Text>
                </View>
                <Text style={styles.notificationMessage}>
                  [배양블록 필요] 소화가 안돼요 도와주세요 🥺
                </Text>
              </View>
            </View>

            <View style={styles.notificationBubble}>
              <View style={styles.notificationIcon} />
              <View style={styles.notificationContent}>
                <View style={styles.notificationTopRow}>
                  <Text style={styles.notificationSender}>한니비</Text>
                  <Text style={styles.notificationTime}>17분전</Text>
                </View>
                <Text style={styles.notificationMessage}>
                  [음식물 처리 완료] 오늘도 너무 맛있었어요! 좋은 하루 되세요:)
                </Text>
              </View>
            </View>
          </View>

          {/* 버튼 컨테이너 */}
          <View style={styles.buttonContainer}>
            <AppButton
              label="알람을 켤래"
              variant="primary"
              onPress={handleEnable}
              style={styles.enableButton}
              size="lg"
            />
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>지금은 괜찮아</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: spacing.xl,
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  characterContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginVertical: spacing.lg,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  enableButton: {
    borderRadius: 12,
    marginBottom: spacing.md,
    width: '100%',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  notificationBubble: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.md,
    width: '100%',
  },
  notificationContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  notificationIcon: {
    backgroundColor: '#d1d5db',
    borderRadius: 4,
    height: 40,
    width: 40,
  },
  notificationMessage: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  notificationSender: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  notificationTime: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginLeft: 'auto',
  },
  notificationTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationExamples: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  skipButtonText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    lineHeight: 22,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    lineHeight: 38,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
});

