/**
 * Sensor Report Chart 컴포넌트
 * 센서 리포트의 타임시리즈 데이터를 차트로 표시하는 컴포넌트입니다.
 */

import React from 'react';

import { StyleSheet, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';

import type { SensorDataPoint } from '@/api/types/reports';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type SensorReportChartProps = {
  /**
   * 차트에 표시할 데이터 포인트 배열
   */
  dataPoints: SensorDataPoint[];
  /**
   * 센서 이름 라벨 (옵션)
   */
  label?: string;
  /**
   * 추가 스타일
   */
  style?: ViewStyle;
  /**
   * 차트 높이 (옵션, 기본값: 280)
   */
  height?: number;
};

/**
 * 센서 리포트 차트 컴포넌트
 *
 * @example
 * ```tsx
 * <SensorReportChart
 *   dataPoints={reportData.dataPoints}
 *   label="습도"
 * />
 * ```
 */
export function SensorReportChart({
  dataPoints,
  label,
  style,
  height = 280,
}: SensorReportChartProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // 데이터가 없을 때 처리
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>데이터가 없습니다.</Text>
      </View>
    );
  }

  // 차트 데이터 포맷팅 (인덱스를 x축으로 사용)
  const chartData = dataPoints.map((point, index) => ({
    x: index,
    y: point.value,
  }));

  // Y축 범위 계산
  const yValues = dataPoints.map((d) => d.value);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const yPadding = (yMax - yMin) * 0.1; // 10% 여유 공간
  const chartYMin = Math.max(0, yMin - yPadding);
  const chartYMax = yMax + yPadding;

  // Y축 틱 값 생성 (5개 정도)
  const yStep = (chartYMax - chartYMin) / 5;
  const yTickValues = Array.from({ length: 6 }, (_, i) => chartYMin + i * yStep);

  // X축 틱 값 생성 (데이터 포인트가 많으면 일부만 표시)
  const totalPoints = dataPoints.length;
  const maxXTicks = 6; // 최대 6개의 틱만 표시
  const xTickStep = Math.max(1, Math.floor(totalPoints / maxXTicks));
  const xTickIndices = Array.from(
    { length: Math.min(maxXTicks, totalPoints) },
    (_, i) => i * xTickStep,
  ).filter((idx) => idx < totalPoints);

  // X축 라벨 생성 (시간)
  const xLabels = xTickIndices.map((idx) => {
    if (idx >= 0 && idx < dataPoints.length) {
      return dataPoints[idx].time;
    }
    return '';
  });

  const CHART_WIDTH = SCREEN_WIDTH - spacing.xl * 2; // 좌우 패딩 제외

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
      <View style={styles.chartWrapper}>
        <VictoryChart
          animate={{ duration: 1000, easing: 'quadInOut' }}
          height={height}
          padding={{ top: 10, bottom: 50, left: 30, right: 65 }}
          theme={VictoryTheme.material}
          width={CHART_WIDTH}
        >
          {/* Y축 (오른쪽) */}
          <VictoryAxis
            dependentAxis
            orientation="right"
            style={{
              axis: { stroke: colors.transparent },
              grid: { stroke: colors.border, strokeWidth: 1 },
              tickLabels: { fill: colors.mutedText, fontSize: 11 },
            }}
            tickFormat={(t) => String(Math.round(t * 10) / 10)}
            tickValues={yTickValues}
          />
          {/* X축 (아래) */}
          <VictoryAxis
            style={{
              axis: { stroke: colors.transparent },
              grid: { stroke: colors.border, strokeWidth: 1 },
              tickLabels: {
                fill: colors.text,
                fontSize: 12,
                fontWeight: typography.weights.medium,
              },
            }}
            tickFormat={(t) => {
              const idx = xTickIndices.indexOf(t);
              if (idx >= 0 && idx < xLabels.length) return xLabels[idx];
              return '';
            }}
            tickValues={xTickIndices}
          />
          {/* 라인 차트 */}
          <VictoryLine
            data={chartData}
            interpolation="natural"
            style={{
              data: { stroke: colors.primary, strokeWidth: 3 },
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: spacing.xs,
    paddingBottom: 0,
  },
  container: {
    backgroundColor: colors.transparent,
    marginTop: 0,
    padding: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  label: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  labelContainer: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },
});
