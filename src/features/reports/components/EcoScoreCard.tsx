/**
 * Eco Score 카드 컴포넌트
 * 환경 점수를 표시하는 카드 UI입니다.
 */

import React from 'react';

import { StyleSheet, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import Svg, { Defs, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useEcoScore } from '@/features/reports/hooks/useEcoScore';
import {
  ECO_SCORE_COLORS,
  getEcoScoreBarPosition,
  getEcoScoreColor,
  getEcoScoreLabel,
  getEcoScoreLevel,
} from '@/features/reports/utils/ecoScore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type EcoScoreCardProps = {
  /**
   * 추가 스타일
   */
  style?: ViewStyle;
  /**
   * 추가 클래스명 (웹 호환성)
   */
  className?: string;
};

/**
 * 환경 점수 카드 컴포넌트
 *
 * @example
 * ```tsx
 * <EcoScoreCard />
 * ```
 */
export function EcoScoreCard({ style, className }: EcoScoreCardProps) {
  const { data, isLoading, isError, refetch } = useEcoScore();
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // 상태 바 너비 (패딩 제외)
  const STATUS_BAR_WIDTH = SCREEN_WIDTH - spacing.xl * 2 - spacing.xl * 2; // 카드 패딩 제외
  const STATUS_BAR_HEIGHT = 16;

  // 로딩 상태
  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.title}>환경 점수</Text>
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner message="불러오는 중..." />
        </View>
      </View>
    );
  }

  // 에러 상태
  if (isError || !data) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.title}>환경 점수</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>환경 점수를 불러오지 못했습니다.</Text>
        </View>
      </View>
    );
  }

  const score = data.score;
  const level = getEcoScoreLevel(score);
  const scoreColor = getEcoScoreColor(score);
  const scoreLabel = getEcoScoreLabel(score);
  const barPosition = getEcoScoreBarPosition(score);

  // 컴포넌트 데이터 포맷팅
  const formatValue = (value: number, unit: string = '') => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k${unit}`;
    }
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <View style={[styles.container, style]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>환경 점수</Text>
      </View>

      {/* 메인 점수 섹션 */}
      <View style={styles.scoreSection}>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>{Math.round(score)}</Text>
          <Text style={styles.scoreUnit}>점</Text>
        </View>
        <Text style={styles.scoreDescription}>
          {scoreLabel} 상태입니다 ({score}점)
        </Text>

        {/* 환경 상태 바 */}
        <View style={styles.statusBarContainer}>
          <View style={styles.statusBarWrapper}>
            <Svg height={STATUS_BAR_HEIGHT} width={STATUS_BAR_WIDTH} style={styles.statusBarSvg}>
              <Defs>
                <SvgLinearGradient id="ecoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor={ECO_SCORE_COLORS.VERY_POOR} stopOpacity="1" />
                  <Stop offset="25%" stopColor={ECO_SCORE_COLORS.POOR} stopOpacity="1" />
                  <Stop offset="50%" stopColor={ECO_SCORE_COLORS.FAIR} stopOpacity="1" />
                  <Stop offset="75%" stopColor={ECO_SCORE_COLORS.GOOD} stopOpacity="1" />
                  <Stop offset="100%" stopColor={ECO_SCORE_COLORS.EXCELLENT} stopOpacity="1" />
                </SvgLinearGradient>
              </Defs>
              <Rect
                width={STATUS_BAR_WIDTH}
                height={STATUS_BAR_HEIGHT}
                rx={STATUS_BAR_HEIGHT / 2}
                fill="url(#ecoGradient)"
              />
            </Svg>
            {/* 인디케이터 삼각형 */}
            <View style={styles.indicatorContainer}>
              <View
                style={[
                  styles.indicatorTriangle,
                  styles.indicatorTrianglePosition,
                  {
                    left: `${barPosition}%`,
                    borderTopColor: scoreColor,
                  },
                ]}
              />
            </View>
          </View>
          {/* 상태 라벨들 */}
          <View style={styles.statusLabels}>
            <Text style={styles.statusLabelText}>매우 부족</Text>
            <Text style={styles.statusLabelText}>부족</Text>
            <Text style={styles.statusLabelText}>보통</Text>
            <Text style={styles.statusLabelText}>양호</Text>
            <Text style={styles.statusLabelText}>우수</Text>
          </View>
        </View>
      </View>

      {/* 컴포넌트 메트릭 카드들 */}
      <View style={styles.metricsContainer}>
        {/* 처리량 */}
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>처리량</Text>
          <Text style={styles.metricValue}>
            {formatValue(data.components.processedAmount, 'kg')}
          </Text>
        </View>

        {/* 효율 */}
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>효율</Text>
          <Text style={styles.metricValue}>{data.components.efficiency.toFixed(1)}%</Text>
        </View>

        {/* CO₂ 절감 */}
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>CO₂ 절감</Text>
          <Text style={styles.metricValue}>{formatValue(data.components.co2Savings, 'kg')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    minHeight: 100,
    paddingVertical: spacing.xl,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  header: {
    marginBottom: spacing.lg,
  },
  indicatorContainer: {
    height: 10,
    left: 0,
    position: 'absolute',
    top: -10,
    width: '100%',
    zIndex: 1,
  },
  indicatorTriangle: {
    borderBottomColor: colors.transparent,
    borderBottomWidth: 0,
    borderLeftColor: colors.transparent,
    borderLeftWidth: 8,
    borderRightColor: colors.transparent,
    borderRightWidth: 8,
    borderTopWidth: 10,
    position: 'absolute',
    top: 0,
  },
  indicatorTrianglePosition: {
    marginLeft: -6,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    paddingVertical: spacing.xl,
  },
  metricCard: {
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 12,
    flex: 1,
    padding: spacing.md,
  },
  metricLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  scoreContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  scoreDescription: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  scoreSection: {
    marginBottom: spacing.xl,
  },
  scoreUnit: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.xs,
  },
  scoreValue: {
    fontSize: typography.sizes.xxl * 1.5, // 42px
    fontWeight: typography.weights.bold,
  },
  statusBarContainer: {
    marginTop: spacing.md,
    position: 'relative',
  },
  statusBarSvg: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusBarWrapper: {
    borderRadius: 8,
    height: 16,
    overflow: 'visible',
    width: '100%',
  },
  statusLabelText: {
    color: colors.mutedText,
    flex: 1,
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
  statusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    width: '100%',
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
