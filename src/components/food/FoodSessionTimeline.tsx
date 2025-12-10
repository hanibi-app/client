/**
 * 음식 투입 세션 타임라인 컴포넌트
 * 센서 이벤트를 기반으로 음식 투입 세션을 타임라인 형태로 표시합니다.
 */

import React, { useState } from 'react';

import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useFoodSessions } from '@/hooks/useFoodSessions';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import type { FoodInputSession } from '@/types/foodSession';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

interface FoodSessionTimelineProps {
  deviceId: string;
}

/**
 * 음식 투입 세션 타임라인 컴포넌트
 *
 * @example
 * ```tsx
 * <FoodSessionTimeline deviceId="HANIBI-001" />
 * ```
 */
export function FoodSessionTimeline({ deviceId }: FoodSessionTimelineProps) {
  const { data: sessions, isLoading, isError } = useFoodSessions(deviceId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>음식 투입 기록을 불러오는 중이에요...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          세션 정보를 불러오는 데 문제가 생겼어요. 잠시 후 다시 시도해주세요.
        </Text>
      </View>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>아직 기록된 음식 투입 세션이 없어요.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {sessions.map((session) => (
        <SessionCard key={session.sessionId} session={session} />
      ))}
    </ScrollView>
  );
}

interface SessionCardProps {
  session: FoodInputSession;
}

/**
 * 개별 세션 카드 컴포넌트
 */
function SessionCard({ session }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getSessionSummary = (): string => {
    if (session.status === 'in_progress') {
      return '음식 투입이 감지되었어요. 처리 대기 중이에요.';
    }
    if (session.processingCompletedEvent) {
      return '처리가 완료되었어요.';
    }
    return '한 번의 음식 투입이 감지되었어요.';
  };

  const getDuration = (): string | null => {
    if (!session.startedAt || !session.endedAt) return null;
    try {
      const start = new Date(session.startedAt).getTime();
      const end = new Date(session.endedAt).getTime();
      const diffMs = end - start;
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMinutes / 60);

      if (diffHours > 0) {
        return `${diffHours}시간 ${diffMinutes % 60}분`;
      }
      return `${diffMinutes}분`;
    } catch {
      return null;
    }
  };

  return (
    <Pressable
      style={[styles.card, session.status === 'in_progress' && styles.cardInProgress]}
      onPress={() => setExpanded(!expanded)}
    >
      {/* 헤더 */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardTitle}>음식 투입 세션</Text>
          <View style={styles.badgeContainer}>
            {session.status === 'in_progress' ? (
              <View style={[styles.badge, styles.badgeInProgress]}>
                <Text style={styles.badgeText}>진행 중</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeCompleted]}>
                <Text style={styles.badgeText}>완료</Text>
              </View>
            )}
            {session.processingCompletedEvent && (
              <View style={[styles.badge, styles.badgeProcessing]}>
                <Text style={styles.badgeText}>처리 완료</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.cardTime}>{formatRelativeTime(session.startedAt)}</Text>
      </View>

      {/* 요약 */}
      <Text style={styles.cardSummary}>{getSessionSummary()}</Text>

      {/* 상세 정보 (확장 시) */}
      {expanded && (
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>시작 시간</Text>
            <Text style={styles.detailValue}>{formatDateTime(session.startedAt)}</Text>
          </View>
          {session.endedAt && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>종료 시간</Text>
              <Text style={styles.detailValue}>{formatDateTime(session.endedAt)}</Text>
            </View>
          )}
          {getDuration() && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>소요 시간</Text>
              <Text style={styles.detailValue}>{getDuration()}</Text>
            </View>
          )}

          {/* 무게 변화 */}
          {session.weightChange && (
            <View style={styles.weightSection}>
              <Text style={styles.weightSectionTitle}>무게 변화</Text>
              <View style={styles.weightRow}>
                {session.weightChange.before !== undefined && (
                  <View style={styles.weightItem}>
                    <Text style={styles.weightLabel}>투입 전</Text>
                    <Text style={styles.weightValue}>{session.weightChange.before}g</Text>
                  </View>
                )}
                {session.weightChange.after !== undefined && (
                  <View style={styles.weightItem}>
                    <Text style={styles.weightLabel}>투입 후</Text>
                    <Text style={styles.weightValue}>{session.weightChange.after}g</Text>
                  </View>
                )}
                {session.weightChange.diff !== undefined && (
                  <View style={styles.weightItem}>
                    <Text style={styles.weightLabel}>변화량</Text>
                    <Text
                      style={[
                        styles.weightValue,
                        session.weightChange.diff > 0 && styles.weightValuePositive,
                        session.weightChange.diff < 0 && styles.weightValueNegative,
                      ]}
                    >
                      {session.weightChange.diff > 0 ? '+' : ''}
                      {session.weightChange.diff}g
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* 이벤트 정보 */}
          <View style={styles.eventsSection}>
            <Text style={styles.eventsSectionTitle}>이벤트</Text>
            {session.beforeEvent && (
              <View style={styles.eventItem}>
                <Text style={styles.eventType}>투입 전</Text>
                <Text style={styles.eventTime}>
                  {formatDateTime(session.beforeEvent.createdAt)}
                </Text>
              </View>
            )}
            {session.afterEvent && (
              <View style={styles.eventItem}>
                <Text style={styles.eventType}>투입 후</Text>
                <Text style={styles.eventTime}>{formatDateTime(session.afterEvent.createdAt)}</Text>
              </View>
            )}
            {session.processingCompletedEvent && (
              <View style={styles.eventItem}>
                <Text style={styles.eventType}>처리 완료</Text>
                <Text style={styles.eventTime}>
                  {formatDateTime(session.processingCompletedEvent.createdAt)}
                </Text>
              </View>
            )}

            {/* TODO: 카메라 API가 정상 작동하면 주석 해제 */}
            {/* 
            {session.beforeSnapshot && (
              <View style={styles.snapshotSection}>
                <Text style={styles.snapshotLabel}>투입 전 사진</Text>
                <Pressable onPress={() => {
                  // 이미지 뷰어 모달 열기
                }}>
                  <Image
                    source={{ uri: session.beforeSnapshot.imageUrl }}
                    style={styles.snapshotThumbnail}
                  />
                </Pressable>
              </View>
            )}
            {session.afterSnapshot && (
              <View style={styles.snapshotSection}>
                <Text style={styles.snapshotLabel}>투입 후 사진</Text>
                <Pressable onPress={() => {
                  // 이미지 뷰어 모달 열기
                }}>
                  <Image
                    source={{ uri: session.afterSnapshot.imageUrl }}
                    style={styles.snapshotThumbnail}
                  />
                </Pressable>
              </View>
            )}
            */}
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeCompleted: {
    backgroundColor: colors.success + '20',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  badgeInProgress: {
    backgroundColor: colors.warning + '20',
  },
  badgeProcessing: {
    backgroundColor: colors.primary + '20',
  },
  badgeText: {
    color: colors.text,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardDetails: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardInProgress: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardSummary: {
    color: colors.text,
    fontSize: typography.sizes.md,
    marginBottom: spacing.xs,
  },
  cardTime: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  container: {
    flex: 1,
  },
  detailLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailValue: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  eventTime: {
    color: colors.text,
    fontSize: typography.sizes.sm,
  },
  eventType: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  eventsSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  eventsSectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
  },
  weightItem: {
    flex: 1,
  },
  weightLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginBottom: spacing.xs,
  },
  weightRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  weightSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  weightSectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  weightValue: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  weightValueNegative: {
    color: colors.danger,
  },
  weightValuePositive: {
    color: colors.success,
  },
  // TODO: 카메라 API가 정상 작동하면 주석 해제
  // snapshotSection: {
  //   marginTop: spacing.md,
  // },
  // snapshotLabel: {
  //   color: colors.mutedText,
  //   fontSize: typography.sizes.sm,
  //   marginBottom: spacing.xs,
  // },
  // snapshotThumbnail: {
  //   borderRadius: 8,
  //   height: 100,
  //   width: 100,
  // },
});
