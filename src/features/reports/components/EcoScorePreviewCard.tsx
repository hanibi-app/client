/**
 * 환경 점수 미리보기 카드 컴포넌트
 * 대시보드에서 사용하는 간단한 미리보기 카드입니다.
 * 클릭하면 상세 화면으로 이동합니다.
 */

import React from 'react';

import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useEcoScore } from '@/features/reports/hooks/useEcoScore';
import { getEcoScoreColor, getEcoScoreLabel } from '@/features/reports/utils/ecoScore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type EcoScorePreviewCardProps = {
  /**
   * 상세 화면으로 이동하는 함수
   */
  onPress: () => void;
  /**
   * 추가 스타일
   */
  style?: ViewStyle;
};

/**
 * 환경 점수 미리보기 카드 컴포넌트
 * 대시보드에서 간단하게 환경 점수를 보여주고, 클릭하면 상세 화면으로 이동합니다.
 *
 * @example
 * ```tsx
 * <EcoScorePreviewCard onPress={() => navigation.navigate('EcoScore')} />
 * ```
 */
export function EcoScorePreviewCard({ onPress, style }: EcoScorePreviewCardProps) {
  const { data, isLoading, isError } = useEcoScore();

  // 로딩 상태
  if (isLoading) {
    return (
      <Pressable onPress={onPress} style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.title}>환경 점수</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner message="불러오는 중..." size="small" />
        </View>
      </Pressable>
    );
  }

  // 에러 상태
  if (isError || !data) {
    return (
      <Pressable onPress={onPress} style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.title}>환경 점수</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>데이터를 불러올 수 없습니다</Text>
        </View>
      </Pressable>
    );
  }

  const score = data.score;
  const scoreColor = getEcoScoreColor(score);
  const scoreLabel = getEcoScoreLabel(score);

  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>환경 점수</Text>
        <Text style={styles.chevron}>›</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>{Math.round(score)}</Text>
          <Text style={styles.scoreUnit}>점</Text>
        </View>
        <Text style={styles.scoreLabel}>{scoreLabel}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>자세히 보기</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevron: {
    color: colors.mutedText,
    fontSize: typography.sizes.xl,
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
  content: {
    alignItems: 'center',
    marginBottom: spacing.md,
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
  footer: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
  },
  footerText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    paddingVertical: spacing.md,
  },
  scoreLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  scoreRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  scoreUnit: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.xs,
  },
  scoreValue: {
    fontSize: typography.sizes.xxl * 1.2, // 33.6px
    fontWeight: typography.weights.bold,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
