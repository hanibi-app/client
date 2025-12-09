import React, { useEffect, useMemo, useRef, useState } from 'react';

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
import { useSensorReport } from '@/features/reports/hooks/useSensorReport';
import { DashboardStackParamList } from '@/navigation/types';
import { DEBUG_DEVICE_ID, useCurrentDeviceId } from '@/store/deviceStore';
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

// 시간 범위 타입 (API는 '1일', '1주', '1개월' 형식을 기대)
type TimeRange = '1일' | '1주일' | '1개월' | '1년';

// ReportTabType을 API 타입으로 변환하는 함수
const mapTabTypeToApiType = (tabType: ReportTabType): string => {
  const mapping: Record<ReportTabType, string> = {
    temp: 'temperature',
    humidity: 'humidity',
    weight: 'weight',
    voc: 'voc',
  };
  return mapping[tabType];
};

// TimeRange를 API 형식으로 변환하는 함수
const mapTimeRangeToApiRange = (range: TimeRange): string => {
  const mapping: Record<TimeRange, string> = {
    '1일': '1일',
    '1주일': '1주',
    '1개월': '1개월',
    '1년': '1년',
  };
  return mapping[range];
};

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

/**
 * 더미 데이터 생성 함수 (최적화된 원래 방식)
 * 디버그 모드에서 사용할 시계열 데이터를 생성합니다.
 * QA 테스트를 위해 즉시 표시되도록 최적화했습니다.
 */
const generateDummyData = (type: ReportTabType, range: TimeRange): ReportData => {
  const now = new Date();
  const dataPoints: ReportDataPoint[] = [];

  // 범위별 시간 수 결정 및 샘플링 (성능 최적화)
  let hours: number;
  let sampleInterval: number; // 샘플링 간격 (1년 데이터는 샘플링)

  if (range === '1일') {
    hours = 24;
    sampleInterval = 1; // 1시간마다
  } else if (range === '1주일') {
    hours = 168;
    sampleInterval = 1; // 1시간마다
  } else if (range === '1개월') {
    hours = 720;
    sampleInterval = 1; // 1시간마다
  } else {
    // 1년: 샘플링하여 데이터 포인트 수 감소 (성능 최적화)
    hours = 8760;
    sampleInterval = 24; // 24시간(1일)마다 샘플링
  }

  // 타입별 기본값 설정
  let baseValue: number;
  if (type === 'temp') baseValue = 25;
  else if (type === 'humidity') baseValue = 50;
  else if (type === 'weight') baseValue = 1.2;
  else baseValue = 100; // voc

  // 데이터 포인트 생성 (최적화: 샘플링 및 배치 처리)
  const values: number[] = [];

  // 사전 계산된 sin 값 (성능 최적화)
  const twoPi = Math.PI * 2;
  const hoursDivisor = hours;

  // 데이터 포인트 생성 (최적화: 샘플링 및 배치 처리)
  // 1일과 1년 모두 제대로 생성되도록 보장
  const totalSamples = Math.ceil(hours / sampleInterval);

  for (let sampleIdx = 0; sampleIdx < totalSamples; sampleIdx++) {
    const i = sampleIdx * sampleInterval;
    const timestamp = now.getTime() - (hours - i) * 60 * 60 * 1000;
    const date = new Date(timestamp);
    const hour = date.getHours();

    // 원래 방식: sin 함수로 주기적 변화 + 랜덤 변동 (최적화)
    const sinValue = Math.sin((i / hoursDivisor) * twoPi);
    const variation = sinValue * (baseValue * 0.3);
    const randomVariation = (Math.random() - 0.5) * (baseValue * 0.1);
    const value = Math.max(0, baseValue + variation + randomVariation);
    const roundedValue = Number(value.toFixed(1));

    values.push(roundedValue);
    dataPoints.push({
      time: `${String(hour).padStart(2, '0')}:00`,
      value: roundedValue,
      timestamp,
    });
  }

  // 데이터 포인트가 비어있지 않은지 확인
  if (dataPoints.length === 0) {
    console.warn(
      `[generateDummyData] 데이터 포인트가 생성되지 않음: ${type}, ${range}, hours: ${hours}, sampleInterval: ${sampleInterval}`,
    );
  }

  // 요약 정보 계산 (최적화: 한 번에 처리)
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const maxIndex = values.indexOf(maxVal);
  const minIndex = values.indexOf(minVal);

  // 시간 포맷 변환 (원래 방식: "HH시")
  const formatTimeForSummary = (index: number): string => {
    const actualIndex = index * sampleInterval; // 샘플링된 인덱스를 실제 시간으로 변환
    const hourIndex = Math.floor(actualIndex / (hours / 24));
    return `${String(hourIndex).padStart(2, '0')}시`;
  };

  return {
    dataPoints,
    summary: {
      current: values[values.length - 1],
      max: {
        value: maxVal,
        time: formatTimeForSummary(maxIndex),
      },
      min: {
        value: minVal,
        time: formatTimeForSummary(minIndex),
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

  // 현재 기기 ID 확인 (디버그 모드 감지용)
  const currentDeviceId = useCurrentDeviceId();
  const isDebugMode = currentDeviceId === DEBUG_DEVICE_ID;

  // API 타입으로 변환
  const apiType = mapTabTypeToApiType(activeTab);
  const apiRange = mapTimeRangeToApiRange(timeRange);

  // 디버그 모드가 아닐 때만 실제 API 호출
  const {
    data: apiReportData,
    isLoading: isApiLoading,
    isError: isApiError,
    refetch: refetchApi,
  } = useSensorReport(apiType, apiRange, {
    enabled: !isDebugMode, // 디버그 모드일 때는 API 호출 비활성화
  });

  // refetch를 위한 강제 리렌더링용 상태
  const [refreshKey, setRefreshKey] = useState(0);

  // 디버그 모드일 때는 더미 데이터 사용 (useMemo로 즉시 생성 및 캐싱)
  // refreshKey를 의존성에 포함하여 refetch 시 재계산
  const dummyData = useMemo(() => {
    if (isDebugMode) {
      // 디버그 모드: 더미 데이터 즉시 생성 (QA 테스트용 최적화)
      const data = generateDummyData(activeTab, timeRange);
      // 디버그: 데이터 생성 확인
      if (__DEV__) {
        console.log(
          `[ReportsScreen] 더미 데이터 생성: ${activeTab}, ${timeRange}, 포인트 수: ${data.dataPoints.length}`,
        );
      }
      return data;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDebugMode, activeTab, timeRange, refreshKey]);

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
  const reportData = isDebugMode ? dummyData : apiReportData;
  const isLoading = isDebugMode ? false : isApiLoading;
  const isError = isDebugMode ? false : isApiError;

  // 차트 애니메이션
  const chartOpacity = useRef(new Animated.Value(0)).current;

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
    refetch();
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

  // Y축 범위 계산 (타입별로 다른 범위 - 원래 방식)
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

  // X축 라벨 포맷팅 함수 (범위별로 다른 형식, timestamp 활용)
  const formatXAxisLabel = (
    dataPoint: { time: string; timestamp?: number },
    range: TimeRange,
  ): string => {
    // timestamp가 있으면 사용, 없으면 time 문자열에서 파싱
    let date: Date;
    if (dataPoint.timestamp) {
      date = new Date(dataPoint.timestamp);
    } else {
      // time 문자열에서 시간 추출 (HH:mm 형식)
      const hour = parseInt(dataPoint.time.split(':')[0], 10);
      date = new Date();
      date.setHours(hour, 0, 0, 0);
    }

    const hour = date.getHours();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (range === '1일') {
      // 1일: "오전12시", "오전6시" 형식
      if (hour === 0) return '오전12시';
      if (hour === 6) return '오전6시';
      if (hour === 12) return '오후12시';
      if (hour === 18) return '오후6시';
      if (hour < 12) return `오전${hour}시`;
      return `오후${hour - 12}시`;
    } else if (range === '1주일') {
      // 1주일: "월", "화", "수" 형식 (요일만)
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return days[date.getDay()];
    } else if (range === '1개월') {
      // 1개월: "1/1", "1/5", "1/10" 형식 (월/일)
      return `${month}/${day}`;
    } else {
      // 1년: "1월", "3월", "5월" 형식 (홀수 월만)
      return `${month}월`;
    }
  };

  // 범위별 X축 틱 계산 (겹침 방지)
  const calculateXTicks = (): { indices: number[]; labels: string[] } => {
    if (!reportData || reportData.dataPoints.length === 0) {
      return { indices: [], labels: [] };
    }

    const totalPoints = reportData.dataPoints.length;
    const indices: number[] = [];
    const labels: string[] = [];

    if (timeRange === '1일') {
      // 1일: 0, 6, 12, 18시 (4개) - 정확히 해당 시간의 포인트 찾기
      const targetHours = [0, 6, 12, 18];
      const foundIndices = new Set<number>();

      for (const targetHour of targetHours) {
        // 해당 시간에 정확히 일치하는 포인트 찾기
        for (let i = 0; i < totalPoints; i++) {
          const point = reportData.dataPoints[i];
          // timestamp가 있으면 사용, 없으면 time에서 파싱
          const pointWithTimestamp = point as
            | ReportDataPoint
            | { time: string; timestamp?: number };
          let hour: number;

          if (pointWithTimestamp.timestamp) {
            const date = new Date(pointWithTimestamp.timestamp);
            hour = date.getHours();
          } else {
            hour = parseInt(point.time.split(':')[0], 10);
          }

          // 정확히 일치하고 아직 추가되지 않은 경우
          if (hour === targetHour && !foundIndices.has(i)) {
            foundIndices.add(i);
            indices.push(i);
            labels.push(formatXAxisLabel(point, timeRange));
            break; // 해당 시간의 첫 번째 포인트만 사용
          }
        }
      }

      // 정렬 (인덱스 순서대로)
      const sortedPairs = indices
        .map((idx, i) => ({ idx, label: labels[i] }))
        .sort((a, b) => a.idx - b.idx);
      return {
        indices: sortedPairs.map((p) => p.idx),
        labels: sortedPairs.map((p) => p.label),
      };
    } else if (timeRange === '1주일') {
      // 1주일: 월, 화, 수, 목, 금, 토, 일 (7개) - 각 요일의 첫 번째 포인트
      const foundDays = new Set<number>();

      for (let i = 0; i < totalPoints; i++) {
        const point = reportData.dataPoints[i];
        const pointWithTimestamp = point as ReportDataPoint | { time: string; timestamp?: number };
        const date = pointWithTimestamp.timestamp
          ? new Date(pointWithTimestamp.timestamp)
          : new Date();
        if (!pointWithTimestamp.timestamp) {
          const hour = parseInt(point.time.split(':')[0], 10);
          date.setHours(hour, 0, 0, 0);
        }

        const dayOfWeek = date.getDay();
        if (!foundDays.has(dayOfWeek)) {
          foundDays.add(dayOfWeek);
          indices.push(i);
          labels.push(formatXAxisLabel(point, timeRange));
          if (foundDays.size === 7) break;
        }
      }
    } else if (timeRange === '1개월') {
      // 1개월: 1일, 5일, 10일, 15일, 20일, 25일, 30일 (2월은 28일까지)
      // 단, 월이 바뀌는 지점(30일 다음 1일)은 겹치지 않도록 처리
      const targetDays = [1, 5, 10, 15, 20, 25, 30];
      const foundDays = new Set<string>(); // "월/일" 형식으로 저장하여 월별 구분
      const minIndexGap = Math.max(2, Math.floor(totalPoints / 8)); // 최소 인덱스 간격 (레이블 겹침 방지)

      for (let i = 0; i < totalPoints; i++) {
        const point = reportData.dataPoints[i];
        const pointWithTimestamp = point as ReportDataPoint | { time: string; timestamp?: number };
        const date = pointWithTimestamp.timestamp
          ? new Date(pointWithTimestamp.timestamp)
          : new Date();
        if (!pointWithTimestamp.timestamp) {
          const hour = parseInt(point.time.split(':')[0], 10);
          date.setHours(hour, 0, 0, 0);
        }

        const day = date.getDate();
        const month = date.getMonth() + 1; // 1-12
        const lastDayOfMonth = new Date(date.getFullYear(), month, 0).getDate();

        // 2월이고 30일을 찾으려고 하면 28일로 변경
        const adjustedTargetDays =
          month === 2 && lastDayOfMonth === 28 ? targetDays.filter((d) => d <= 28) : targetDays;

        // 월/일 조합으로 고유 키 생성
        const dayKey = `${month}/${day}`;

        if (adjustedTargetDays.includes(day)) {
          // 이미 추가된 날짜인지 확인 (같은 월/일 조합)
          if (!foundDays.has(dayKey)) {
            // 최소 간격 체크: 마지막 인덱스와의 거리
            const canAdd = indices.length === 0 || i - indices[indices.length - 1] >= minIndexGap;

            if (canAdd) {
              foundDays.add(dayKey);
              indices.push(i);
              labels.push(formatXAxisLabel(point, timeRange));
            } else if (day === 1 && indices.length > 0) {
              // 1일은 우선적으로 선택 (월이 바뀌는 지점)
              // 마지막 인덱스가 30일이면 제거하고 1일 추가
              const lastIdx = indices[indices.length - 1];
              const lastPoint = reportData.dataPoints[lastIdx];
              const lastPointWithTimestamp = lastPoint as
                | ReportDataPoint
                | { time: string; timestamp?: number };
              const lastDate = lastPointWithTimestamp.timestamp
                ? new Date(lastPointWithTimestamp.timestamp)
                : new Date();
              if (!lastPointWithTimestamp.timestamp) {
                const hour = parseInt(lastPoint.time.split(':')[0], 10);
                lastDate.setHours(hour, 0, 0, 0);
              }
              const lastDay = lastDate.getDate();

              // 마지막이 30일이고 현재가 1일이면 30일 제거하고 1일 추가
              if (lastDay === 30 || lastDay === 28) {
                indices.pop();
                labels.pop();
                const lastKey = `${lastDate.getMonth() + 1}/${lastDay}`;
                foundDays.delete(lastKey);
              }
              foundDays.add(dayKey);
              indices.push(i);
              labels.push(formatXAxisLabel(point, timeRange));
            }
          }
        }
      }
    } else {
      // 1년: 1월, 3월, 5월, 7월, 9월, 11월 (홀수 월만, 6개)
      const targetMonths = [1, 3, 5, 7, 9, 11];
      const foundMonths = new Set<number>();

      for (let i = 0; i < totalPoints; i++) {
        const point = reportData.dataPoints[i];
        const pointWithTimestamp = point as ReportDataPoint | { time: string; timestamp?: number };
        const date = pointWithTimestamp.timestamp
          ? new Date(pointWithTimestamp.timestamp)
          : new Date();
        if (!pointWithTimestamp.timestamp) {
          const hour = parseInt(point.time.split(':')[0], 10);
          date.setHours(hour, 0, 0, 0);
        }

        const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
        if (targetMonths.includes(month) && !foundMonths.has(month)) {
          foundMonths.add(month);
          indices.push(i);
          labels.push(formatXAxisLabel(point, timeRange));
          if (foundMonths.size === 6) break;
        }
      }
    }

    return { indices, labels };
  };

  const { indices: xTickIndices, labels: xLabels } = calculateXTicks();

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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>리포트 데이터를 불러오는 중...</Text>
        </View>
      ) : isError || !reportData ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>데이터를 불러오지 못했습니다.</Text>
          <Pressable onPress={handleRefresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </Pressable>
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

          {/* 차트 컨테이너 - 원래 방식으로 렌더링 */}
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
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
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
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
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
