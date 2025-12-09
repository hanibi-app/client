import React, { useEffect, useState } from 'react';

import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
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
import { FoodSessionTimeline } from '@/components/food/FoodSessionTimeline';
import { ROOT_ROUTES } from '@/constants/routes';
import {
  useDeviceDetailQuery,
  useUnpairDevice,
  useUpdateDeviceMutation,
} from '@/features/devices/hooks';
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
          <View style={styles.nameRow}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="기기 이름을 입력하세요"
              style={styles.nameInput}
              editable={!isSaving}
            />
            <Pressable
              style={[
                styles.saveButton,
                (isSaving || name.trim() === device.deviceName) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSaving || name.trim() === device.deviceName}
            >
              <Text style={styles.saveButtonText}>{isSaving ? '저장 중...' : '저장'}</Text>
            </Pressable>
          </View>
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
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
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
  headerContainer: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
  },
  nameInput: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.md,
    marginRight: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
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
