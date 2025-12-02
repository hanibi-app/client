import React from 'react';

import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Device } from '@/api/devices';
import AppHeader from '@/components/common/AppHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useDevices } from '@/features/devices/hooks';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.5)';

type DeviceListModalProps = {
  visible: boolean;
  onClose: () => void;
};

type DeviceCardProps = {
  device: Device;
};

function DeviceCard({ device }: DeviceCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '없음';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '없음';
    }
  };

  const getConnectionStatusColor = (status: string) => {
    if (status === 'ONLINE') return colors.success;
    if (status === 'OFFLINE') return colors.danger;
    return colors.mutedText;
  };

  const getDeviceStatusText = (status: string) => {
    if (status === 'IDLE') return '대기 중';
    if (status === 'PROCESSING') return '처리 중';
    return status;
  };

  return (
    <View style={styles.deviceCard}>
      <View style={styles.deviceCardHeader}>
        <Text style={styles.deviceName}>{device.deviceName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getConnectionStatusColor(device.connectionStatus) },
          ]}
        >
          <Text style={styles.statusBadgeText}>{device.connectionStatus}</Text>
        </View>
      </View>
      <View style={styles.deviceCardBody}>
        <View style={styles.deviceInfoRow}>
          <Text style={styles.deviceInfoLabel}>기기 ID:</Text>
          <Text style={styles.deviceInfoValue}>{device.deviceId}</Text>
        </View>
        <View style={styles.deviceInfoRow}>
          <Text style={styles.deviceInfoLabel}>기기 상태:</Text>
          <Text style={styles.deviceInfoValue}>{getDeviceStatusText(device.deviceStatus)}</Text>
        </View>
        <View style={styles.deviceInfoRow}>
          <Text style={styles.deviceInfoLabel}>마지막 연결:</Text>
          <Text style={styles.deviceInfoValue}>{formatDate(device.lastHeartbeat)}</Text>
        </View>
      </View>
    </View>
  );
}

export default function DeviceListModal({ visible, onClose }: DeviceListModalProps) {
  const insets = useSafeAreaInsets();
  const { data: devices, isLoading, error } = useDevices();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
          <AppHeader title="연결된 기기" onBack={onClose} />

          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner message="기기 목록을 불러오는 중..." />
              </View>
            ) : error ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>기기 목록을 불러오는데 실패했습니다.</Text>
                <Text style={styles.emptySubText}>
                  {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
                </Text>
              </View>
            ) : !devices || devices.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>연결된 기기가 없습니다.</Text>
                <Text style={styles.emptySubText}>설정에서 기기를 페어링해주세요.</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.deviceList}
                contentContainerStyle={styles.deviceListContent}
                showsVerticalScrollIndicator={false}
              >
                {devices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKDROP_COLOR,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  deviceCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: spacing.md,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  deviceCardBody: {
    marginTop: spacing.md,
  },
  deviceCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceInfoLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginRight: spacing.sm,
  },
  deviceInfoRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  deviceInfoValue: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  deviceList: {
    flex: 1,
  },
  deviceListContent: {
    paddingBottom: spacing.xl,
  },
  deviceName: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptySubText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    maxHeight: '90%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusBadgeText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
});
