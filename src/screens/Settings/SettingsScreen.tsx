import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { pairDevice, unpairDevice } from '@/api/devices';
import AppHeader from '@/components/common/AppHeader';
import ModalPopup from '@/components/common/ModalPopup';
import DeviceListModal from '@/components/DeviceListModal';
import DevicePairingModal from '@/components/DevicePairingModal';
import { useDevices } from '@/features/devices/hooks';
import { RootStackParamList } from '@/navigation/types';
import { useLogoutNavigation } from '@/navigation/useLogoutNavigation';
import { SettingsAPI } from '@/services/api/settings';
import {
  clearPairedDevice,
  getPairedDevice,
  setPairedDevice,
} from '@/services/storage/deviceStorage';
import { resetOnboardingProgress } from '@/services/storage/onboarding';
import { useAppState } from '@/state/useAppState';
import { useAuthStore } from '@/store/authStore';
import { useDeviceStore } from '@/store/deviceStore';
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
  const { setCurrentDeviceId } = useDeviceStore();
  const { handleLogout } = useLogoutNavigation();
  const queryClient = useQueryClient();
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);
  const { data: devices } = useDevices();
  const [isUnpairModalVisible, setIsUnpairModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [versionTapCount, setVersionTapCount] = useState(0);
  const versionTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unpairMutation = useMutation({
    mutationFn: unpairDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
    onError: (error) => {
      if (
        error instanceof Error &&
        'status' in error &&
        (error as { status: number }).status === 429
      ) {
        console.warn('[SettingsScreen] 페어링 해제 429 에러 - Rate limit');
        Alert.alert('알림', '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      }
    },
  });

  const syncToServerMutation = useMutation({
    mutationFn: pairDevice,
    onSuccess: async (device) => {
      await setPairedDevice({
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        apiSynced: true,
        syncedAt: new Date().toISOString(),
      });
      // 페어링 성공 시 deviceStore에 현재 기기 ID 설정
      setCurrentDeviceId(device.deviceId);
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      await loadLocalDevice();
      Alert.alert('완료', '서버와 동기화되었습니다.');
    },
    onError: async (error) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 409) {
          if (!localPairedDevice) {
            Alert.alert('오류', '동기화할 기기 정보가 없어요.');
            return;
          }
          Alert.alert(
            '이미 페어링된 기기',
            '이 기기는 이미 다른 계정과 페어링되어 있습니다.\n기존 페어링을 해제하고 다시 동기화하시겠어요?',
            [
              {
                text: '취소',
                style: 'cancel',
              },
              {
                text: '해제 후 동기화',
                onPress: async () => {
                  try {
                    await unpairDevice({ deviceId: localPairedDevice.deviceId });
                    await pairDevice({
                      deviceId: localPairedDevice.deviceId,
                      deviceName: localPairedDevice.deviceName,
                    });
                    await setPairedDevice({
                      deviceId: localPairedDevice.deviceId,
                      deviceName: localPairedDevice.deviceName,
                      apiSynced: true,
                      syncedAt: new Date().toISOString(),
                    });
                    // 페어링 성공 시 deviceStore에 현재 기기 ID 설정
                    setCurrentDeviceId(localPairedDevice.deviceId);
                    queryClient.invalidateQueries({ queryKey: ['devices'] });
                    await loadLocalDevice();
                    Alert.alert('완료', '서버와 동기화되었습니다.');
                  } catch (retryError) {
                    if (retryError instanceof AxiosError && retryError.response?.status === 429) {
                      console.warn('[SettingsScreen] 서버 동기화 재시도 429 에러 - Rate limit');
                      Alert.alert('알림', '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
                    } else {
                      Alert.alert('오류', '페어링 해제 및 재동기화에 실패했습니다.');
                    }
                  }
                },
              },
            ],
          );
          return;
        }
        if (status === 429) {
          console.warn('[SettingsScreen] 서버 동기화 429 에러 - Rate limit');
          Alert.alert('알림', '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
          return;
        }
      }
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : '서버 동기화에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    },
  });

  const [pairingModalVisible, setPairingModalVisible] = useState(false);
  const [deviceListModalVisible, setDeviceListModalVisible] = useState(false);
  const [localPairedDevice, setLocalPairedDevice] = useState<{
    deviceId: string;
    deviceName: string;
    apiSynced?: boolean;
  } | null>(null);

  const loadLocalDevice = useCallback(async () => {
    try {
      const device = await getPairedDevice();
      setLocalPairedDevice(device);
    } catch (error) {
      console.error('[SettingsScreen] 로컬 기기 정보 불러오기 실패:', error);
    }
  }, []);

  // Settings 화면 마운트 시 로컬 기기 정보만 로드
  // forceUnpair 자동 실행 제거 (429 에러 방지)
  useEffect(() => {
    loadLocalDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLocalDevice();
    }, [loadLocalDevice]),
  );

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (versionTapTimeoutRef.current) {
        clearTimeout(versionTapTimeoutRef.current);
      }
    };
  }, []);

  const handleOpenPairingModal = useCallback(() => {
    setPairingModalVisible(true);
  }, []);

  const handleClosePairingModal = useCallback(() => {
    setPairingModalVisible(false);
    loadLocalDevice();
  }, [loadLocalDevice]);

  const handleOpenDeviceListModal = useCallback(() => {
    setDeviceListModalVisible(true);
  }, []);

  const handleCloseDeviceListModal = useCallback(() => {
    setDeviceListModalVisible(false);
  }, []);

  const handleSyncToServer = useCallback(async () => {
    if (!localPairedDevice) {
      Alert.alert('오류', '동기화할 기기 정보가 없어요.');
      return;
    }

    if (localPairedDevice.apiSynced) {
      Alert.alert('알림', '이미 서버와 동기화되어 있어요.');
      return;
    }

    Alert.alert('서버 동기화', '서버에 기기 정보를 동기화하시겠어요?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '동기화',
        onPress: async () => {
          try {
            await syncToServerMutation.mutateAsync({
              deviceId: localPairedDevice.deviceId,
              deviceName: localPairedDevice.deviceName,
            });
          } catch (error) {
            console.error('[SettingsScreen] 서버 동기화 실패:', error);
          }
        },
      },
    ]);
  }, [localPairedDevice, syncToServerMutation]);

  const handleForceUnpair = useCallback(async () => {
    Alert.alert('페어링 초기화', '로컬에 저장된 기기 정보를 초기화하시겠어요?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '초기화',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearPairedDevice();
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            queryClient.removeQueries({ queryKey: ['devices'] });
            setLocalPairedDevice(null);
            Alert.alert('완료', '페어링 정보가 초기화되었어요.');
          } catch (error) {
            console.error('[SettingsScreen] 강제 초기화 실패:', error);
            Alert.alert('오류', '초기화 중 오류가 발생했어요.');
          }
        },
      },
    ]);
  }, [queryClient]);

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

  /**
   * 앱 버전 정보를 탭하면 카운트를 증가시키고,
   * 5-7회 연속 탭하면 개발자 모드로 진입합니다.
   */
  const handleVersionTap = useCallback(() => {
    // 기존 타이머가 있으면 취소
    if (versionTapTimeoutRef.current) {
      clearTimeout(versionTapTimeoutRef.current);
    }

    const newCount = versionTapCount + 1;
    setVersionTapCount(newCount);

    // 5-7회 탭하면 개발자 모드로 진입
    if (newCount >= 5 && newCount <= 7) {
      navigation.navigate('DeveloperMode');
      setVersionTapCount(0);
    } else if (newCount > 7) {
      // 7회를 넘으면 카운트 리셋
      setVersionTapCount(0);
    }

    // 2초 후 카운트 리셋
    versionTapTimeoutRef.current = setTimeout(() => {
      setVersionTapCount(0);
    }, 2000);
  }, [versionTapCount, navigation]);

  const onLogoutPress = useCallback(() => {
    setIsLogoutModalVisible(true);
  }, []);

  const handleLogoutConfirm = useCallback(async () => {
    setIsLogoutModalVisible(false);
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
  }, [handleLogout]);

  const handleLogoutCancel = useCallback(() => {
    setIsLogoutModalVisible(false);
  }, []);

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

  // 페어링 해제 모달 열기
  const handleOpenUnpairModal = useCallback(() => {
    setIsUnpairModalVisible(true);
  }, []);

  // 페어링 해제 모달 닫기
  const handleCloseUnpairModal = useCallback(() => {
    setIsUnpairModalVisible(false);
  }, []);

  // 페어링 해제 확인 (DELETE /api/v1/devices/pair)
  const handleConfirmUnpair = useCallback(async () => {
    if (!devices || devices.length === 0) {
      Alert.alert('오류', '페어링된 기기가 없어요.');
      setIsUnpairModalVisible(false);
      return;
    }

    const deviceToUnpair = devices[0];

    try {
      await unpairMutation.mutateAsync({ deviceId: deviceToUnpair.deviceId });
      await clearPairedDevice();
      setLocalPairedDevice(null);
      setIsUnpairModalVisible(false);
      Alert.alert('완료', '페어링이 해제되었어요.');
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : '페어링 해제 중 오류가 발생했어요.';

      if (error instanceof AxiosError && error.response?.status === 429) {
        console.warn('[SettingsScreen] 페어링 해제 429 에러 - Rate limit');
      } else {
        console.error('[SettingsScreen] 페어링 해제 실패:', error);
      }
      Alert.alert('오류', errorMessage);
    }
  }, [devices, unpairMutation]);

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
          {
            key: 'deviceStatus',
            type: 'link',
            label:
              devices && devices.length > 0
                ? `연결된 기기: ${devices[0].deviceName} (${devices[0].deviceId})`
                : '연결된 기기가 없습니다.',
            description: devices && devices.length > 0 ? '✅ 서버와 동기화됨' : undefined,
            onPress: handleOpenDeviceListModal,
          } as LinkRowConfig,
          ...(localPairedDevice && !localPairedDevice.apiSynced
            ? [
                {
                  key: 'syncToServer',
                  type: 'link',
                  label: '서버 동기화',
                  description: '서버에 기기 정보를 동기화합니다',
                  onPress: handleSyncToServer,
                } as LinkRowConfig,
              ]
            : []),
          {
            key: 'pairDevice',
            type: 'link',
            label: '기기 페어링',
            description: '새로운 기기를 페어링합니다',
            onPress: handleOpenPairingModal,
          } as LinkRowConfig,
          {
            key: 'forceUnpair',
            type: 'link',
            label: '페어링 초기화',
            description: '로컬에 저장된 기기 정보를 초기화합니다',
            onPress: handleForceUnpair,
          } as LinkRowConfig,
          ...(devices && devices.length > 0
            ? [
                {
                  key: 'unpair',
                  type: 'link',
                  label: '페어링 해제',
                  description: '서버에 등록된 기기의 페어링을 해제합니다',
                  onPress: handleOpenUnpairModal,
                } as LinkRowConfig,
              ]
            : []),
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
            onPress: handleVersionTap,
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
            description: accessToken ? '✅ 로그인됨' : '❌ 로그인 안됨',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cleaningAlertsEnabled,
    devices,
    dialogueAlertsEnabled,
    displayCharacter,
    handleAlertToggle,
    handleDeleteAccount,
    handleOpenDeviceListModal,
    handleOpenPairingModal,
    handleSyncToServer,
    handleForceUnpair,
    handleOpenUnpairModal,
    localPairedDevice,
    navigation,
    startLoading,
    stopLoading,
    withLoading,
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

      {/* 로그아웃 확인 모달 */}
      <ModalPopup
        visible={isLogoutModalVisible}
        title="로그아웃"
        description="정말 로그아웃하시겠어요?"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      {/* 페어링 해제 모달 */}
      <ModalPopup
        visible={isUnpairModalVisible}
        title="페어링 해제"
        description="정말 페어링을 해제하시겠어요? 해제 후에는 실시간 건강 상태를 확인할 수 없어요."
        onConfirm={handleConfirmUnpair}
        onCancel={handleCloseUnpairModal}
      />

      {/* 기기 페어링 모달 */}
      <DevicePairingModal visible={pairingModalVisible} onClose={handleClosePairingModal} />

      {/* 기기 목록 모달 */}
      <DeviceListModal visible={deviceListModalVisible} onClose={handleCloseDeviceListModal} />
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
