/**
 * Sensor Summary Card 컴포넌트
 * 센서 리포트의 요약 정보를 표시하는 카드 UI입니다.
 */

import React from 'react';

import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import type { SensorSummary } from '@/api/types/reports';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type SensorSummaryCardProps = {
  /**
   * 센서 리포트 요약 정보
   */
  summary: SensorSummary | null;
  /**
   * 센서 이름 라벨 (예: "습도", "온도" 등)
   */
  label: string;
  /**
   * 값의 단위 (예: "%", "°C", "kg" 등)
   */
  unit?: string;
  /**
   * 추가 스타일
   */
  style?: ViewStyle;
};

/**
 * 센서 리포트 요약 카드 컴포넌트
 *
 * @example
 * ```tsx
 * <SensorSummaryCard
 *   summary={reportData.summary}
 *   label="습도"
 *   unit="%"
 * />
 * ```
 */
export function SensorSummaryCard({ summary, label, unit, style }: SensorSummaryCardProps) {
  // summary가 null이거나 값이 없을 때 처리
  if (!summary) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.emptyText}>데이터가 없습니다.</Text>
      </View>
    );
  }

  const { current, max, min, average, referenceDate } = summary;

  // 값이 0이거나 유효하지 않을 때도 안전하게 처리
  const formatValue = (value: number | undefined | null): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return '-';
    }
    return String(value);
  };

  return (
    <View style={[styles.container, style]}>
      {/* 헤더: label + referenceDate */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {label} · {referenceDate || '-'}
        </Text>
      </View>

      {/* 현재 값 (크게 표시) */}
      <View style={styles.currentSection}>
        <Text style={styles.currentLabel}>현재</Text>
        <Text style={styles.currentValue}>
          {formatValue(current)}
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </Text>
      </View>

      {/* 요약 정보 */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>최대:</Text>
          <Text style={styles.summaryValue}>
            {formatValue(max?.value)} {max?.time ? `(${max.time})` : ''}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>최소:</Text>
          <Text style={styles.summaryValue}>
            {formatValue(min?.value)} {min?.time ? `(${min.time})` : ''}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>평균:</Text>
          <Text style={styles.summaryValue}>{formatValue(average)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginVertical: spacing.md,
    padding: spacing.lg,
  },
  currentLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    marginBottom: spacing.xs,
  },
  currentSection: {
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  currentValue: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    paddingVertical: spacing.xl,
    textAlign: 'center',
  },
  header: {
    marginBottom: spacing.sm,
  },
  headerText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  summaryLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    marginRight: spacing.md,
  },
  summaryRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  summarySection: {
    marginTop: spacing.md,
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  unit: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.regular,
  },
});
