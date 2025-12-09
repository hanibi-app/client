/**
 * 디바이스 상태 카드 컴포넌트
 * 디바이스의 현재 상태, 주요 센서 값, 마지막 업데이트 시간을 표시합니다.
 */

import React from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import type { DeviceProcessingStatus } from '@/api/types/devices';
import { useSensorLatest } from '@/features/dashboard/hooks/useSensorLatest';
import {
  SensorStatus,
  getGasStatus,
  getHumidityStatus,
  getTemperatureStatus,
} from '@/features/dashboard/utils/healthScore';
import { useDeviceDetail } from '@/hooks/useDeviceDetail';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

interface DeviceStatusCardProps {
  deviceId: string;
}

/**
 * 처리 상태에 따른 배지 색상 및 텍스트
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
        backgroundColor: colors.primary,
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

/**
 * 센서 값 포맷팅 (null이면 "--" 표시)
 */
const formatSensorValue = (value: number | null, unit: string): string => {
  if (value === null) {
    return '--';
  }
  return `${Math.round(value)}${unit}`;
};

/**
 * 센서 상태별 색상
 */
const STATUS_COLORS = {
  SAFE: '#40EA87', // 초록
  CAUTION: '#FFD700', // 노랑
  WARNING: '#FF7017', // 주황
  CRITICAL: '#ED5B5B', // 빨강
};

/**
 * 센서 상태에 따른 색상을 반환합니다.
 */
const getStatusColor = (status: SensorStatus): string => {
  switch (status) {
    case 'SAFE':
      return STATUS_COLORS.SAFE;
    case 'CAUTION':
      return STATUS_COLORS.CAUTION;
    case 'WARNING':
      return STATUS_COLORS.WARNING;
    default:
      return STATUS_COLORS.CRITICAL;
  }
};

/**
 * 디바이스 상태 카드 컴포넌트
 *
 * @example
 * ```tsx
 * <DeviceStatusCard deviceId="HANIBI-ESP32-001" />
 * ```
 */
export function DeviceStatusCard({ deviceId }: DeviceStatusCardProps) {
  const {
    data: deviceDetail,
    isLoading: isDeviceLoading,
    isError: isDeviceError,
  } = useDeviceDetail(deviceId);

  const {
    data: sensorData,
    isLoading: isSensorLoading,
    isError: isSensorError,
  } = useSensorLatest(deviceId);

  // 로딩 상태
  if (isDeviceLoading || isSensorLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>기기 정보를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 에러 상태
  if (isDeviceError || isSensorError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color={colors.danger} />
          <Text style={styles.errorText}>기기 정보를 불러올 수 없습니다</Text>
        </View>
      </View>
    );
  }

  // 데이터가 없는 경우
  if (!deviceDetail && !sensorData) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>데이터가 없습니다</Text>
      </View>
    );
  }

  const deviceName = deviceDetail?.name || deviceDetail?.deviceName || deviceId;
  const processingStatus = sensorData?.processingStatus || deviceDetail?.deviceStatus || 'IDLE';
  const statusConfig = getStatusBadgeConfig(processingStatus as DeviceProcessingStatus);
  const lastUpdateTime = sensorData?.timestamp || deviceDetail?.updatedAt || null;

  // 각 센서별 상태 계산
  const tempStatus = getTemperatureStatus(sensorData?.temperature ?? 0);
  const humidityStatus = getHumidityStatus(sensorData?.humidity ?? 0);
  const gasStatus = getGasStatus(sensorData?.gas ?? 0);
  // 무게는 가벼울수록 초록색 (그램 단위로 들어옴, 0에 가까울수록 좋음)
  const getWeightStatus = (weight: number | null | undefined): SensorStatus => {
    if (weight === null || weight === undefined) return 'WARNING';
    if (weight <= 1000) return 'SAFE'; // 1000g(1kg) 이하면 초록색
    if (weight <= 2000) return 'CAUTION'; // 1000~2000g(1~2kg)이면 노란색
    return 'WARNING'; // 2000g(2kg) 이상이면 주황색
  };
  const weightStatus = getWeightStatus(sensorData?.weight);

  return (
    <View style={styles.container}>
      {/* 상단 행: 디바이스 이름 + 상태 배지 */}
      <View style={styles.header}>
        <Text style={styles.deviceName} numberOfLines={1}>
          {deviceName}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusConfig.backgroundColor,
            },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              {
                color: statusConfig.textColor,
              },
            ]}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* 중간 영역: 센서 요약 (2x2 그리드) */}
      <View style={styles.sensorGrid}>
        {/* 온도 */}
        <View style={styles.sensorItem}>
          <View style={styles.sensorHeader}>
            <View style={styles.sensorLabelContainer}>
              <MaterialIcons name="thermostat" size={20} color={colors.hanibi.temp.medium} />
              <Text style={styles.sensorLabel}>온도</Text>
            </View>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: getStatusColor(tempStatus),
                },
              ]}
            />
          </View>
          <Text style={styles.sensorValue}>
            {formatSensorValue(sensorData?.temperature ?? null, '℃')}
          </Text>
        </View>

        {/* 습도 */}
        <View style={styles.sensorItem}>
          <View style={styles.sensorHeader}>
            <View style={styles.sensorLabelContainer}>
              <MaterialIcons name="water-drop" size={20} color={colors.hanibi.hum.medium} />
              <Text style={styles.sensorLabel}>습도</Text>
            </View>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: getStatusColor(humidityStatus),
                },
              ]}
            />
          </View>
          <Text style={styles.sensorValue}>
            {formatSensorValue(sensorData?.humidity ?? null, '%')}
          </Text>
        </View>

        {/* 무게 */}
        <View style={styles.sensorItem}>
          <View style={styles.sensorHeader}>
            <View style={styles.sensorLabelContainer}>
              <MaterialIcons name="scale" size={20} color={colors.mutedText} />
              <Text style={styles.sensorLabel}>무게</Text>
            </View>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: getStatusColor(weightStatus),
                },
              ]}
            />
          </View>
          <Text style={styles.sensorValue}>
            {sensorData?.weight !== null && sensorData?.weight !== undefined
              ? `${(sensorData.weight / 1000).toFixed(1)}kg`
              : '--'}
          </Text>
        </View>

        {/* 가스 */}
        <View style={styles.sensorItem}>
          <View style={styles.sensorHeader}>
            <View style={styles.sensorLabelContainer}>
              <MaterialIcons name="air" size={20} color={colors.hanibi.index.medium} />
              <Text style={styles.sensorLabel}>가스</Text>
            </View>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: getStatusColor(gasStatus),
                },
              ]}
            />
          </View>
          <Text style={styles.sensorValue}>
            {formatSensorValue(sensorData?.gas ?? null, 'ppb')}
          </Text>
        </View>
      </View>

      {/* 하단 행: 마지막 업데이트 시간 */}
      <View style={styles.footer}>
        <MaterialIcons name="schedule" size={14} color={colors.mutedText} />
        <Text style={styles.footerText}>마지막 업데이트: {formatRelativeTime(lastUpdateTime)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    elevation: 2,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deviceName: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginRight: spacing.md,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
  },
  footer: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  footerText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  sensorHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    width: '100%',
  },
  sensorItem: {
    backgroundColor: colors.gray50,
    borderRadius: 8,
    padding: spacing.md,
    width: '48%',
  },
  sensorLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  sensorLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  sensorValue: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusBadgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
});
