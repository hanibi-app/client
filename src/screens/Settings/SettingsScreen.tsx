import React, { useCallback, useMemo, useState } from 'react';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import { RootStackParamList } from '@/navigation/types';
import { useLogoutNavigation } from '@/navigation/useLogoutNavigation';
import { SettingsAPI } from '@/services/api/settings';
import { resetOnboardingProgress } from '@/services/storage/onboarding';
import { useAppState } from '@/state/useAppState';
import { useAuthStore } from '@/store/authStore';
import { useLoadingStore } from '@/store/loadingStore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { logAuthState } from '@/utils/authDebug';

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

type BaseRowConfig = {
  key: string;
  label: string;
  description?: string;
};

type LinkRowConfig = BaseRowConfig & {
  type: 'link';
  onPress: () => void;
};

type ToggleRowConfig = BaseRowConfig & {
  type: 'toggle';
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
};

type SettingRowConfig = LinkRowConfig | ToggleRowConfig;

type SettingsSectionConfig =
  | {
      key: string;
      title: string;
      type: 'rows';
      rows: SettingRowConfig[];
    }
  | {
      key: string;
      title: string;
      type: 'cta';
      cta: {
        label: string;
        onPress: () => void;
      };
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
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const { startLoading, stopLoading, withLoading } = useLoadingStore();
  const { handleLogout, isLoggingOut } = useLogoutNavigation();
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);

  const handleResetOnboarding = useCallback(async () => {
    try {
      await resetOnboardingProgress();
      setHasOnboarded(false);
      Alert.alert('온보딩 안내', '다시 실행하면 온보딩을 처음부터 볼 수 있어요.');
    } catch (error) {
      Alert.alert('오류', '온보딩 정보를 초기화할 수 없어요.');
    }
  }, [setHasOnboarded]);

  const handlePlaceholder = useCallback((feature: string) => {
    Alert.alert('준비 중', `${feature} 기능은 곧 제공될 예정입니다.`);
  }, []);

  const onLogoutPress = useCallback(() => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠어요?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            // useLogoutNavigation 훅이 모든 로그아웃 로직을 처리합니다:
            // 1. 로그아웃 API 호출
            // 2. 토큰 및 전역 상태 초기화
            // 3. 루트 네비게이터를 Login 화면으로 안전하게 RESET
            await handleLogout();
            console.log('[SettingsScreen] 로그아웃 완료');
          } catch (error) {
            console.error('[SettingsScreen] 로그아웃 실패:', error);
            // 에러는 useLogoutNavigation 내부에서 처리됨
          }
        },
      },
    ]);
  }, [handleLogout]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert('계정 탈퇴', '정말 계정을 탈퇴하시겠어요?\n탈퇴한 계정은 복구할 수 없어요.', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '탈퇴하기',
        style: 'destructive',
        onPress: () => {
          // TODO: 계정 탈퇴 API 호출
          handlePlaceholder('계정 탈퇴');
        },
      },
    ]);
  }, [handlePlaceholder]);

  const handleDisplayToggle = useCallback(
    async (key: 'displayCharacter' | 'useMonochromeDisplay', value: boolean) => {
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
    },
    [displayCharacter, setDisplayCharacter, setUseMonochromeDisplay, useMonochromeDisplay],
  );

  const handleAlertToggle = useCallback(
    async (
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
    },
    [
      cleaningAlertsEnabled,
      dialogueAlertsEnabled,
      sensorAlertsEnabled,
      setCleaningAlertsEnabled,
      setDialogueAlertsEnabled,
      setSensorAlertsEnabled,
    ],
  );

  const sections = useMemo<SettingsSectionConfig[]>(() => {
    const disableDisplayCharacter = pendingToggle === 'displayCharacter';
    const disableMonochrome = pendingToggle === 'useMonochromeDisplay';
    const disableDialogue = pendingToggle === 'dialogueAlertsEnabled';
    const disableCleaning = pendingToggle === 'cleaningAlertsEnabled';
    const disableSensor = pendingToggle === 'sensorAlertsEnabled';

    const sections: SettingsSectionConfig[] = [
      {
        key: 'profile',
        title: '프로필 및 계정',
        type: 'rows',
        rows: [
          {
            key: 'profile',
            type: 'link',
            label: '프로필 및 계정',
            onPress: () => navigation.navigate('Profile'),
          },
          {
            key: 'logout',
            type: 'link',
            label: '로그아웃',
            onPress: onLogoutPress,
          },
          {
            key: 'deleteAccount',
            type: 'link',
            label: '계정 탈퇴',
            onPress: handleDeleteAccount,
          },
        ],
      },
      {
        key: 'pairing',
        title: '페어링',
        type: 'rows',
        rows: [
          {
            key: 'speech',
            type: 'link',
            label: '캐릭터 말투',
            description: '말투 및 언어 변경',
            onPress: () => handlePlaceholder('캐릭터 말투'),
          },
          {
            key: 'resetCharacter',
            type: 'link',
            label: '캐릭터 초기화',
            description: '캐릭터 설정을 초기값으로 되돌립니다',
            onPress: handleResetOnboarding,
          },
        ],
      },
      {
        key: 'remote',
        title: '원격 제어',
        type: 'rows',
        rows: [
          {
            key: 'device-control',
            type: 'link',
            label: '기기 제어',
            onPress: () => handlePlaceholder('기기 제어'),
          },
        ],
      },
      {
        key: 'display',
        title: '디스플레이',
        type: 'rows',
        rows: [
          {
            key: 'displayCharacter',
            type: 'toggle',
            label: '캐릭터 표시',
            value: displayCharacter,
            disabled: disableDisplayCharacter,
            onValueChange: (value) => handleDisplayToggle('displayCharacter', value),
          },
          {
            key: 'useMonochromeDisplay',
            type: 'toggle',
            label: '단순 색상 표시',
            value: useMonochromeDisplay,
            disabled: disableMonochrome,
            onValueChange: (value) => handleDisplayToggle('useMonochromeDisplay', value),
          },
        ],
      },
      {
        key: 'alerts',
        title: '알림 설정',
        type: 'rows',
        rows: [
          {
            key: 'dialogueAlertsEnabled',
            type: 'toggle',
            label: '대화 알림',
            value: dialogueAlertsEnabled,
            disabled: disableDialogue,
            onValueChange: (value) => handleAlertToggle('dialogueAlertsEnabled', value),
          },
          {
            key: 'cleaningAlertsEnabled',
            type: 'toggle',
            label: '청소 일정 알림',
            value: cleaningAlertsEnabled,
            disabled: disableCleaning,
            onValueChange: (value) => handleAlertToggle('cleaningAlertsEnabled', value),
          },
          {
            key: 'sensorAlertsEnabled',
            type: 'toggle',
            label: '센서 이상 알림',
            value: sensorAlertsEnabled,
            disabled: disableSensor,
            onValueChange: (value) => handleAlertToggle('sensorAlertsEnabled', value),
          },
        ],
      },
      {
        key: 'etc',
        title: '기타',
        type: 'rows',
        rows: [
          {
            key: 'terms',
            type: 'link',
            label: '이용약관',
            onPress: () => handlePlaceholder('이용약관'),
          },
          {
            key: 'version',
            type: 'link',
            label: '앱 버전 정보',
            description: '1.0.0 (데모)',
            onPress: () => handlePlaceholder('앱 버전 정보'),
          },
        ],
      },
    ];

    // 개발 모드에서만 인증 상태 확인 섹션 추가
    if (__DEV__) {
      sections.push({
        key: 'debug',
        title: '🔧 개발자 도구',
        type: 'rows',
        rows: [
          {
            key: 'authStatus',
            type: 'link',
            label: '인증 상태 확인',
            description: accessToken
              ? `✅ 로그인됨 (토큰: ${accessToken.substring(0, 20)}...)`
              : '❌ 로그인 안됨',
            onPress: () => {
              logAuthState();
              Alert.alert(
                '인증 상태',
                `Access Token: ${accessToken ? '✅ 있음' : '❌ 없음'}\nRefresh Token: ${refreshToken ? '✅ 있음' : '❌ 없음'}\n\n콘솔에서 자세한 정보를 확인하세요.`,
              );
            },
          },
          {
            key: 'testLoading',
            type: 'link',
            label: '전역 로딩 테스트 (3초)',
            description: '전역 로딩 UI 테스트',
            onPress: () => {
              withLoading(async () => {
                await new Promise((resolve) => setTimeout(resolve, 3000));
              }, '테스트 로딩 중...');
            },
          },
          {
            key: 'testLoadingManual',
            type: 'link',
            label: '전역 로딩 테스트 (수동)',
            description: '수동으로 시작/중지',
            onPress: () => {
              startLoading('수동 로딩 테스트 중...');
              setTimeout(() => {
                stopLoading();
              }, 2000);
            },
          },
        ],
      });
    }

    return sections;
  }, [
    cleaningAlertsEnabled,
    dialogueAlertsEnabled,
    displayCharacter,
    handleAlertToggle,
    handleDeleteAccount,
    handleDisplayToggle,
    onLogoutPress,
    handlePlaceholder,
    handleResetOnboarding,
    pendingToggle,
    sensorAlertsEnabled,
    useMonochromeDisplay,
    accessToken,
    refreshToken,
  ]);
  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <AppHeader
          title="설정"
          onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map((section) => {
          if (section.type === 'cta') {
            return (
              <SettingSection key={section.key} title={section.title}>
                <SettingLinkRow label={section.cta.label} onPress={section.cta.onPress} />
              </SettingSection>
            );
          }

          return (
            <SettingSection key={section.key} title={section.title}>
              {section.rows.map((row, index) => {
                const showDivider = index > 0;

                if (row.type === 'link') {
                  return (
                    <SettingLinkRow
                      key={row.key}
                      label={row.label}
                      description={row.description}
                      showDivider={showDivider}
                      onPress={row.onPress}
                    />
                  );
                }

                return (
                  <SettingToggleRow
                    key={row.key}
                    label={row.label}
                    description={row.description}
                    showDivider={showDivider}
                    value={row.value}
                    disabled={row.disabled}
                    onValueChange={row.onValueChange}
                  />
                );
              })}
            </SettingSection>
          );
        })}
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
  sectionTitleSpacing: {
    marginBottom: spacing.sm,
  },
});
