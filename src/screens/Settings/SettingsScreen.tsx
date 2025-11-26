import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type SettingLinkRowProps = {
  label: string;
  description?: string;
  showDivider?: boolean;
  onPress?: () => void;
};

type SettingToggleRowProps = {
  label: string;
  description?: string;
  showDivider?: boolean;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const SettingLinkRow = ({ label, description, showDivider, onPress }: SettingLinkRowProps) => (
  <Pressable style={[styles.row, showDivider && styles.rowDivider]} onPress={onPress}>
    <View style={styles.rowText}>
      <Text style={styles.rowLabel}>{label}</Text>
      {description ? <Text style={styles.rowDescription}>{description}</Text> : null}
    </View>
    <Text style={styles.rowArrow}>›</Text>
  </Pressable>
);

const SettingToggleRow = ({
  label,
  description,
  showDivider,
  value,
  onValueChange,
}: SettingToggleRowProps) => (
  <View style={[styles.row, showDivider && styles.rowDivider]}>
    <View style={styles.rowText}>
      <Text style={styles.rowLabel}>{label}</Text>
      {description ? <Text style={styles.rowDescription}>{description}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#e5e7eb', true: colors.primary }}
      thumbColor="#fff"
    />
  </View>
);

const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

export default function SettingsScreen() {
  const {
    setHasOnboarded,
    displayCharacter,
    useMonochromeDisplay,
    dialogueAlertsEnabled,
    cleaningAlertsEnabled,
    sensorAlertsEnabled,
    setDisplayCharacter,
    setUseMonochromeDisplay,
    setDialogueAlertsEnabled,
    setCleaningAlertsEnabled,
    setSensorAlertsEnabled,
  } = useAppState();

  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@hanibi:onboarding_complete');
      setHasOnboarded(false);
      Alert.alert('온보딩 안내', '다시 실행하면 온보딩을 처음부터 볼 수 있어요.');
    } catch (error) {
      Alert.alert('오류', '온보딩 정보를 초기화할 수 없어요.');
    }
  };

  const handlePlaceholder = (feature: string) => {
    Alert.alert('준비 중', `${feature} 기능은 곧 제공될 예정입니다.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>설정</Text>
          <View style={styles.backButton} />
        </View>

        <SettingSection title="프로필 및 계정">
          <SettingLinkRow label="프로필 및 계정" onPress={() => handlePlaceholder('프로필')} />
        </SettingSection>

        <SettingSection title="페어링">
          <SettingLinkRow
            label="캐릭터 말투"
            description="말투 및 언어 변경"
            onPress={() => handlePlaceholder('캐릭터 말투')}
          />
          <SettingLinkRow
            label="캐릭터 초기화"
            description="캐릭터 설정을 초기값으로 되돌립니다"
            showDivider
            onPress={handleResetOnboarding}
          />
        </SettingSection>

        <SettingSection title="원격 제어">
          <SettingLinkRow label="기기 제어" onPress={() => handlePlaceholder('기기 제어')} />
        </SettingSection>

        <SettingSection title="디스플레이">
          <SettingToggleRow
            label="캐릭터 표시"
            value={displayCharacter}
            onValueChange={setDisplayCharacter}
          />
          <SettingToggleRow
            label="단순 색상 표시"
            showDivider
            value={useMonochromeDisplay}
            onValueChange={setUseMonochromeDisplay}
          />
        </SettingSection>

        <SettingSection title="알림 설정">
          <SettingToggleRow
            label="대화 알림"
            value={dialogueAlertsEnabled}
            onValueChange={setDialogueAlertsEnabled}
          />
          <SettingToggleRow
            label="청소 일정 알림"
            showDivider
            value={cleaningAlertsEnabled}
            onValueChange={setCleaningAlertsEnabled}
          />
          <SettingToggleRow
            label="센서 이상 알림"
            showDivider
            value={sensorAlertsEnabled}
            onValueChange={setSensorAlertsEnabled}
          />
        </SettingSection>

        <SettingSection title="기타">
          <SettingLinkRow label="이용약관" onPress={() => handlePlaceholder('이용약관')} />
          <SettingLinkRow
            label="앱 버전 정보"
            showDivider
            description="1.0.0 (데모)"
            onPress={() => handlePlaceholder('앱 버전 정보')}
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 32,
  },
  backIcon: {
    color: colors.text,
    fontSize: typography.sizes.xl,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  container: {
    backgroundColor: colors.gray50,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  rowArrow: {
    color: colors.mutedText,
    fontSize: typography.sizes.xl,
  },
  rowDescription: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs / 2,
  },
  rowDivider: {
    borderTopColor: colors.gray100,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  rowText: {
    flex: 1,
    marginRight: spacing.md,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
});
