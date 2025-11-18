import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HanibiLogo from '@/assets/images/hanibi.svg';
import AppButton from '@/components/common/AppButton';
import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import OutlinedButton from '@/components/common/OutlinedButton';
import ScreenHeader from '@/components/common/ScreenHeader';
import { RootStackParamList } from '@/navigation/types';
import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type NotificationRequestScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NotificationRequest'
>;
const CHARACTER_SIZE = 160;
const CHARACTER_POSITION = { top: 179, left: 220 };
const HORIZONTAL_PADDING = spacing.xl;

export default function NotificationRequestScreen({ navigation }: NotificationRequestScreenProps) {
  const { setNotificationsEnabled } = useAppState();
  const insets = useSafeAreaInsets();

  const handleEnable = () => {
    // TODO: 알림 권한 요청 구현
    console.log('알림 활성화');
    setNotificationsEnabled(true);
    navigation.navigate('CautionSlides');
  };

  const handleSkip = () => {
    console.log('알림 건너뛰기');
    navigation.navigate('CautionSlides');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="알림 요청"
        containerStyle={[styles.header, { paddingTop: insets.top + spacing.sm }]}
        titleStyle={styles.headerTitle}
      />
      <View style={styles.content}>
        {/* 타이틀 영역 (왼쪽 정렬) */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>알림을 받으면{'\n'}까먹지 않고 알 수 있어요</Text>
          <Text style={styles.subtitle}>음식물 처리가 잘 되고 있는 지 알려줄게요</Text>
        </View>

        {/* 캐릭터 */}
        <View style={styles.characterWrapper}>
          <View style={styles.characterCircle}>
            <HanibiCharacter2D level="medium" animated size={CHARACTER_SIZE} />
          </View>
        </View>

        {/* 알림 예시 */}
        <View style={styles.notificationExamples}>
          <View style={styles.notificationBubble}>
            <View style={styles.notificationIcon}>
              <HanibiLogo width={18} height={18} />
            </View>
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
            <View style={styles.notificationIcon}>
              <HanibiLogo width={18} height={18} />
            </View>
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
        <View style={[styles.buttonContainer, { bottom: spacing.lg + insets.bottom }]}>
          <AppButton
            label="알람을 켤래"
            variant="primary"
            onPress={handleEnable}
            style={[
              styles.enableButton,
              { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
            textColor={colors.black}
            size="lg"
          />
          <OutlinedButton
            label="지금은 괜찮아"
            onPress={handleSkip}
            style={styles.skipButton}
            labelStyle={styles.skipButtonText}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    bottom: spacing.xl,
    paddingHorizontal: HORIZONTAL_PADDING,
    position: 'absolute',
    width: '100%',
  },
  characterCircle: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    borderRadius: CHARACTER_SIZE / 2,
    height: CHARACTER_SIZE,
    justifyContent: 'center',
    width: CHARACTER_SIZE,
  },
  characterWrapper: {
    left: CHARACTER_POSITION.left,
    position: 'absolute',
    top: CHARACTER_POSITION.top,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: 120,
    paddingTop: spacing.lg,
    position: 'relative',
  },
  enableButton: {
    borderRadius: 12,
    marginBottom: spacing.md,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  notificationBubble: {
    backgroundColor: colors.notifyBackground,
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
  notificationExamples: {
    alignSelf: 'stretch',
    gap: spacing.md,
    marginBottom: spacing.lg,
    marginHorizontal: HORIZONTAL_PADDING,
    marginTop: 200,
  },
  notificationIcon: {
    alignItems: 'center',
    backgroundColor: colors.notifyBackground,
    borderRadius: 6,
    height: 32,
    justifyContent: 'center',
    width: 32,
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
  skipButton: {
    alignSelf: 'center',
    backgroundColor: colors.transparent,
    borderWidth: 0,
    marginTop: spacing.xs,
  },
  skipButtonText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    lineHeight: 32,
  },
  titleContainer: {
    alignSelf: 'stretch',
    marginHorizontal: HORIZONTAL_PADDING,
  },
});
