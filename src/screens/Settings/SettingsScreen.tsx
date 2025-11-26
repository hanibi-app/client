import React, { useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import { RootStackParamList } from '@/navigation/types';
import { SettingsAPI } from '@/services/api/settings';
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
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
};

const SettingLinkRow = ({ label, description, showDivider, onPress }: SettingLinkRowProps) => (
  <Pressable style={[styles.row, showDivider && styles.rowDivider]} onPress={onPress}>
    <View style={styles.rowText}>
      <Text style={[styles.rowLabel, styles.linkLabel]}>{label}</Text>
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
  disabled,
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
      disabled={disabled}
    />
  </View>
);

const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
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
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);

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

  const handleDisplayToggle = async (
    key: 'displayCharacter' | 'useMonochromeDisplay',
    value: boolean,
  ) => {
    const prevValue = key === 'displayCharacter' ? displayCharacter : useMonochromeDisplay;
    const setter = key === 'displayCharacter' ? setDisplayCharacter : setUseMonochromeDisplay;
    setter(value);
    setPendingToggle(key);

    try {
      await SettingsAPI.updateDisplaySettings({ [key]: value });
    } catch (error) {
      setter(prevValue);
      Alert.alert('오류', '디스플레이 설정을 저장할 수 없어요.');
    } finally {
      setPendingToggle(null);
    }
  };

  const handleAlertToggle = async (
    key: 'dialogueAlertsEnabled' | 'cleaningAlertsEnabled' | 'sensorAlertsEnabled',
    value: boolean,
  ) => {
    const prevValue =
      key === 'dialogueAlertsEnabled'
        ? dialogueAlertsEnabled
        : key === 'cleaningAlertsEnabled'
          ? cleaningAlertsEnabled
          : sensorAlertsEnabled;
    const setter =
      key === 'dialogueAlertsEnabled'
        ? setDialogueAlertsEnabled
        : key === 'cleaningAlertsEnabled'
          ? setCleaningAlertsEnabled
          : setSensorAlertsEnabled;

    setter(value);
    setPendingToggle(key);

    try {
      await SettingsAPI.updateAlertSettings({ [key]: value });
    } catch (error) {
      setter(prevValue);
      Alert.alert('오류', '알림 설정을 저장할 수 없어요.');
    } finally {
      setPendingToggle(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <AppHeader
          title="설정"
          onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Pressable
            style={[styles.card, styles.sectionTitleButton]}
            onPress={() => handlePlaceholder('프로필')}
            accessibilityRole="button"
          >
            <Text style={styles.sectionTitle}>프로필 및 계정</Text>
            <Text style={styles.sectionTitleArrow}>›</Text>
          </Pressable>
        </View>

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
            onValueChange={(value) => handleDisplayToggle('displayCharacter', value)}
            disabled={pendingToggle === 'displayCharacter'}
          />
          <SettingToggleRow
            label="단순 색상 표시"
            showDivider
            value={useMonochromeDisplay}
            onValueChange={(value) => handleDisplayToggle('useMonochromeDisplay', value)}
            disabled={pendingToggle === 'useMonochromeDisplay'}
          />
        </SettingSection>

        <SettingSection title="알림 설정">
          <SettingToggleRow
            label="대화 알림"
            value={dialogueAlertsEnabled}
            onValueChange={(value) => handleAlertToggle('dialogueAlertsEnabled', value)}
            disabled={pendingToggle === 'dialogueAlertsEnabled'}
          />
          <SettingToggleRow
            label="청소 일정 알림"
            showDivider
            value={cleaningAlertsEnabled}
            onValueChange={(value) => handleAlertToggle('cleaningAlertsEnabled', value)}
            disabled={pendingToggle === 'cleaningAlertsEnabled'}
          />
          <SettingToggleRow
            label="센서 이상 알림"
            showDivider
            value={sensorAlertsEnabled}
            onValueChange={(value) => handleAlertToggle('sensorAlertsEnabled', value)}
            disabled={pendingToggle === 'sensorAlertsEnabled'}
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
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  headerContainer: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  linkLabel: {
    color: colors.text,
    fontSize: typography.sizes.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 60,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  rowArrow: {
    alignSelf: 'center',
    color: colors.mutedText,
    fontSize: typography.sizes.xl,
  },
  rowDescription: {
    color: colors.mutedTextLight,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs / 2,
  },
  rowDivider: {
    borderTopColor: colors.gray100,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    color: colors.text,
    fontSize: typography.sizes.sm,
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
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  sectionTitleArrow: {
    color: colors.mutedText,
    fontSize: typography.sizes.xl,
    marginLeft: spacing.sm,
  },
  sectionTitleButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  sectionTitleSpacing: {
    marginBottom: spacing.sm,
  },
});
