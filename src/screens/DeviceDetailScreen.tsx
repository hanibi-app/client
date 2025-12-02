import React, { useEffect, useState } from 'react';

import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PrimaryButton from '@/components/common/PrimaryButton';
import { ROOT_ROUTES } from '@/constants/routes';
import { useDeviceDetailQuery, useUpdateDeviceMutation } from '@/features/devices/hooks';
import { RootStackParamList } from '@/navigation/types';
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
    marginTop: spacing.xxl,
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
