/**
 * Sensor Report Screen
 * 센서 타입별 리포트를 조회하고 표시하는 화면입니다.
 */

import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { SensorReportChart } from '@/features/reports/components/SensorReportChart';
import { SensorSummaryCard } from '@/features/reports/components/SensorSummaryCard';
import { useSensorReport } from '@/features/reports/hooks/useSensorReport';
import { DashboardStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type SensorReportScreenProps = NativeStackScreenProps<DashboardStackParamList, 'Reports'>;

/**
 * 센서 타입 정의
 */
type SensorType = 'humidity' | 'temperature' | 'weight' | 'voc';

/**
 * 시간 범위 타입
 */
type TimeRange = '1일' | '1주' | '1개월';

/**
 * 센서 타입별 설정
 */
const SENSOR_CONFIG: Record<SensorType, { label: string; unit: string; displayName: string }> = {
  humidity: {
    label: '습도',
    unit: '%',
    displayName: '습도',
  },
  temperature: {
    label: '온도',
    unit: '°C',
    displayName: '온도',
  },
  weight: {
    label: '무게',
    unit: 'kg',
    displayName: '무게',
  },
  voc: {
    label: '향기지수',
    unit: 'ppb',
    displayName: '향기지수',
  },
};

/**
 * 센서 리포트 화면
 *
 * @example
 * ```tsx
 * <SensorReportScreen navigation={navigation} />
 * ```
 */
export default function SensorReportScreen({ navigation }: SensorReportScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<SensorType>('humidity');
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1일');

  // 센서 리포트 데이터 조회
  const { data, isLoading, isError, refetch } = useSensorReport(selectedType, selectedRange);

  const config = SENSOR_CONFIG[selectedType];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <AppHeader title="센서 리포트" onBack={handleBack} />
      </View>

      {/* 센서 타입 선택 */}
      <View style={styles.typeSelector}>
        {(Object.keys(SENSOR_CONFIG) as SensorType[]).map((type) => (
          <Pressable
            key={type}
            onPress={() => setSelectedType(type)}
            style={[styles.typeButton, selectedType === type && styles.typeButtonActive]}
          >
            <Text
              style={[styles.typeButtonText, selectedType === type && styles.typeButtonTextActive]}
            >
              {SENSOR_CONFIG[type].displayName}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 시간 범위 선택 */}
      <View style={styles.rangeSelector}>
        {(['1일', '1주', '1개월'] as TimeRange[]).map((range) => (
          <Pressable
            key={range}
            onPress={() => setSelectedRange(range)}
            style={[styles.rangeButton, selectedRange === range && styles.rangeButtonActive]}
          >
            <Text
              style={[
                styles.rangeButtonText,
                selectedRange === range && styles.rangeButtonTextActive,
              ]}
            >
              {range}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 콘텐츠 */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner message="리포트 데이터를 불러오는 중..." />
          </View>
        ) : isError || !data ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>데이터를 불러오지 못했습니다.</Text>
            <Pressable onPress={handleRefresh} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* 요약 카드 */}
            <SensorSummaryCard summary={data.summary} label={config.label} unit={config.unit} />

            {/* 차트 */}
            <SensorReportChart dataPoints={data.dataPoints} label={config.label} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    paddingVertical: spacing.xl,
  },
  errorText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  headerContainer: {
    backgroundColor: colors.background,
    position: 'relative',
    zIndex: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    paddingVertical: spacing.xl,
  },
  rangeButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rangeButtonActive: {
    backgroundColor: colors.primary,
  },
  rangeButtonText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  rangeButtonTextActive: {
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  rangeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  typeButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  typeButtonTextActive: {
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
});
