import React, { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { DeviceProcessingStatus } from '@/api/types/devices';
import { ROOT_ROUTES } from '@/constants/routes';
import { useDevice } from '@/features/devices/hooks';
import { useFoodSessions } from '@/hooks/useFoodSessions';
import { RootStackParamList } from '@/navigation/types';
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

  // 최신 기기 정보 조회 (모달이 열려있을 때만 폴링 - 최적화)
  const { data: latestDevice, refetch: refetchDevice } = useDevice(deviceId || '', {
    refetchInterval: visible ? 30000 : false, // 모달이 열려있을 때만 30초마다 폴링 (429 에러 방지)
  });

  // 기기 정보가 없으면 에러 메시지 표시
  const hasDevice = !!deviceId;

  // 최신 기기 정보를 우선적으로 사용 (props보다 우선)
  const actualConnectionStatus = latestDevice?.connectionStatus || connectionStatus || 'OFFLINE';
  const actualDeviceName = latestDevice?.deviceName || deviceName || '한니비 기기';

  // 동작 상태는 deviceStatus로 받음 (DeviceStatusCard와 동일한 로직)
  const rawDeviceStatus = latestDevice?.deviceStatus || 'IDLE';
  const actualDeviceStatus = (
    typeof rawDeviceStatus === 'string' ? rawDeviceStatus.toUpperCase() : 'IDLE'
  ) as DeviceProcessingStatus;

  // 음식 투입 세션 조회 (최근 1개만) - 모달이 열려있을 때만 자동 갱신
  const {
    data: sessions,
    isLoading: isSessionsLoading,
    refetch: refetchSessions,
  } = useFoodSessions(deviceId || '', {
    refetchInterval: visible ? 30000 : false, // 모달이 열려있을 때만 30초마다 폴링 (429 에러 방지)
    enabled: visible && !!deviceId, // 모달이 열려있고 deviceId가 있을 때만 조회
  });
  const latestSession = sessions && sessions.length > 0 ? sessions[0] : null;

  // 모달이 열릴 때마다 즉시 데이터 갱신
  useEffect(() => {
    if (visible && deviceId) {
      console.log('[DeviceControlModal] 모달 열림 - 즉시 세션 데이터 갱신');
      refetchSessions();
    }
  }, [visible, deviceId, refetchSessions]);

  // 디버깅: 세션 데이터 확인
  useEffect(() => {
    if (visible && __DEV__) {
      console.log('[DeviceControlModal] 음식 투입 세션 데이터:', {
        deviceId,
        sessionsCount: sessions?.length || 0,
        latestSession: latestSession
          ? {
              sessionId: latestSession.sessionId,
              status: latestSession.status,
              startedAt: latestSession.startedAt,
              beforeEvent: latestSession.beforeEvent?.eventType,
              afterEvent: latestSession.afterEvent?.eventType,
            }
          : null,
        isLoading: isSessionsLoading,
      });
    }
  }, [visible, deviceId, sessions, latestSession, isSessionsLoading]);

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

  const handleViewDetails = () => {
    if (!deviceId) return;
    onClose();
    navigation.navigate(ROOT_ROUTES.DEVICE_DETAIL, { deviceId });
  };

  /**
   * 처리 상태에 따른 배지 색상 및 텍스트 (DeviceStatusCard와 동일한 로직)
   */
  const getStatusBadgeConfig = (status: DeviceProcessingStatus) => {
    switch (status) {
      case 'IDLE':
        return {
          label: '대기 중',
          backgroundColor: colors.gray100,
          textColor: colors.text,
        };
      case 'PROCESSING':
        return {
          label: '처리 중',
          backgroundColor: '#8B5CF6', // 보라색 계열
          textColor: colors.white,
        };
      case 'ERROR':
        return {
          label: '오류',
          backgroundColor: colors.danger,
          textColor: colors.white,
        };
      default:
        return {
          label: '알 수 없음',
          backgroundColor: colors.gray100,
          textColor: colors.text,
        };
    }
  };

  const renderStatusBadge = (status: string, type: 'connection' | 'device') => {
    if (type === 'connection') {
      const isOnline = status === 'ONLINE';
      return (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isOnline ? colors.success : colors.mutedText,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: isOnline ? colors.white : colors.text }]}>
            {isOnline ? '온라인' : '오프라인'}
          </Text>
        </View>
      );
    }

    // device 상태는 DeviceStatusCard와 동일한 로직 사용
    const deviceStatus = (
      typeof status === 'string' ? status.toUpperCase() : 'IDLE'
    ) as DeviceProcessingStatus;
    const statusConfig = getStatusBadgeConfig(deviceStatus);

    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: statusConfig.backgroundColor,
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: statusConfig.textColor,
            },
          ]}
        >
          {statusConfig.label}
        </Text>
      </View>
    );
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
            <Text style={styles.title}>기기 정보</Text>
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

            {/* 기기 정보 섹션 */}
            {hasDevice && (
              <>
                {/* 기기 ID */}
                <View style={styles.section}>
                  <Text style={styles.label}>기기 ID</Text>
                  <Text style={styles.valueMono}>{deviceId}</Text>
                </View>

                {/* 기기 이름 */}
                <View style={styles.section}>
                  <Text style={styles.label}>기기 이름</Text>
                  <Text style={styles.value}>{actualDeviceName}</Text>
                </View>

                {/* 연결 상태 & 동작 상태 */}
                <View style={styles.sectionRow}>
                  <View style={styles.sectionHalf}>
                    <Text style={styles.label}>연결 상태</Text>
                    {renderStatusBadge(actualConnectionStatus, 'connection')}
                  </View>
                  <View style={styles.sectionHalf}>
                    <Text style={styles.label}>동작 상태</Text>
                    {renderStatusBadge(actualDeviceStatus, 'device')}
                  </View>
                </View>

                {/* 최근 음식 투입 기록 */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>최근 음식 투입 기록</Text>
                  {isSessionsLoading && (
                    <View style={styles.historyState}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text style={styles.helperText}>기록을 불러오는 중이에요...</Text>
                    </View>
                  )}
                  {!isSessionsLoading && !latestSession && (
                    <Text style={styles.helperText}>아직 기록된 음식 투입 세션이 없어요.</Text>
                  )}
                  {!isSessionsLoading && latestSession && (
                    <View style={styles.sessionCard}>
                      <View style={styles.sessionHeader}>
                        <Text style={styles.sessionTitle}>음식 투입 세션</Text>
                        <View style={styles.badgeContainer}>
                          {latestSession.status === 'in_progress' ? (
                            <View style={[styles.badge, styles.badgeInProgress]}>
                              <Text style={styles.badgeText}>진행 중</Text>
                            </View>
                          ) : (
                            <View style={[styles.badge, styles.badgeCompleted]}>
                              <Text style={styles.badgeText}>완료</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Text style={styles.sessionTime}>
                        {formatRelativeTime(latestSession.startedAt)}
                      </Text>
                      {latestSession.weightChange && (
                        <View style={styles.weightRow}>
                          {latestSession.weightChange.before !== undefined && (
                            <Text style={styles.weightText}>
                              투입 전: {latestSession.weightChange.before}g
                            </Text>
                          )}
                          {latestSession.weightChange.after !== undefined && (
                            <Text style={styles.weightText}>
                              투입 후: {latestSession.weightChange.after}g
                            </Text>
                          )}
                          {latestSession.weightChange.diff !== undefined && (
                            <Text
                              style={[
                                styles.weightText,
                                latestSession.weightChange.diff > 0 && styles.weightPositive,
                                latestSession.weightChange.diff < 0 && styles.weightNegative,
                              ]}
                            >
                              변화량: {latestSession.weightChange.diff > 0 ? '+' : ''}
                              {latestSession.weightChange.diff}g
                            </Text>
                          )}
                        </View>
                      )}
                      <Pressable style={styles.viewDetailsButton} onPress={handleViewDetails}>
                        <Text style={styles.viewDetailsButtonText}>자세히 보기 &gt;</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </>
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
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeCompleted: {
    backgroundColor: colors.success + '20',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  badgeInProgress: {
    backgroundColor: colors.warning + '20',
  },
  badgeText: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
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
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
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
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
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
  sessionCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sessionTime: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
  },
  sessionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
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
  weightNegative: {
    color: colors.danger,
  },
  weightPositive: {
    color: colors.success,
  },
  weightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  weightText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
  },
});
