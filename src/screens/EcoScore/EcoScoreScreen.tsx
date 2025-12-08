/**
 * 환경 점수 상세 화면
 * 환경 점수의 상세 정보를 보여주는 화면입니다.
 */

import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useEcoScore } from '@/features/reports/hooks/useEcoScore';
import {
  ECO_SCORE_COLORS,
  getEcoScoreBarPosition,
  getEcoScoreColor,
  getEcoScoreLabel,
} from '@/features/reports/utils/ecoScore';
import { DashboardStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type EcoScoreScreenProps = NativeStackScreenProps<DashboardStackParamList, 'EcoScore'>;

export default function EcoScoreScreen({ navigation }: EcoScoreScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { data, isLoading, isError, refetch } = useEcoScore();

  // 상태 바 너비 (패딩 제외)
  const STATUS_BAR_WIDTH = SCREEN_WIDTH - spacing.xl * 2;
  const STATUS_BAR_HEIGHT = 16;

  const handleBack = () => {
    navigation.goBack();
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>환경 점수</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={[styles.content, styles.loadingContainer]}>
          <LoadingSpinner message="환경 점수를 불러오는 중..." />
        </View>
      </View>
    );
  }

  // 에러 상태
  if (isError || !data) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>환경 점수</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={[styles.content, styles.errorContainer]}>
          <Text style={styles.errorText}>환경 점수를 불러오지 못했습니다.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const score = data.score;
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
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>환경 점수</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        {/* 컴포넌트 메트릭 섹션 */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>상세 지표</Text>

          {/* 처리량 카드 */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricCardTitle}>처리량</Text>
              <Text style={styles.metricCardValue}>
                {formatValue(data.components.processedAmount, 'kg')}
              </Text>
            </View>
            <Text style={styles.metricCardDescription}>한니비가 처리한 총량입니다</Text>
          </View>

          {/* 효율 카드 */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricCardTitle}>효율</Text>
              <Text style={styles.metricCardValue}>{data.components.efficiency.toFixed(1)}%</Text>
            </View>
            <Text style={styles.metricCardDescription}>에너지 효율을 나타냅니다</Text>
          </View>

          {/* CO₂ 절감 카드 */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricCardTitle}>CO₂ 절감</Text>
              <Text style={styles.metricCardValue}>
                {formatValue(data.components.co2Savings, 'kg')}
              </Text>
            </View>
            <Text style={styles.metricCardDescription}>절감한 이산화탄소 양입니다</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backButtonIcon: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerRight: {
    width: 44,
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
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
    justifyContent: 'center',
  },
  metricCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 2,
    marginBottom: spacing.md,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricCardDescription: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  metricCardHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metricCardTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  metricCardValue: {
    color: colors.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  metricsSection: {
    marginTop: spacing.xl,
  },
  retryButton: {
    alignItems: 'center',
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
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.xs,
  },
  scoreValue: {
    fontSize: typography.sizes.xxl * 2, // 56px
    fontWeight: typography.weights.bold,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
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
});
