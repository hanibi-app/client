import React, { useEffect, useRef, useState } from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import ThreeArrowIcon from '@/assets/images/three-arrow.svg';
import AppButton from '@/components/common/AppButton';
import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CameraStatusModal } from '@/components/dashboard/CameraStatusModal';
import { useSensorLatest } from '@/features/dashboard/hooks/useSensorLatest';
import {
  SensorStatus,
  calculateHealthScore,
  getGasStatus,
  getHumidityStatus,
  getTemperatureStatus,
} from '@/features/dashboard/utils/healthScore';
import { EcoScorePreviewCard } from '@/features/reports/components/EcoScorePreviewCard';
import { WeeklySummarySection } from '@/features/reports/components/WeeklySummarySection';
import { useCameraStatus } from '@/hooks/useCameraStatus';
import { DashboardStackParamList } from '@/navigation/types';
import { useCurrentDeviceId } from '@/store/deviceStore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type DashboardScreenProps = NativeStackScreenProps<DashboardStackParamList, 'Dashboard'>;

// 건강 점수 상태별 색상
const STATUS_COLORS = {
  SAFE: '#40EA87', // 초록
  CAUTION: '#FFD700', // 노랑
  WARNING: '#FF7017', // 주황
  CRITICAL: '#ED5B5B', // 빨강
};

// 건강 점수 상태별 한글
const STATUS_LABELS = {
  SAFE: '안전',
  CAUTION: '주의',
  WARNING: '경고',
  CRITICAL: '위험',
};

/**
 * 100점 기준 생명점수 레벨 계산 (4등분)
 * 0~24: CRITICAL (위험)
 * 25~49: WARNING (경고)
 * 50~74: CAUTION (주의)
 * 75~100: SAFE (안전)
 */
const getHealthScoreLevel100 = (score: number): 'SAFE' | 'CAUTION' | 'WARNING' | 'CRITICAL' => {
  if (score >= 75) return 'SAFE';
  if (score >= 50) return 'CAUTION';
  if (score >= 25) return 'WARNING';
  return 'CRITICAL';
};

// 생명점수 안내 모달 스타일
const healthScoreModalStyles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: colors.text + '59', // 35% opacity
    flex: 1,
    justifyContent: 'center',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  calculationCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  calculationText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.5,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    maxHeight: '85%',
    padding: spacing.xl,
    width: '90%',
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  confirmButton: {
    width: '100%',
  },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  highlight: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  introSection: {
    marginBottom: spacing.xl,
  },
  introText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.6,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.md,
    marginLeft: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  sensorContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sensorDescription: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * 1.4,
    marginTop: spacing.xs,
  },
  sensorIconContainer: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  sensorItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  sensorLabel: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  sensorList: {
    marginTop: spacing.md,
  },
  statusContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  statusDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  statusItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  statusLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  statusList: {
    marginTop: spacing.md,
  },
  statusRange: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
});

/**
 * 생명점수 계산 방식 안내 모달 컴포넌트
 */
function HealthScoreInfoModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const cardRef = useRef<View>(null);

  // 웹 환경에서 aria-hidden 경고 방지
  useEffect(() => {
    if (Platform.OS === 'web' && !visible && cardRef.current) {
      const element = cardRef.current as unknown as HTMLElement;
      if (element && document.activeElement && element.contains(document.activeElement)) {
        (document.activeElement as HTMLElement)?.blur();
      }
    }
  }, [visible]);

  const sensorItems = [
    {
      icon: 'thermostat' as const,
      label: '체온',
      description: '적정 온도 범위(20~30℃) 유지 시 점수 부여',
      color: '#FF6B35',
    },
    {
      icon: 'water-drop' as const,
      label: '수분컨디션',
      description: '적정 습도 범위(40~60%) 유지 시 점수 부여',
      color: '#4A90E2',
    },
    {
      icon: 'scale' as const,
      label: '급식량',
      description: '급식량이 충분할 때 점수 부여',
      color: '#7B68EE',
    },
    {
      icon: 'air' as const,
      label: '향기지수',
      description: '공기 질이 양호할 때 점수 부여',
      color: '#50C878',
    },
  ];

  const statusRanges = [
    { range: '75~100점', label: '안전 상태', color: STATUS_COLORS.SAFE },
    { range: '50~74점', label: '주의 상태', color: STATUS_COLORS.CAUTION },
    { range: '25~49점', label: '경고 상태', color: STATUS_COLORS.WARNING },
    { range: '0~24점', label: '위험 상태', color: STATUS_COLORS.CRITICAL },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      statusBarTranslucent={true}
    >
      <View
        style={healthScoreModalStyles.backdrop}
        accessibilityViewIsModal={true}
        importantForAccessibility="no-hide-descendants"
        {...(Platform.OS === 'web' && { 'aria-hidden': false })}
      >
        <Pressable
          style={healthScoreModalStyles.backdropPressable}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="모달 닫기"
        />
        <View
          ref={cardRef}
          style={healthScoreModalStyles.card}
          accessibilityRole="none"
          accessibilityLabel="생명점수 계산 방식"
          {...(Platform.OS === 'web' && { 'aria-hidden': false })}
        >
          {/* 헤더 */}
          <View style={healthScoreModalStyles.header}>
            <Text style={healthScoreModalStyles.title}>생명점수 계산 방식</Text>
            <Pressable
              onPress={onClose}
              style={healthScoreModalStyles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="닫기"
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            style={healthScoreModalStyles.scrollView}
            contentContainerStyle={healthScoreModalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 소개 */}
            <View style={healthScoreModalStyles.introSection}>
              <Text style={healthScoreModalStyles.introText}>
                생명점수는 한니비의 건강 상태를 종합적으로 평가한 점수입니다.
              </Text>
            </View>

            {/* 측정 항목 섹션 */}
            <View style={healthScoreModalStyles.section}>
              <View style={healthScoreModalStyles.sectionHeader}>
                <MaterialIcons name="sensors" size={20} color={colors.primary} />
                <Text style={healthScoreModalStyles.sectionTitle}>측정 항목</Text>
              </View>
              <Text style={healthScoreModalStyles.sectionSubtitle}>
                각 센서별로 최대 10점씩 부여됩니다
              </Text>
              <View style={healthScoreModalStyles.sensorList}>
                {sensorItems.map((item, index) => (
                  <View key={index} style={healthScoreModalStyles.sensorItem}>
                    <View
                      style={[
                        healthScoreModalStyles.sensorIconContainer,
                        { backgroundColor: item.color + '20' },
                      ]}
                    >
                      <MaterialIcons name={item.icon} size={20} color={item.color} />
                    </View>
                    <View style={healthScoreModalStyles.sensorContent}>
                      <Text style={healthScoreModalStyles.sensorLabel}>{item.label}</Text>
                      <Text style={healthScoreModalStyles.sensorDescription}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* 점수 계산 섹션 */}
            <View style={healthScoreModalStyles.section}>
              <View style={healthScoreModalStyles.sectionHeader}>
                <MaterialIcons name="calculate" size={20} color={colors.primary} />
                <Text style={healthScoreModalStyles.sectionTitle}>점수 계산</Text>
              </View>
              <View style={healthScoreModalStyles.calculationCard}>
                <Text style={healthScoreModalStyles.calculationText}>
                  4개 센서 점수를 합산하여 총{' '}
                  <Text style={healthScoreModalStyles.highlight}>0~40점</Text>을 계산하고,
                </Text>
                <Text style={healthScoreModalStyles.calculationText}>
                  이를 <Text style={healthScoreModalStyles.highlight}>100점 만점</Text>으로
                  변환합니다.
                </Text>
              </View>
            </View>

            {/* 상태 구간 섹션 */}
            <View style={healthScoreModalStyles.section}>
              <View style={healthScoreModalStyles.sectionHeader}>
                <MaterialIcons name="bar-chart" size={20} color={colors.primary} />
                <Text style={healthScoreModalStyles.sectionTitle}>상태 구간</Text>
              </View>
              <View style={healthScoreModalStyles.statusList}>
                {statusRanges.map((status, index) => (
                  <View key={index} style={healthScoreModalStyles.statusItem}>
                    <View
                      style={[healthScoreModalStyles.statusDot, { backgroundColor: status.color }]}
                    />
                    <View style={healthScoreModalStyles.statusContent}>
                      <Text style={healthScoreModalStyles.statusRange}>{status.range}</Text>
                      <Text style={healthScoreModalStyles.statusLabel}>{status.label}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* 하단 버튼 */}
          <View style={healthScoreModalStyles.footer}>
            <AppButton
              label="확인"
              variant="primary"
              onPress={onClose}
              style={healthScoreModalStyles.confirmButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [isCameraModalVisible, setCameraModalVisible] = useState(false);
  const [isHealthScoreModalVisible, setIsHealthScoreModalVisible] = useState(false);
  const { cameraStatus, isChecking, error: cameraError, refresh } = useCameraStatus();

  // 현재 선택된 기기 ID 가져오기 (deviceStore에서)
  // 기본값으로 기존 하드코딩된 값 사용 (호환성 유지)
  const deviceId = useCurrentDeviceId('HANIBI-ESP32-001');

  // 센서 데이터 조회 (5초마다 자동 폴링)
  const {
    data: sensorData,
    isLoading: isSensorLoading,
    isError: isSensorError,
    refetch: refetchSensor,
  } = useSensorLatest(deviceId);

  // 상태 바 너비 계산 (패딩 제외)
  const STATUS_BAR_WIDTH = SCREEN_WIDTH - spacing.xl * 2;
  const STATUS_BAR_HEIGHT = 16; // 바 높이 (더 굵게)

  // 화살표 애니메이션
  const arrowAnim = useRef(new Animated.Value(0)).current;

  // 리포트보기 버튼 펄스 애니메이션
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;

  // 화살표 애니메이션 효과
  useEffect(() => {
    // 위아래로 움직이는 애니메이션 (무한 반복)
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim, {
          duration: 1000,
          toValue: 1,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          duration: 1000,
          toValue: 0,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [arrowAnim]);

  // 리포트보기 버튼 펄스 애니메이션 효과
  useEffect(() => {
    // 커졌다 작아지는 펄스 애니메이션 (무한 반복)
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulseAnim, {
          duration: 1500,
          toValue: 1.03,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulseAnim, {
          duration: 1500,
          toValue: 1,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [buttonPulseAnim]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCamera = () => {
    setCameraModalVisible(true);
  };

  const handleViewReport = () => {
    navigation.navigate('Reports');
  };

  const handleViewEcoScore = () => {
    navigation.navigate('EcoScore');
  };

  const handleCloseCameraModal = () => setCameraModalVisible(false);

  const handleModalViewReport = () => {
    handleCloseCameraModal();
    handleViewReport();
  };

  const handleLinkCctvSettings = () => {
    handleCloseCameraModal();
    // TODO: CCTV 설정 화면이 준비되면 해당 화면으로 이동하도록 연결
    // - navigation.navigate(ROOT_ROUTES.CAMERA_SETTINGS) 사용
    // - 또는 새로운 CameraSettingsScreen 생성 후 연결
    // - 관련 이슈: #CCTV설정화면
    console.log('CCTV 연결 설정 화면으로 이동');
  };

  useEffect(() => {
    if (isCameraModalVisible) {
      refresh();
    }
  }, [isCameraModalVisible, refresh]);

  /**
   * 센서 상태에 따른 색상을 반환합니다.
   */
  const getStatusColor = (status: SensorStatus): string => {
    switch (status) {
      case 'SAFE':
        return STATUS_COLORS.SAFE;
      case 'CAUTION':
        return STATUS_COLORS.CAUTION;
      case 'WARNING':
        return STATUS_COLORS.WARNING;
      default:
        return STATUS_COLORS.CRITICAL;
    }
  };

  /**
   * 상태 바 위치를 계산합니다.
   * 100점 기준 점수를 퍼센트로 변환합니다.
   * 0점 → 0%, 100점 → 100%
   */
  const getStatusBarPosition = (score100: number): number => {
    // 100점 기준 점수를 그대로 퍼센트로 사용
    return score100;
  };

  // 센서 데이터가 없으면 로딩 또는 에러 처리
  if (isSensorLoading && !sensorData) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>대시보드</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={[styles.content, styles.loadingContainer]}>
          <LoadingSpinner message="센서 데이터를 불러오는 중..." />
        </View>
      </View>
    );
  }

  if (isSensorError || !sensorData) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>대시보드</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={[styles.content, styles.errorContainer]}>
          <View style={styles.errorCharacterContainer}>
            <HanibiCharacter2D size={120} emotion="sad" animated={true} />
          </View>
          <Text style={styles.errorText}>센서 데이터를 불러오지 못했어요. 다시 시도해 주세요.</Text>
          <Pressable onPress={() => refetchSensor()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // 디버그 모드: 더미데이터 사용 (45점 = 경고 상태)
  const DEBUG_MODE = true;
  const dummyHealthScore100 = DEBUG_MODE ? 45 : 0;

  // 건강 점수 계산 (0~40점)
  const healthScore = calculateHealthScore({
    temperature: sensorData.temperature,
    humidity: sensorData.humidity,
    weight: sensorData.weight,
    gas: sensorData.gas,
  });

  // 100점 기준으로 변환 (0~40점 → 0~100점)
  // 디버그 모드에서는 더미데이터 사용
  const healthScore100 = DEBUG_MODE ? dummyHealthScore100 : (healthScore.score / 40) * 100;

  // 100점 기준으로 레벨 재계산 (4등분)
  const healthScoreLevel100 = getHealthScoreLevel100(healthScore100);
  const statusLabel = STATUS_LABELS[healthScoreLevel100];
  // 화살표 위치는 100점 기준 점수에 따라 계산
  const indicatorPosition = getStatusBarPosition(healthScore100);

  // 각 센서별 상태
  const tempStatus = getTemperatureStatus(sensorData.temperature);
  const humidityStatus = getHumidityStatus(sensorData.humidity);
  const gasStatus = getGasStatus(sensorData.gas);
  const weightStatus: SensorStatus = sensorData.weight > 0 ? 'SAFE' : 'WARNING';

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>대시보드</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 메인 타이틀 섹션 */}
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>한니비의</Text>
            <View style={styles.titleRow}>
              <Text style={[styles.titleText, styles.titleHighlight]}>건강 분석 결과예</Text>
              <Text style={styles.titleText}>요</Text>
            </View>
          </View>
          <Pressable onPress={handleCamera} style={styles.cameraButton}>
            <View style={styles.cameraIconContainer}>
              <FontAwesome name="camera" size={18} color={colors.white} />
            </View>
          </Pressable>
        </View>
        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 생명점수 섹션 */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreLabel}>생명점수</Text>
            <Pressable
              onPress={() => setIsHealthScoreModalVisible(true)}
              style={styles.questionMarkButton}
              accessibilityLabel="생명점수 계산 방식 안내"
              accessibilityHint="생명점수 계산 방식에 대한 설명을 보려면 탭하세요"
            >
              <MaterialIcons name="help-outline" size={20} color={colors.mutedText} />
            </Pressable>
          </View>
          <Text style={styles.scoreDescription}>
            총 {Math.round(healthScore100)}점으로 {statusLabel} 상태에 속해 있어요
          </Text>

          {/* 건강 상태 바 */}
          <View style={styles.statusBarContainer}>
            {/* 그라데이션 바 (양 끝이 둥근 형태) */}
            <View style={styles.statusBarWrapper}>
              <Svg height={STATUS_BAR_HEIGHT} width={STATUS_BAR_WIDTH} style={styles.statusBarSvg}>
                <Defs>
                  <SvgLinearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor={STATUS_COLORS.CRITICAL} stopOpacity="1" />
                    <Stop offset="33.33%" stopColor={STATUS_COLORS.WARNING} stopOpacity="1" />
                    <Stop offset="66.66%" stopColor={STATUS_COLORS.CAUTION} stopOpacity="1" />
                    <Stop offset="100%" stopColor={STATUS_COLORS.SAFE} stopOpacity="1" />
                  </SvgLinearGradient>
                </Defs>
                {/* 양 끝이 둥근 캡 형태 */}
                <Rect
                  width={STATUS_BAR_WIDTH}
                  height={STATUS_BAR_HEIGHT}
                  rx={STATUS_BAR_HEIGHT / 2}
                  fill="url(#healthGradient)"
                />
              </Svg>
              {/* 인디케이터 삼각형 (그래프 위에 위치) */}
              <View style={styles.indicatorContainer}>
                <View
                  style={[
                    styles.indicatorTriangle,
                    styles.indicatorTrianglePosition,
                    {
                      left: `${indicatorPosition}%`,
                      borderTopColor: getStatusColor(healthScoreLevel100 as SensorStatus),
                    },
                  ]}
                />
              </View>
            </View>
            {/* 상태 라벨들 */}
            <View style={styles.statusLabels}>
              <Text style={styles.statusLabelText}>위험</Text>
              <Text style={styles.statusLabelText}>경고</Text>
              <Text style={styles.statusLabelText}>주의</Text>
              <Text style={styles.statusLabelText}>안전</Text>
            </View>
          </View>
        </View>

        {/* 환경 점수 미리보기 카드 */}
        <View style={styles.ecoScoreContainer}>
          <EcoScorePreviewCard onPress={handleViewEcoScore} />
        </View>

        {/* 주간 성과 요약 섹션 */}
        <View style={styles.weeklySummaryContainer}>
          <WeeklySummarySection />
        </View>

        {/* 메트릭 카드들 */}
        <View style={styles.metricsGrid}>
          {/* 체온 */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(tempStatus),
                  },
                ]}
              />
              <Text style={styles.metricLabel}>체온 (온도)</Text>
            </View>
            <Text style={styles.metricValue}>
              {isSensorLoading ? '—' : `${Math.round(sensorData.temperature)} °C`}
            </Text>
          </View>

          {/* 수분컨디션 */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(humidityStatus),
                  },
                ]}
              />
              <Text style={styles.metricLabel}>수분컨디션 (습도)</Text>
            </View>
            <Text style={styles.metricValue}>
              {isSensorLoading ? '—' : `${Math.round(sensorData.humidity)} %`}
            </Text>
          </View>

          {/* 급식량 */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(weightStatus),
                  },
                ]}
              />
              <Text style={styles.metricLabel}>급식량 (무게)</Text>
            </View>
            <Text style={styles.metricValue}>
              {isSensorLoading ? '—' : `${sensorData.weight.toFixed(1)} kg`}
            </Text>
          </View>

          {/* 향기지수 */}
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(gasStatus),
                  },
                ]}
              />
              <Text style={styles.metricLabel}>향기지수 (VOC)</Text>
            </View>
            <Text style={styles.metricValue}>
              {isSensorLoading ? '—' : `${Math.round(sensorData.gas)} ppb`}
            </Text>
          </View>
        </View>

        {/* 안내 텍스트 */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            환경점수를 올리려면{'\n'}어떤 부분을 바꿔야 하는지 확인해 보세요!
          </Text>
          <Animated.View
            style={[
              styles.arrowContainer,
              {
                transform: [
                  {
                    translateY: arrowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 8],
                    }),
                  },
                ],
              },
            ]}
          >
            <ThreeArrowIcon width={22} height={34} />
          </Animated.View>
        </View>

        {/* 리포트보기 버튼 */}
        <Animated.View
          style={[
            styles.reportButtonContainer,
            {
              transform: [{ scale: buttonPulseAnim }],
            },
          ]}
        >
          <AppButton
            label="리포트보기"
            onPress={handleViewReport}
            variant="primary"
            size="lg"
            style={styles.reportButton}
            textColor={colors.black}
          />
        </Animated.View>
      </ScrollView>

      <CameraStatusModal
        visible={isCameraModalVisible}
        status={cameraStatus}
        isChecking={isChecking}
        errorMessage={cameraError}
        onClose={handleCloseCameraModal}
        onPrimaryAction={handleModalViewReport}
        onLinkPress={handleLinkCctvSettings}
      />

      {/* 생명점수 계산 방식 안내 모달 */}
      <HealthScoreInfoModal
        visible={isHealthScoreModalVisible}
        onClose={() => setIsHealthScoreModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  arrowContainer: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
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
  cameraButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  cameraIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 22,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginTop: spacing.md,
    width: '100%',
  },
  ecoScoreContainer: {
    marginTop: spacing.xl,
  },
  errorCharacterContainer: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  errorContainer: {
    justifyContent: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    marginTop: spacing.xs,
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
  infoSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  infoText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
  },
  metricCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 2,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '48%',
  },
  metricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  metricLabel: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.xs,
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    width: '100%',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  questionMarkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  reportButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '100%',
  },
  reportButtonContainer: {
    marginTop: spacing.lg,
    width: '100%',
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
  scoreDescription: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    marginTop: spacing.md,
  },
  scoreHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  scoreLabel: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  scoreSection: {
    marginTop: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  statusBarContainer: {
    marginTop: spacing.lg,
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
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusLabelText: {
    color: colors.mutedText,
    flex: 1,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  statusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    width: '100%',
  },
  titleContainer: {
    flex: 1,
  },
  titleHighlight: {
    color: colors.primary,
  },
  titleRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  titleSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleText: {
    color: colors.black,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  weeklySummaryContainer: {
    marginTop: spacing.xl,
  },
});
