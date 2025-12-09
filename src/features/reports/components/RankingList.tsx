/**
 * 랭킹 리스트 컴포넌트
 * 기간별 랭킹 정보를 표시하고, period 선택 탭을 제공합니다.
 * 429 에러 시 특별한 메시지를 표시합니다.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { AxiosError } from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { RankingItem, RankingPeriod, RankingResponse } from '@/api/types/reports';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useRanking } from '@/features/reports/hooks/useRanking';
import { DEBUG_DEVICE_ID, useCurrentDeviceId } from '@/store/deviceStore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type RankingListProps = {
  /**
   * 초기 선택된 기간
   */
  initialPeriod?: RankingPeriod;
  /**
   * period 변경 시 호출되는 콜백 (선택사항)
   */
  onPeriodChange?: (period: RankingPeriod) => void;
};

/**
 * 기간별 한글 라벨 매핑
 */
const PERIOD_LABELS: Record<RankingPeriod, string> = {
  HOURLY: '시간별',
  DAILY: '일간',
  WEEKLY: '주간',
  MONTHLY: '월간',
};

/**
 * 더미 랭킹 데이터 생성 함수
 * 디버그 모드에서 사용할 가짜 랭킹 데이터입니다.
 */
function generateDummyRankingData(period: RankingPeriod): RankingResponse {
  // 더미 사용자 이름 목록
  const dummyNames = [
    '한니비러버',
    '환경지킴이',
    '에코마스터',
    '그린히어로',
    '지구사랑',
    '친환경왕',
    '재활용마스터',
    '에너지절약왕',
    '탄소제로',
    '지속가능성',
    '나', // 내 계정 (isMe: true)
  ];

  // 기간에 따라 점수 범위 조정
  const scoreRanges: Record<RankingPeriod, { min: number; max: number }> = {
    HOURLY: { min: 100, max: 500 },
    DAILY: { min: 500, max: 2000 },
    WEEKLY: { min: 2000, max: 10000 },
    MONTHLY: { min: 10000, max: 50000 },
  };

  const { min, max } = scoreRanges[period];
  const items: RankingItem[] = [];

  // 10명의 더미 랭킹 생성
  for (let i = 0; i < 10; i++) {
    const rank = i + 1;
    const nameIndex = i % dummyNames.length;
    const name = dummyNames[nameIndex];
    // 점수는 순위가 높을수록 높게 (1위가 최고점)
    const score = Math.floor(max - ((max - min) * i) / 9);
    const isMe = name === '나';

    items.push({
      rank,
      name,
      score,
      isMe,
    });
  }

  return {
    period,
    items,
  };
}

/**
 * 랭킹 리스트 컴포넌트
 *
 * @example
 * ```tsx
 * <RankingList initialPeriod="DAILY" onPeriodChange={(p) => console.log(p)} />
 * ```
 */
export function RankingList({ initialPeriod = 'DAILY', onPeriodChange }: RankingListProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<RankingPeriod>(initialPeriod);

  // 디버그 모드 감지
  const currentDeviceId = useCurrentDeviceId();
  const isDebugMode = currentDeviceId === DEBUG_DEVICE_ID;

  // 디버그 모드가 아닐 때만 실제 API 호출
  const {
    data: apiData,
    isLoading: isApiLoading,
    isError: isApiError,
    error,
    refetch: refetchApi,
  } = useRanking(selectedPeriod, {
    enabled: !isDebugMode, // 디버그 모드일 때는 API 호출 비활성화
  });

  // refetch를 위한 강제 리렌더링용 상태
  const [refreshKey, setRefreshKey] = useState(0);

  // 디버그 모드일 때는 더미 데이터 사용
  const dummyData = useMemo(() => {
    if (isDebugMode) {
      const data = generateDummyRankingData(selectedPeriod);
      if (__DEV__) {
        console.log(
          `[RankingList] 더미 랭킹 데이터 생성: ${selectedPeriod}, 항목 수: ${data.items.length}`,
        );
      }
      return data;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDebugMode, selectedPeriod, refreshKey]);

  // 콘텐츠 전환 애니메이션
  const contentFadeAnim = useRef(new Animated.Value(1)).current;
  const contentSlideAnim = useRef(new Animated.Value(0)).current;

  const handlePeriodChange = (period: RankingPeriod) => {
    if (period === selectedPeriod) return; // 같은 탭 클릭 시 무시

    // 페이드 아웃 애니메이션
    Animated.parallel([
      Animated.timing(contentFadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentSlideAnim, {
        toValue: -20,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // period 변경
      setSelectedPeriod(period);
      onPeriodChange?.(period);
      // 시상대 애니메이션 리셋
      setHasAnimated(false);
      podiumAnim1.setValue(0);
      podiumAnim2.setValue(0);
      podiumAnim3.setValue(0);

      // 페이드 인 애니메이션
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(contentSlideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const refetch = () => {
    if (isDebugMode) {
      // 디버그 모드: 강제 리렌더링으로 useMemo 재계산 트리거
      setRefreshKey((prev) => prev + 1);
    } else {
      // 실제 API 재호출
      refetchApi();
    }
  };

  // 최종 데이터 결정: 디버그 모드면 더미 데이터, 아니면 API 데이터
  const data = isDebugMode ? dummyData : apiData;
  const isLoading = isDebugMode ? false : isApiLoading;
  const isError = isDebugMode ? false : isApiError;

  /**
   * 429 에러인지 확인하고 retry-after 헤더 값을 추출합니다.
   */
  const get429ErrorInfo = (): { is429: boolean; retryAfter?: number } => {
    if (error instanceof AxiosError && error.response?.status === 429) {
      const retryAfterHeader = error.response.headers['retry-after'];
      const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined;
      return { is429: true, retryAfter };
    }
    return { is429: false };
  };

  const { is429, retryAfter } = get429ErrorInfo();

  // 시상대 애니메이션 값들
  const podiumAnim1 = useRef(new Animated.Value(0)).current;
  const podiumAnim2 = useRef(new Animated.Value(0)).current;
  const podiumAnim3 = useRef(new Animated.Value(0)).current;

  // 시상대 애니메이션 시작
  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (data && data.items.length >= 3 && !hasAnimated) {
      // 초기값 리셋
      podiumAnim1.setValue(0);
      podiumAnim2.setValue(0);
      podiumAnim3.setValue(0);

      // 순차적으로 나타나는 애니메이션 (1위 → 2위 → 3위 순서)
      Animated.sequence([
        Animated.parallel([
          Animated.timing(podiumAnim1, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(podiumAnim2, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(podiumAnim3, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setHasAnimated(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.items.length, selectedPeriod]);

  /**
   * 시상대 상위 3위 렌더링
   */
  const renderPodium = () => {
    const topThree = data.items.slice(0, 3);
    if (topThree.length < 3) return null;

    const [first, second, third] = topThree;

    return (
      <View style={styles.podiumWrapper}>
        <View style={styles.podiumContainer}>
          {/* 2위 (왼쪽) */}
          <Animated.View
            style={[
              styles.podiumColumn,
              {
                opacity: podiumAnim2,
                transform: [
                  {
                    translateY: podiumAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  {
                    scale: podiumAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={[styles.podiumItem, styles.podiumSecond]}>
              <LinearGradient
                colors={[colors.silver, '#E8E8E8', '#F5F5F5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.podiumGradient}
              >
                <View style={styles.podiumContent}>
                  <Text style={styles.podiumMedal}>🥈</Text>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {second.name}
                    {second.isMe && <Text style={styles.podiumMeLabel}> (나)</Text>}
                  </Text>
                  <Text style={styles.podiumScore}>{second.score.toLocaleString()}점</Text>
                </View>
              </LinearGradient>
            </View>
            <View style={[styles.podiumBase, styles.podiumBaseSecond]} />
          </Animated.View>

          {/* 1위 (중앙, 가장 높음) */}
          <Animated.View
            style={[
              styles.podiumColumn,
              {
                opacity: podiumAnim1,
                transform: [
                  {
                    translateY: podiumAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  {
                    scale: podiumAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={[styles.podiumItem, styles.podiumFirst]}>
              <LinearGradient
                colors={[colors.gold, '#FFED4E', '#FFF9C4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.podiumGradient}
              >
                <View style={styles.podiumContent}>
                  <Text style={styles.podiumMedal}>🥇</Text>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {first.name}
                    {first.isMe && <Text style={styles.podiumMeLabel}> (나)</Text>}
                  </Text>
                  <Text style={styles.podiumScore}>{first.score.toLocaleString()}점</Text>
                </View>
              </LinearGradient>
            </View>
            <View style={[styles.podiumBase, styles.podiumBaseFirst]} />
          </Animated.View>

          {/* 3위 (오른쪽) */}
          <Animated.View
            style={[
              styles.podiumColumn,
              {
                opacity: podiumAnim3,
                transform: [
                  {
                    translateY: podiumAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  {
                    scale: podiumAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={[styles.podiumItem, styles.podiumThird]}>
              <LinearGradient
                colors={[colors.bronze, '#E6A85C', '#F4C2A1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.podiumGradient}
              >
                <View style={styles.podiumContent}>
                  <Text style={styles.podiumMedal}>🥉</Text>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {third.name}
                    {third.isMe && <Text style={styles.podiumMeLabel}> (나)</Text>}
                  </Text>
                  <Text style={styles.podiumScore}>{third.score.toLocaleString()}점</Text>
                </View>
              </LinearGradient>
            </View>
            <View style={[styles.podiumBase, styles.podiumBaseThird]} />
          </Animated.View>
        </View>
      </View>
    );
  };

  /**
   * 일반 랭킹 항목 렌더링 (4위부터)
   */
  const renderRankingItem = ({ item, index }: { item: RankingItem; index: number }) => {
    const isMe = item.isMe ?? false;
    return (
      <View
        style={[
          styles.rankingItem,
          isMe && styles.rankingItemMe,
          index === 0 && styles.rankingItemFirst,
        ]}
      >
        <View style={styles.rankingItemContent}>
          <View style={styles.rankContainer}>
            <Text style={[styles.rankText, isMe && styles.rankTextMe]}>{item.rank}</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={[styles.nameText, isMe && styles.nameTextMe]} numberOfLines={1}>
              {item.name}
              {isMe && <Text style={styles.meLabel}> (나)</Text>}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, isMe && styles.scoreTextMe]}>
              {item.score.toLocaleString()}
            </Text>
            <Text style={styles.scoreUnit}>점</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Period 선택 탭 */}
      <View style={styles.periodSelector}>
        {(Object.keys(PERIOD_LABELS) as RankingPeriod[]).map((period) => {
          const isActive = selectedPeriod === period;
          return (
            <Pressable
              key={period}
              onPress={() => handlePeriodChange(period)}
              style={[styles.periodButton, isActive && styles.periodButtonActive]}
            >
              <Text style={[styles.periodButtonText, isActive && styles.periodButtonTextActive]}>
                {PERIOD_LABELS[period]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 콘텐츠 영역 */}
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.animatedContent,
            {
              opacity: contentFadeAnim,
              transform: [{ translateY: contentSlideAnim }],
            },
          ]}
        >
          {/* 로딩 상태 */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <LoadingSpinner message="랭킹을 불러오는 중..." size="small" />
            </View>
          )}

          {/* 에러 상태 */}
          {isError && !isLoading && (
            <View style={styles.errorContainer}>
              {is429 ? (
                <View style={styles.errorContent}>
                  <Text style={styles.errorTitle}>요청이 많아 잠시 후 다시 시도해 주세요.</Text>
                  {retryAfter !== undefined && retryAfter > 0 && (
                    <Text style={styles.errorSubtitle}>
                      약 {retryAfter}초 후 다시 시도해 주세요.
                    </Text>
                  )}
                  <Pressable onPress={() => refetch()} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>다시 시도</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.errorContent}>
                  <Text style={styles.errorTitle}>랭킹을 불러오지 못했습니다.</Text>
                  <Pressable onPress={() => refetch()} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>다시 시도</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}

          {/* 데이터 표시 */}
          {!isLoading && !isError && data && (
            <View style={styles.rankingContainer}>
              {data.items.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>랭킹 데이터가 없습니다.</Text>
                </View>
              ) : (
                <>
                  {/* 시상대 (상위 3위) */}
                  {data.items.length >= 3 && renderPodium()}

                  {/* 일반 랭킹 리스트 (4위부터) */}
                  {data.items.length > 3 && (
                    <FlatList
                      data={data.items.slice(3)}
                      renderItem={renderRankingItem}
                      keyExtractor={(item, index) => `ranking-${item.rank}-${index}`}
                      contentContainerStyle={styles.rankingList}
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                </>
              )}
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedContent: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
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
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 200,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  errorContent: {
    alignItems: 'center',
    width: '100%',
  },
  errorSubtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorTitle: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 200,
    paddingVertical: spacing.xl,
  },
  meLabel: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  nameContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  nameText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  nameTextMe: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  periodButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  periodButtonActive: {
    backgroundColor: colors.primary + '20',
  },
  periodButtonText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  periodButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  periodSelector: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  podiumBase: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 8,
    marginTop: -4,
    width: '100%',
  },
  podiumBaseFirst: {
    backgroundColor: colors.gold,
    height: 10,
  },
  podiumBaseSecond: {
    backgroundColor: colors.silver,
  },
  podiumBaseThird: {
    backgroundColor: colors.bronze,
  },
  podiumColumn: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.sm,
    minWidth: 100,
  },
  podiumContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  podiumContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  podiumFirst: {
    elevation: 8,
    height: 200,
    shadowColor: colors.gold,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '100%',
    zIndex: 3,
  },
  podiumGradient: {
    borderRadius: 16,
    flex: 1,
    overflow: 'hidden',
  },
  podiumItem: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  podiumMeLabel: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  podiumMedal: {
    fontSize: typography.sizes.xxl,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  podiumName: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  podiumScore: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  podiumSecond: {
    elevation: 6,
    height: 160,
    shadowColor: colors.silver,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    width: '100%',
    zIndex: 2,
  },
  podiumThird: {
    elevation: 4,
    height: 140,
    shadowColor: colors.bronze,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '100%',
    zIndex: 1,
  },
  podiumWrapper: {
    marginBottom: spacing.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  rankContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 50,
  },
  rankText: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    minWidth: 30,
    textAlign: 'center',
  },
  rankTextMe: {
    color: colors.primary,
  },
  rankingContainer: {
    flex: 1,
  },
  rankingItem: {
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rankingItemContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rankingItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rankingItemMe: {
    backgroundColor: colors.primary + '10',
    borderLeftColor: colors.primary,
    borderLeftWidth: 3,
  },
  rankingList: {
    paddingBottom: spacing.md,
  },
  retryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  scoreText: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  scoreTextMe: {
    color: colors.primary,
  },
  scoreUnit: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
});
