import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { notificationsEnabled, setNotificationsEnabled, setHasOnboarded } = useAppState();

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@hanibi:onboarding_complete');
      setHasOnboarded(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' as never }],
        }),
      );
    } catch (error) {
      console.error('온보딩 리셋 실패:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>설정</Text>

        {/* 알림 토글 */}
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Text style={styles.settingLabel}>알림</Text>
            <Text style={styles.settingDescription}>음식물 처리 상태 알림</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#e5e7eb', true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* 온보딩 다시 보기 */}
        <Pressable onPress={handleResetOnboarding} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>온보딩 다시 보기</Text>
        </Pressable>

        {/* 앱 정보 */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>버전</Text>
          <Text style={styles.infoValue}>1.0.0 (데모)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray50,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  infoLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  infoSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  infoValue: {
    color: colors.text,
    fontSize: typography.sizes.md,
    marginTop: spacing.xs,
  },
  resetButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: 12,
    marginTop: spacing.xxl,
    paddingVertical: spacing.md,
    width: '100%',
  },
  resetButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  settingDescription: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  settingLabel: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingRow: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
});
