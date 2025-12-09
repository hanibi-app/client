import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ROOT_ROUTES } from '@/constants/routes';
import { useDevice, usePairDevice } from '@/features/devices/hooks';
import { useDeviceCommandsQuery, useSendDeviceCommandMutation } from '@/hooks/useDeviceCommands';
import { RootStackParamList } from '@/navigation/types';
import { setPairedDevice } from '@/services/storage/deviceStorage';
import { useDeviceStore } from '@/store/deviceStore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

type DeviceControlModalNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof ROOT_ROUTES.DEVICE_DETAIL | typeof ROOT_ROUTES.DEVICE_PAIRING_MODAL
>;

type DeviceControlModalProps = {
  visible: boolean;
  deviceId: string | null;
  deviceName?: string;
  connectionStatus?: 'ONLINE' | 'OFFLINE' | string;
  lastHeartbeat?: string | null;
  onClose: () => void;
};

export default function DeviceControlModal({
  visible,
  deviceId,
  deviceName,
  connectionStatus,
  lastHeartbeat,
  onClose,
}: DeviceControlModalProps) {
  const navigation = useNavigation<DeviceControlModalNavProp>();
  const pairDeviceMutation = usePairDevice();
  const queryClient = useQueryClient();
  const { setCurrentDeviceId } = useDeviceStore();

  // 최신 기기 정보 조회 (모달이 열려있을 때만 폴링 - 최적화)
  const { data: latestDevice, refetch: refetchDevice } = useDevice(deviceId || '', {
    refetchInterval: visible ? 30000 : false, // 모달이 열려있을 때만 30초마다 폴링
  });

  // 기기 정보가 없으면 에러 메시지 표시
  const hasDevice = !!deviceId;

  // 최신 기기 정보를 우선적으로 사용 (props보다 우선)
  const actualConnectionStatus = latestDevice?.connectionStatus || connectionStatus || 'OFFLINE';
  const actualLastHeartbeat = latestDevice?.lastHeartbeat || lastHeartbeat || null;
  const actualDeviceName = latestDevice?.deviceName || deviceName || '한니비 기기';
  const isOnline = actualConnectionStatus === 'ONLINE';

  // 디버깅: deviceId 확인
  useEffect(() => {
    if (visible) {
      console.log('[DeviceControlModal] 모달 열림:', {
        deviceId,
        deviceName: actualDeviceName,
        connectionStatus: actualConnectionStatus,
        hasDevice,
        latestDevice: latestDevice?.connectionStatus,
      });
    }
  }, [visible, deviceId, actualDeviceName, actualConnectionStatus, hasDevice, latestDevice]);

  // 명령 이력 조회 (deviceId가 있을 때만)
  const {
    data: commands,
    isLoading: isCommandsLoading,
    isError: isCommandsError,
  } = useDeviceCommandsQuery(deviceId || '', {
    enabled: visible && !!deviceId,
  });

  // 최근 명령 1개만 표시
  const latestCommand = commands && commands.length > 0 ? commands[0] : null;

  const handleViewDetails = () => {
    if (!deviceId) return;
    onClose();
    navigation.navigate(ROOT_ROUTES.DEVICE_DETAIL, { deviceId });
  };

  const { mutate: sendCommand, isPending: isSending } = useSendDeviceCommandMutation({
    onSuccess: () => {
      Alert.alert('완료', '명령이 전송되었어요.');
    },
    onError: (error) => {
      console.error('[DeviceControlModal] 명령 전송 실패:', error);
      Alert.alert('오류', '기기에 명령을 전송하지 못했어요.');
    },
  });

  const [commandTemperature, setCommandTemperature] = useState('22');
  const [commandInterval, setCommandInterval] = useState('5');

  const handleStart = () => {
    if (!deviceId || !isOnline) return;

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
    if (!deviceId || !isOnline) return;

    const temp = Number(commandTemperature);
    const interval = Number(commandInterval);
    // 정지 명령에서도 온도와 인터벌은 참고용으로 전송 (필요 없으면 생략 가능)
    sendCommand({
      deviceId,
      body: {
        commandType: 'STOP',
        temperature: Number.isNaN(temp) ? undefined : temp,
        intervalSeconds: Number.isNaN(interval) ? undefined : interval,
        extraPayload: {
          custom: true,
        },
      },
    });
  };

  // 버튼 비활성화 조건: 전송 중이거나, 기기가 없거나, 오프라인일 때
  const isButtonDisabled = isSending || !hasDevice || !isOnline;

  // 페어링 시작 핸들러
  const handleStartPairing = async () => {
    if (!deviceId || !actualDeviceName) {
      Alert.alert('오류', '기기 정보가 없어요.');
      return;
    }

    try {
      const device = await pairDeviceMutation.mutateAsync({
        deviceId,
        deviceName: actualDeviceName,
      });

      // 페어링 성공 시 로컬 저장소에 저장
      await setPairedDevice({
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        apiSynced: true,
        syncedAt: new Date().toISOString(),
      });

      // 페어링 성공 시 deviceStore에 현재 기기 ID 설정
      setCurrentDeviceId(device.deviceId);

      // 기기 정보 쿼리 무효화하여 최신 정보 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['devices', deviceId] });
      queryClient.invalidateQueries({ queryKey: ['devices'] });

      // 기기 정보 즉시 refetch
      await refetchDevice();

      Alert.alert('완료', '기기 페어링이 완료되었어요.');
      // 모달은 닫지 않고 최신 상태로 업데이트
    } catch (error) {
      console.error('[DeviceControlModal] 페어링 실패:', error);
      Alert.alert('오류', '기기 페어링에 실패했어요.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      statusBarTranslucent={true}
    >
      <View
        style={styles.backdrop}
        accessibilityViewIsModal={true}
        importantForAccessibility="no-hide-descendants"
        {...(Platform.OS === 'web' && { 'aria-hidden': false })}
      >
        <View
          style={styles.card}
          accessibilityLabel="기기 제어"
          {...(Platform.OS === 'web' && { 'aria-hidden': false })}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>기기 제어</Text>
            <Text style={styles.deviceName}>{actualDeviceName}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
          >
            {/* 연결된 기기가 없을 때 */}
            {!hasDevice && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>연결된 기기가 없어요.</Text>
              </View>
            )}

            {/* 연결 상태 섹션 */}
            {hasDevice && (
              <View style={styles.section}>
                {isOnline ? (
                  <View style={styles.connectionStatusOnline}>
                    <Text style={styles.connectionStatusText}>
                      상태: 온라인 · 마지막 신호: {formatRelativeTime(actualLastHeartbeat)}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.connectionStatusOffline}>
                    <View style={styles.connectionStatusOfflineRow}>
                      <Text style={styles.connectionStatusWarningText}>기기가 오프라인이에요.</Text>
                      <Pressable
                        style={[
                          styles.pairingButton,
                          pairDeviceMutation.isPending && styles.pairingButtonDisabled,
                        ]}
                        onPress={handleStartPairing}
                        disabled={pairDeviceMutation.isPending}
                      >
                        <Text style={styles.pairingButtonText}>
                          {pairDeviceMutation.isPending ? '페어링 중...' : '페어링 시작'}
                        </Text>
                      </Pressable>
                    </View>
                    <Text style={styles.connectionStatusSubText}>
                      전원과 네트워크를 확인한 뒤 다시 시도해 주세요.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* 기기 제어 섹션 */}
            {hasDevice && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>기기 제어</Text>
                <View style={styles.row}>
                  <View style={styles.half}>
                    <Text style={styles.label}>온도 (℃)</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      value={commandTemperature}
                      onChangeText={setCommandTemperature}
                      editable={!isSending && isOnline}
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
                      editable={!isSending && isOnline}
                      placeholder="5"
                    />
                  </View>
                </View>
                {!isOnline && (
                  <Text style={styles.offlineWarningText}>
                    기기가 오프라인 상태라 명령을 전송할 수 없어요.
                  </Text>
                )}
                <View style={styles.row}>
                  <Pressable
                    style={[styles.controlButton, isButtonDisabled && styles.controlButtonDisabled]}
                    onPress={handleStart}
                    disabled={isButtonDisabled}
                  >
                    <Text style={styles.controlButtonText}>가동 시작</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.controlButtonSecondary,
                      isButtonDisabled && styles.controlButtonDisabled,
                    ]}
                    onPress={handleStop}
                    disabled={isButtonDisabled}
                  >
                    <Text style={styles.controlButtonSecondaryText}>정지</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* 최근 명령 이력 섹션 */}
            {hasDevice && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>명령 이력</Text>
                {isCommandsLoading && (
                  <View style={styles.historyState}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.helperText}>명령 이력을 불러오는 중입니다…</Text>
                  </View>
                )}
                {isCommandsError && !isCommandsLoading && (
                  <Text style={styles.errorText}>
                    명령 이력을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
                  </Text>
                )}
                {!isCommandsLoading && !isCommandsError && !latestCommand && (
                  <Text style={styles.helperText}>아직 전송된 명령이 없어요.</Text>
                )}
                {!isCommandsLoading && !isCommandsError && latestCommand && (
                  <>
                    <View style={styles.commandItem}>
                      <Text style={styles.commandLabel}>
                        최근 명령: {latestCommand.commandType === 'START' ? '가동 시작' : '정지'}
                      </Text>
                      <Text style={styles.commandPayload}>
                        설정: {latestCommand.payload.temperature ?? '-'}℃ ·{' '}
                        {latestCommand.payload.intervalSeconds ?? '-'}초
                      </Text>
                      <Text style={styles.commandStatusRow}>
                        상태: {latestCommand.status === 'ACKED' ? '전송 완료' : '대기 중'} ·{' '}
                        {latestCommand.sentAt || latestCommand.acknowledgedAt
                          ? formatRelativeTime(
                              latestCommand.sentAt || latestCommand.acknowledgedAt || null,
                            )
                          : formatRelativeTime(latestCommand.createdAt)}
                      </Text>
                    </View>
                    <Pressable style={styles.viewDetailsButton} onPress={handleViewDetails}>
                      <Text style={styles.viewDetailsButtonText}>자세히 보기 &gt;</Text>
                    </Pressable>
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: colors.text + '59', // 35% opacity
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    flexDirection: 'column',
    maxHeight: '80%',
    overflow: 'hidden',
    width: '90%',
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    width: 32,
  },
  closeButtonText: {
    color: colors.mutedText,
    fontSize: 28,
    fontWeight: typography.weights.bold,
    lineHeight: 32,
  },
  commandItem: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md,
  },
  commandLabel: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  commandPayload: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
  },
  commandStatusRow: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  connectionStatusOffline: {
    backgroundColor: colors.danger + '15',
    borderRadius: 8,
    padding: spacing.md,
  },
  connectionStatusOfflineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  connectionStatusOnline: {
    backgroundColor: colors.success + '15',
    borderRadius: 8,
    padding: spacing.md,
  },
  connectionStatusSubText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  connectionStatusText: {
    color: colors.success,
    fontSize: typography.sizes.sm,
  },
  connectionStatusWarningText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
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
  deviceName: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  half: {
    flex: 1,
  },
  header: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    padding: spacing.lg,
    paddingBottom: spacing.md,
    position: 'relative',
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
  offlineWarningText: {
    color: colors.warning,
    fontSize: typography.sizes.xs,
    marginBottom: spacing.sm,
  },
  pairingButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    elevation: 4,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  pairingButtonDisabled: {
    opacity: 0.5,
  },
  pairingButtonText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
  },
  section: {
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
  },
  viewDetailsButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  viewDetailsButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
});
