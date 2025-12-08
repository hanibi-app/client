/**
 * 주간 성과 요약 섹션 컴포넌트
 * 이번 주 vs 지난 주의 처리량/CO₂ 절감/에너지 효율을 비교해서 보여줍니다.
 */

import React from 'react';

import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useWeeklySummary } from '@/features/reports/hooks/useWeeklySummary';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type WeeklySummarySectionProps = {
  /**
   * 추가 스타일
   */
  style?: ViewStyle;
};

/**
 * 날짜를 "MM.DD" 형식으로 포맷팅합니다.
 * @param dateString ISO 날짜 문자열
 * @returns "MM.DD" 형식의 문자열
 */
function formatWeekDate(dateString: string): string {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}.${day}`;
}

/**
 * 변화율을 퍼센트 문자열로 변환합니다.
 * @param changeRate 소수점 형태의 변화율 (예: 0.2 → "20%")
 * @returns 퍼센트 문자열 (소수점 두 자리 이하 반올림)
 */
function formatChangeRate(changeRate: number): string {
  const percentage = changeRate * 100;
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
}

/**
 * 주간 성과 요약 섹션 컴포넌트
 *
 * @example
 * ```tsx
 * <WeeklySummarySection />
 * ```
 */
export function WeeklySummarySection({ style }: WeeklySummarySectionProps) {
  const { data, isLoading, isError } = useWeeklySummary();

  // 로딩 상태
  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.title}>이번 주 성과 요약</Text>
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner message="주간 데이터를 불러오는 중..." size="small" />
        </View>
      </View>
    );
  }

  // 에러 상태
  if (isError || !data) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.title}>이번 주 성과 요약</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>주간 성과 요약을 불러오지 못했습니다.</Text>
        </View>
      </View>
    );
  }

  const weekRange = `${formatWeekDate(data.weekStart)} ~ ${formatWeekDate(data.weekEnd)}`;

  // 메트릭 데이터
  const metrics = [
    {
      label: '처리량',
      value: data.processedAmount.value,
      previousValue: data.processedAmount.previousValue,
      changeRate: data.processedAmount.changeRate,
      unit: 'kg',
    },
    {
      label: 'CO₂ 절감',
      value: data.co2Savings.value,
      previousValue: data.co2Savings.previousValue,
      changeRate: data.co2Savings.changeRate,
      unit: 'kg',
    },
    {
      label: '에너지 효율',
      value: data.energyEfficiency.value,
      previousValue: data.energyEfficiency.previousValue,
      changeRate: data.energyEfficiency.changeRate,
      unit: '%',
    },
  ];

  return (
    <View style={[styles.container, style]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>이번 주 성과 요약</Text>
      </View>

      {/* 주간 기간 표시 */}
      <View style={styles.weekRangeContainer}>
        <Text style={styles.weekRangeText}>{weekRange}</Text>
      </View>

      {/* 메트릭 리스트 */}
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => {
          const isPositive = metric.changeRate >= 0;
          const changeRateText = formatChangeRate(metric.changeRate);

          return (
            <View key={index} style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View
                  style={[
                    styles.changeRateContainer,
                    {
                      backgroundColor: isPositive ? colors.success + '20' : colors.danger + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.changeRateText,
                      {
                        color: isPositive ? colors.success : colors.danger,
                      },
                    ]}
                  >
                    {isPositive ? '▲' : '▼'} {changeRateText}
                  </Text>
                </View>
              </View>

              <View style={styles.metricValues}>
                <View style={styles.metricValueContainer}>
                  <Text style={styles.metricValueLabel}>이번 주</Text>
                  <Text style={styles.metricValue}>
                    {metric.value.toFixed(1)} {metric.unit}
                  </Text>
                </View>
                <View style={styles.metricValueContainer}>
                  <Text style={styles.metricValueLabel}>지난 주</Text>
                  <Text style={styles.metricPreviousValue}>
                    {metric.previousValue.toFixed(1)} {metric.unit}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  changeRateContainer: {
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  changeRateText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 4,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '100%',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    paddingVertical: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  header: {
    marginBottom: spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    paddingVertical: spacing.md,
  },
  metricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metricItem: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
  },
  metricLabel: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  metricPreviousValue: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  metricValueContainer: {
    flex: 1,
  },
  metricValueLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginBottom: spacing.xs,
  },
  metricValues: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricsContainer: {
    marginTop: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  weekRangeContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  weekRangeText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
});
