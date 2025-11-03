import React from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/common/AppButton';
import HanibiCharacter3D from '@/components/common/HanibiCharacter3D';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type NotificationRequestScreenProps = {
  onEnableNotifications?: () => void;
  onSkip?: () => void;
};

export default function NotificationRequestScreen({
  onEnableNotifications,
  onSkip,
}: NotificationRequestScreenProps) {
  const handleEnable = () => {
    // TODO: 알림 권한 요청 구현
    console.log('알림 활성화');
    onEnableNotifications?.();
  };

  const handleSkip = () => {
    console.log('알림 건너뛰기');
    onSkip?.();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.content}>
        <Text style={styles.title}>알림을 받으면 까먹지 않고 알 수 있어요</Text>
        <Text style={styles.subtitle}>음식물 처리가 잘 되고 있는 지 알려줄게요</Text>

        <View style={styles.characterContainer}>
          <HanibiCharacter3D level="medium" animated={true} size={120} />
        </View>

        <View style={styles.notificationExamples}>
          <View style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationSender}>한니비</Text>
              <Text style={styles.notificationTime}>2분전</Text>
            </View>
            <Text style={styles.notificationMessage}>
              [배양블록 필요] 소화가 안돼요 도와주세요 🥺
            </Text>
          </View>

          <View style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationSender}>한니비</Text>
              <Text style={styles.notificationTime}>17분전</Text>
            </View>
            <Text style={styles.notificationMessage}>
              [음식물 처리 완료] 오늘도 너무 맛있었어요! 좋은 하루 되세요:)
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            label="알람을 켤래"
            variant="primary"
            onPress={handleEnable}
            style={styles.enableButton}
          />
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>지금은 괜찮아</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginVertical: spacing.lg,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  enableButton: {
    marginBottom: spacing.md,
    width: '100%',
  },
  notificationCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
  },
  notificationExamples: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    width: '100%',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  notificationSender: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  notificationTime: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
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
    marginTop: spacing.md,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    lineHeight: 38,
    marginTop: spacing.xxl,
    textAlign: 'center',
  },
});

