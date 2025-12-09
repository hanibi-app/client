import React, { useEffect, useState } from 'react';

import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PrimaryButton from '@/components/common/PrimaryButton';
import { FoodSessionTimeline } from '@/components/food/FoodSessionTimeline';
import { ROOT_ROUTES } from '@/constants/routes';
import {
  useDeviceDetailQuery,
  useUnpairDevice,
  useUpdateDeviceMutation,
} from '@/features/devices/hooks';
import { useDeviceCommandsQuery, useSendDeviceCommandMutation } from '@/hooks/useDeviceCommands';
import { RootStackParamList } from '@/navigation/types';
import { clearPairedDevice } from '@/services/storage/deviceStorage';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type DeviceDetailRouteProp = RouteProp<RootStackParamList, typeof ROOT_ROUTES.DEVICE_DETAIL>;
type DeviceDetailNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof ROOT_ROUTES.DEVICE_DETAIL
>;

export default function DeviceDetailScreen() {
  const route = useRoute<DeviceDetailRouteProp>();
  const navigation = useNavigation<DeviceDetailNavProp>();
  const insets = useSafeAreaInsets();
  const { deviceId } = route.params;

  const { data: device, isLoading, isError, error } = useDeviceDetailQuery(deviceId);
  const updateDeviceMutation = useUpdateDeviceMutation();
  const { mutate: updateDevice, isPending: isSaving } = updateDeviceMutation;
  const unpairDeviceMutation = useUnpairDevice();

  // Device commands hooks
  const {
    data: commands,
    isLoading: isCommandsLoading,
    isError: isCommandsError,
  } = useDeviceCommandsQuery(deviceId);

  const { mutate: sendCommand, isPending: isSending } = useSendDeviceCommandMutation({
    onSuccess: () => {
      Alert.alert('완료', '기기에 명령을 전송했어요.');
    },
    onError: () => {
      Alert.alert('오류', '기기에 명령을 전송하지 못했어요.');
    },
  });

  useEffect(() => {
    if (updateDeviceMutation.isSuccess) {
      Alert.alert('완료', '기기 정보가 저장되었어요.');
    }
  }, [updateDeviceMutation.isSuccess]);

  useEffect(() => {
    if (updateDeviceMutation.isError) {
      Alert.alert('오류', '기기 정보를 저장하는 데 실패했어요.');
    }
  }, [updateDeviceMutation.isError]);

  const [name, setName] = useState('');
  const [commandTemperature, setCommandTemperature] = useState('22');
  const [commandInterval, setCommandInterval] = useState('5');

  useEffect(() => {
    if (device) {
      setName(device.deviceName ?? '');
    }
  }, [device]);

  const handleSave = () => {
    if (!device) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('오류', '기기 이름을 입력해주세요.');
      return;
    }

    if (trimmedName === device.deviceName) {
      Alert.alert('알림', '변경된 내용이 없어요.');
      return;
    }

    updateDevice({
      deviceId: device.deviceId,
      payload: {
        deviceName: trimmedName,
      },
    });
  };

  // 기기 삭제 (페어링 해제 + 로컬 삭제)
  const handleDelete = () => {
    if (!device) return;

    Alert.alert(
      '기기 삭제',
      `"${device.deviceName}" 기기를 삭제하시겠어요?\n\n이 작업은 되돌릴 수 없어요.`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              // 서버에서 페어링 해제
              await unpairDeviceMutation.mutateAsync(device.deviceId);
              // 로컬 스토리지에서도 삭제
              await clearPairedDevice();
              console.log('[DeviceDetailScreen] 기기 삭제 완료:', device.deviceId);
              Alert.alert('완료', '기기가 삭제되었어요.', [
                {
                  text: '확인',
                  onPress: () => {
                    // 이전 화면으로 돌아가기
                    if (navigation.canGoBack()) {
                      navigation.goBack();
                    }
                  },
                },
              ]);
            } catch (error) {
              console.error('[DeviceDetailScreen] 기기 삭제 실패:', error);
              Alert.alert('오류', '기기를 삭제하는 데 실패했어요.');
            }
          },
        },
      ],
    );
  };

  const handleStart = () => {
    const temp = Number(commandTemperature);
    const interval = Number(commandInterval);
    sendCommand({
      deviceId,
      body: {
        commandType: 'START',
        temperature: Number.isNaN(temp) ? undefined : temp,
        intervalSeconds: Number.isNaN(interval) ? undefined : interval,
        extraPayload: {
          custom: true,
        },
      },
    });
  };

  const handleStop = () => {
    sendCommand({
      deviceId,
      body: {
        commandType: 'STOP',
        extraPayload: {
          custom: true,
        },
      },
    });
  };

  const renderStatusBadge = (status: string, type: 'connection' | 'device') => {
    const isOnline = type === 'connection' && status === 'ONLINE';
    const isProcessing = type === 'device' && status === 'PROCESSING';
    const backgroundColor = isOnline ? colors.success : isProcessing ? '#6366f1' : colors.mutedText;

    const label =
      type === 'connection'
        ? status === 'ONLINE'
          ? '온라인'
          : '오프라인'
        : status === 'PROCESSING'
          ? '처리 중'
          : status === 'IDLE'
            ? '대기 중'
            : status;

    return (
      <View style={[styles.badge, { backgroundColor }]}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    );
  };

  const formatHeartbeat = (iso: string | null) => {
    if (!iso) return '마지막 신호 없음';
    try {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return iso;
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const formatCommandStatus = (status: string) => {
    if (status === 'ACKED') return '전송 완료';
    if (status === 'PENDING') return '대기 중';
    if (status === 'FAILED') return '전송 실패';
    return status;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <LoadingSpinner message="기기 정보를 불러오는 중이에요..." />
      </SafeAreaView>
    );
  }

  if (isError || !device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <AppHeader
            title="기기 상세"
            onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
          />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>기기 정보를 불러오는 데 실패했습니다.</Text>
          {error?.message ? <Text style={styles.errorSubText}>{error.message}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="기기 상세"
        onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>기기 상세 정보</Text>

        {/* Device ID */}
        <View style={styles.section}>
          <Text style={styles.label}>기기 ID</Text>
          <Text style={styles.valueMono}>{device.deviceId}</Text>
        </View>

        {/* Device Name (editable) */}
        <View style={styles.section}>
          <Text style={styles.label}>기기 이름</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="기기 이름을 입력하세요"
            style={styles.textInput}
            editable={!isSaving}
          />
        </View>

        {/* Statuses */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionHalf}>
            <Text style={styles.label}>연결 상태</Text>
            {renderStatusBadge(device.connectionStatus ?? '', 'connection')}
          </View>
          <View style={styles.sectionHalf}>
            <Text style={styles.label}>동작 상태</Text>
            {renderStatusBadge(device.deviceStatus ?? '', 'device')}
          </View>
        </View>

        {/* Last heartbeat */}
        <View style={styles.section}>
          <Text style={styles.label}>마지막 신호</Text>
          <Text style={styles.value}>{formatHeartbeat(device.lastHeartbeat ?? null)}</Text>
        </View>

        {/* Save button */}
        <View style={styles.footer}>
          <PrimaryButton
            label={isSaving ? '저장 중...' : '저장'}
            onPress={handleSave}
            disabled={isSaving || name.trim() === device.deviceName}
          />
        </View>

        {/* Device control section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기기 제어</Text>
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>온도 (°C)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={commandTemperature}
                onChangeText={setCommandTemperature}
                editable={!isSending}
                placeholder="22"
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>인터벌 (초)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={commandInterval}
                onChangeText={setCommandInterval}
                editable={!isSending}
                placeholder="5"
              />
            </View>
          </View>
          <View style={styles.row}>
            <Pressable
              style={[styles.controlButton, isSending && styles.controlButtonDisabled]}
              onPress={handleStart}
              disabled={isSending}
            >
              <Text style={styles.controlButtonText}>가동 시작</Text>
            </Pressable>
            <Pressable
              style={[styles.controlButtonSecondary, isSending && styles.controlButtonDisabled]}
              onPress={handleStop}
              disabled={isSending}
            >
              <Text style={styles.controlButtonSecondaryText}>정지</Text>
            </Pressable>
          </View>
        </View>

        {/* Command history section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>명령 이력</Text>
          {isCommandsLoading && (
            <View style={styles.historyState}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.helperText}>명령 이력을 불러오는 중이에요...</Text>
            </View>
          )}
          {isCommandsError && !isCommandsLoading && (
            <Text style={styles.errorText}>명령 이력을 불러오지 못했습니다.</Text>
          )}
          {!isCommandsLoading && !isCommandsError && (!commands || commands.length === 0) && (
            <Text style={styles.helperText}>아직 전송된 명령이 없어요.</Text>
          )}
          {!isCommandsLoading && !isCommandsError && commands && commands.length > 0 && (
            <View style={styles.commandList}>
              {commands.map((cmd) => (
                <View key={cmd.id} style={styles.commandItem}>
                  <View style={styles.commandHeaderRow}>
                    <Text style={styles.commandType}>{cmd.commandType}</Text>
                    <Text
                      style={[
                        styles.commandStatus,
                        cmd.status === 'ACKED' && styles.commandStatusAcked,
                        cmd.status === 'PENDING' && styles.commandStatusPending,
                      ]}
                    >
                      {formatCommandStatus(cmd.status)}
                    </Text>
                  </View>
                  <Text style={styles.commandPayload}>
                    온도: {cmd.payload.temperature ?? '-'}°C | 인터벌:{' '}
                    {cmd.payload.intervalSeconds ?? '-'}초
                  </Text>
                  <Text style={styles.commandTime}>
                    {cmd.sentAt
                      ? new Date(cmd.sentAt).toLocaleString('ko-KR')
                      : new Date(cmd.createdAt).toLocaleString('ko-KR')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Food input sessions timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>음식 투입 기록</Text>
          <FoodSessionTimeline deviceId={deviceId} />
        </View>

        {/* Delete button */}
        <View style={styles.deleteSection}>
          <Pressable
            style={[
              styles.deleteButton,
              unpairDeviceMutation.isPending && styles.deleteButtonDisabled,
            ]}
            onPress={handleDelete}
            disabled={unpairDeviceMutation.isPending}
          >
            <Text style={styles.deleteButtonText}>
              {unpairDeviceMutation.isPending ? '삭제 중...' : '기기 삭제'}
            </Text>
          </Pressable>
          <Text style={styles.deleteWarningText}>
            기기를 삭제하면 페어링이 해제되고 로컬에서도 제거됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  commandHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  commandItem: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
  },
  commandList: {
    gap: spacing.md,
  },
  commandPayload: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
  },
  commandStatus: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  commandStatusAcked: {
    color: colors.success,
  },
  commandStatusPending: {
    color: colors.warning,
  },
  commandTime: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
  },
  commandType: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  controlButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlButtonSecondary: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  controlButtonSecondaryText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  controlButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingVertical: spacing.md,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  deleteSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
  },
  deleteWarningText: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorSubText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  footer: {
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  half: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  helperText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  historyState: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  label: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHalf: {
    flex: 1,
  },
  sectionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  textInput: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.sizes.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xl,
  },
  value: {
    color: colors.text,
    fontSize: typography.sizes.md,
  },
  valueMono: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
  },
});
