import React, { useEffect, useRef, useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';

import AppHeader from '@/components/common/AppHeader';
import ReportTabs, { ReportTabType } from '@/components/common/ReportTabs';
import { DashboardStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ReportsScreenProps = NativeStackScreenProps<DashboardStackParamList, 'Reports'>;

// API 응답 타입 (나중에 실제 API로 교체)
type ReportDataPoint = {
  time: string; // "00:00", "06:00", "12:00", "18:00" 등
  value: number;
  timestamp: number; // Unix timestamp
};

type ReportSummary = {
  current: number;
  max: { value: number; time: string };
  min: { value: number; time: string };
  average: number;
  referenceDate: string; // "2025.09.08"
};

type ReportData = {
  dataPoints: ReportDataPoint[];
  summary: ReportSummary;
};

// 시간 범위 타입
type TimeRange = '1일' | '1주일' | '1개월' | '1년';

// 탭별 제목 및 단위
const TAB_CONFIG: Record<
  ReportTabType,
  { title: string; subtitle: string; unit: string; yAxisLabel: string }
> = {
  temp: {
    title: '온도 변화',
    subtitle: '시간대별 상태 리포트',
    unit: '°C',
    yAxisLabel: '온도',
  },
  humidity: {
    title: '습도 변화',
    subtitle: '시간대별 상태 리포트',
    unit: '%',
    yAxisLabel: '습도',
  },
  weight: {
    title: '무게 변화',
    subtitle: '시간대별 상태 리포트',
    unit: 'kg',
    yAxisLabel: '무게',
  },
  voc: {
    title: '향기지수 변화',
    subtitle: '시간대별 상태 리포트',
    unit: 'ppb',
    yAxisLabel: 'VOC',
  },
};

// 임시 더미 데이터 생성 함수 (나중에 API로 교체)
const generateDummyData = (type: ReportTabType, range: TimeRange): ReportData => {
  const now = new Date();
  const dataPoints: ReportDataPoint[] = [];
  const hours = range === '1일' ? 24 : range === '1주일' ? 168 : range === '1개월' ? 720 : 8760;
  const interval = range === '1일' ? 1 : range === '1주일' ? 1 : range === '1개월' ? 1 : 1;

  let baseValue = 0;
  if (type === 'temp') baseValue = 25;
  else if (type === 'humidity') baseValue = 50;
  else if (type === 'weight') baseValue = 1.2;
  else baseValue = 100;

  for (let i = 0; i < hours; i += interval) {
    const timestamp = now.getTime() - (hours - i) * 60 * 60 * 1000;
    const hour = new Date(timestamp).getHours();
    const variation = Math.sin((i / hours) * Math.PI * 2) * (baseValue * 0.3);
    const randomVariation = (Math.random() - 0.5) * (baseValue * 0.1);
    const value = Math.max(0, baseValue + variation + randomVariation);

    dataPoints.push({
      time: `${String(hour).padStart(2, '0')}:00`,
      value: Number(value.toFixed(1)),
      timestamp,
    });
  }

  const values = dataPoints.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const maxIndex = values.indexOf(maxValue);
  const minIndex = values.indexOf(minValue);

  return {
    dataPoints,
    summary: {
      current: values[values.length - 1],
      max: {
        value: maxValue,
        time: `${String(Math.floor(maxIndex / (hours / 24))).padStart(2, '0')}시`,
      },
      min: {
        value: minValue,
        time: `${String(Math.floor(minIndex / (hours / 24))).padStart(2, '0')}시`,
      },
      average: Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)),
      referenceDate: now.toISOString().split('T')[0].replace(/-/g, '.'),
    },
  };
};

export default function ReportsScreen({ navigation }: ReportsScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<ReportTabType>('temp');
  const [timeRange, setTimeRange] = useState<TimeRange>('1일');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 차트 애니메이션
  const chartOpacity = useRef(new Animated.Value(0)).current;

  // API 호출 함수 (실제 API 연결 대비)
  const fetchReportData = async (type: ReportTabType, range: TimeRange): Promise<ReportData> => {
    try {
      // TODO: 실제 API 엔드포인트로 교체
      // - GET /api/reports/{type}?range={range} 엔드포인트 호출
      // - type: 'temp' | 'humidity' | 'moisture' | 'voc'
      // - range: '1일' | '1주' | '1개월' | '3개월'
      // - 응답 형식: { dataPoints: [...], summary: {...} }
      // - 인증 토큰 헤더 추가 필요
      // - 관련 이슈: #리포트API
      // const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';
      // const response = await fetch(`${API_BASE_URL}/api/reports/${type}?range=${range}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // 'Authorization': `Bearer ${token}`,
      //   },
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`API Error: ${response.status}`);
      // }
      //
      // const data = await response.json();
      // return {
      //   dataPoints: data.dataPoints.map((dp: any) => ({
      //     time: dp.time,
      //     value: dp.value,
      //     timestamp: dp.timestamp,
      //   })),
      //   summary: {
      //     current: data.summary.current,
      //     max: data.summary.max,
      //     min: data.summary.min,
      //     average: data.summary.average,
      //     referenceDate: data.summary.referenceDate,
      //   },
      // };

      // 임시: 더미 데이터 반환
      return generateDummyData(type, range);
    } catch (error) {
      console.error('리포트 데이터 가져오기 실패:', error);
      // 에러 발생 시 더미 데이터 반환 (폴백)
      return generateDummyData(type, range);
    }
  };

  // API 호출
  useEffect(() => {
    setIsLoading(true);
    fetchReportData(activeTab, timeRange)
      .then(setReportData)
      .catch((error: unknown) => {
        console.error('리포트 데이터 로딩 실패:', error);
        // 에러 발생 시 더미 데이터 사용
        setReportData(generateDummyData(activeTab, timeRange));
      })
      .finally(() => setIsLoading(false));
  }, [activeTab, timeRange]);

  // 차트 애니메이션 효과
  useEffect(() => {
    if (reportData) {
      chartOpacity.setValue(0);
      Animated.timing(chartOpacity, {
        duration: 500,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [reportData, chartOpacity]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchReportData(activeTab, timeRange)
      .then(setReportData)
      .catch((error: unknown) => {
        console.error('리포트 데이터 새로고침 실패:', error);
        setReportData(generateDummyData(activeTab, timeRange));
      })
      .finally(() => setIsLoading(false));
  };

  const config = TAB_CONFIG[activeTab];

  // 차트 크기 계산 (화면 크기에 비례) - 차트만 화면을 채우도록
  const CHART_WIDTH = SCREEN_WIDTH;
  const CHART_HEIGHT = Math.max(280, Math.min(400, SCREEN_HEIGHT * 0.4));

  // 차트 데이터 포맷팅 (reportData가 있을 때만)
  const chartData = reportData
    ? reportData.dataPoints.map((point, index) => ({
        x: index,
        y: point.value,
      }))
    : [];

  // Y축 범위 계산 (타입별로 다른 범위)
  const yValues = reportData ? reportData.dataPoints.map((d) => d.value) : [];
  let yMin: number;
  let yMax: number;
  let yStep: number;

  if (activeTab === 'temp') {
    yMin = 15;
    yMax = 39;
    yStep = 3;
  } else if (activeTab === 'humidity') {
    yMin = yValues.length > 0 ? Math.floor(Math.min(...yValues) * 0.9) : 0;
    yMax = yValues.length > 0 ? Math.ceil(Math.max(...yValues) * 1.1) : 100;
    yStep = Math.ceil((yMax - yMin) / 8);
  } else if (activeTab === 'weight') {
    yMin = 0;
    yMax = yValues.length > 0 ? Math.ceil(Math.max(...yValues) * 1.2) : 5;
    yStep = Math.ceil((yMax - yMin) / 8);
  } else {
    yMin = 0;
    yMax = yValues.length > 0 ? Math.ceil(Math.max(...yValues) * 1.2) : 200;
    yStep = Math.ceil((yMax - yMin) / 8);
  }

  // X축 라벨 (시간) - 항상 "오전12시" 형식으로 통일
  const getTimeLabel = (point: ReportDataPoint): string => {
    const hour = parseInt(point.time.split(':')[0], 10);
    if (hour === 0) return '오전12시';
    if (hour === 6) return '오전6시';
    if (hour === 12) return '오후12시';
    if (hour === 18) return '오후6시';
    // 나머지 시간도 변환
    if (hour < 12) return `오전${hour}시`;
    if (hour === 12) return '오후12시';
    return `오후${hour - 12}시`;
  };

  const totalPoints = reportData ? reportData.dataPoints.length : 0;
  // X축 틱을 0, 6, 12, 18시에 해당하는 포인트로 찾기
  const findTimeIndex = (targetHour: number): number => {
    if (!reportData) return 0;
    for (let i = 0; i < reportData.dataPoints.length; i++) {
      const hour = parseInt(reportData.dataPoints[i].time.split(':')[0], 10);
      if (hour === targetHour) return i;
    }
    // 찾지 못하면 가장 가까운 인덱스 반환
    return Math.floor((targetHour / 24) * totalPoints);
  };

  const xTickIndices = reportData
    ? [findTimeIndex(0), findTimeIndex(6), findTimeIndex(12), findTimeIndex(18)]
    : [];
  const xLabels = reportData
    ? xTickIndices.map((idx) => {
        if (idx >= 0 && idx < reportData.dataPoints.length) {
          return getTimeLabel(reportData.dataPoints[idx]);
        }
        return '';
      })
    : [];

  // Y축 틱 값 생성
  const yTickValues = Array.from({ length: 9 }, (_, i) => yMin + i * yStep);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <AppHeader title="리포트" onBack={handleBack} />
      </View>

      {/* 탭 바 */}
      <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {isLoading || !reportData ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* 제목 섹션 */}
          <View style={styles.titleSection}>
            <View style={styles.titleLeft}>
              <Text style={styles.title}>{config.title}</Text>
              <Text style={styles.subtitle}>{config.subtitle}</Text>
            </View>
            <Pressable onPress={handleRefresh} style={styles.refreshButton}>
              <Text style={styles.refreshIcon}>↻</Text>
            </Pressable>
          </View>

          {/* 차트 컨테이너 */}
          <Animated.View style={[styles.chartContainer, { opacity: chartOpacity }]}>
            <View style={[styles.chartWrapper, { marginHorizontal: -spacing.xl }]}>
              <VictoryChart
                animate={{ duration: 1000, easing: 'quadInOut' }}
                height={CHART_HEIGHT}
                padding={{ top: 10, bottom: 50, left: 30, right: 65 }}
                theme={VictoryTheme.material}
                width={CHART_WIDTH}
              >
                <VictoryAxis
                  dependentAxis
                  orientation="right"
                  style={{
                    axis: { stroke: colors.transparent },
                    grid: { stroke: colors.border, strokeWidth: 1 },
                    tickLabels: { fill: colors.mutedText, fontSize: 11 },
                  }}
                  tickFormat={(t) => {
                    const unit =
                      activeTab === 'temp'
                        ? '°C'
                        : activeTab === 'humidity'
                          ? '%'
                          : activeTab === 'weight'
                            ? 'kg'
                            : 'ppb';
                    return `${t}${unit}`;
                  }}
                  tickValues={yTickValues}
                />
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
                <VictoryLine
                  data={chartData}
                  interpolation="natural"
                  style={{
                    data: { stroke: colors.primary, strokeWidth: 3 },
                  }}
                />
              </VictoryChart>
            </View>
          </Animated.View>

          {/* 시간 범위 선택 */}
          <View style={styles.timeRangeContainer}>
            {(['1일', '1주일', '1개월', '1년'] as TimeRange[]).map((range) => (
              <Pressable
                key={range}
                onPress={() => setTimeRange(range)}
                style={[
                  styles.timeRangeButton,
                  timeRange === range && styles.timeRangeButtonActive,
                ]}
              >
                <Text
                  style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}
                >
                  {range}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* 요약 섹션 */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {activeTab === 'temp'
                  ? '현재 온도'
                  : activeTab === 'humidity'
                    ? '현재 습도'
                    : activeTab === 'weight'
                      ? '현재 급식량'
                      : '현재 향기지수'}
              </Text>
              <View style={styles.summaryValueContainer}>
                <Text style={styles.summaryValue}>
                  {reportData.summary.current}
                  {config.unit}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {activeTab === 'temp'
                  ? '최고 온도'
                  : activeTab === 'humidity'
                    ? '최고 습도'
                    : activeTab === 'weight'
                      ? '최고 급식량'
                      : '최고 향기지수'}
              </Text>
              <View style={styles.summaryValueContainer}>
                <Text style={styles.summaryValue}>
                  {reportData.summary.max.value}
                  {config.unit}
                </Text>
                <Text style={styles.summaryTime}>{reportData.summary.max.time}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {activeTab === 'temp'
                  ? '최저 온도'
                  : activeTab === 'humidity'
                    ? '최저 습도'
                    : activeTab === 'weight'
                      ? '최저 급식량'
                      : '최저 향기지수'}
              </Text>
              <View style={styles.summaryValueContainer}>
                <Text style={styles.summaryValue}>
                  {reportData.summary.min.value}
                  {config.unit}
                </Text>
                <Text style={styles.summaryTime}>{reportData.summary.min.time}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {activeTab === 'temp'
                  ? '평균 온도'
                  : activeTab === 'humidity'
                    ? '평균 습도'
                    : activeTab === 'weight'
                      ? '평균 급식량'
                      : '평균 향기지수'}
              </Text>
              <View style={styles.summaryValueContainer}>
                <Text style={styles.summaryValue}>
                  {reportData.summary.average}
                  {config.unit}
                </Text>
              </View>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowLast]}>
              <Text style={styles.summaryLabel}>기준 일자</Text>
              <View style={styles.summaryValueContainer}>
                <Text style={styles.summaryValue}>{reportData.summary.referenceDate}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: colors.transparent,
    marginTop: 0,
    padding: 0,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: spacing.xs,
    paddingBottom: 0,
    position: 'relative',
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.background,
    position: 'relative',
    zIndex: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 20,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  refreshIcon: {
    color: colors.text,
    fontSize: 18,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    marginTop: spacing.xs,
  },
  summaryContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  summaryLabel: {
    color: colors.mutedText,
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    marginRight: spacing.lg,
  },
  summaryRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingVertical: spacing.md,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  summaryTime: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    marginLeft: spacing.xs,
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  summaryValueContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexShrink: 0,
  },
  timeRangeButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  timeRangeText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  timeRangeTextActive: {
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  titleLeft: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    marginTop: spacing.lg,
  },
});
