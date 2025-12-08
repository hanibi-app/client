import React, { useCallback } from 'react';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/common/AppButton';
import AppHeader from '@/components/common/AppHeader';
import { ROOT_ROUTES, MAIN_TAB_ROUTES, DASHBOARD_STACK_ROUTES } from '@/constants/routes';
import { RootStackParamList } from '@/navigation/types';
import { DEBUG_DEVICE_ID, useDeviceStore } from '@/store/deviceStore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function DeveloperModeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { currentDeviceId, setCurrentDeviceId, setDebugDevice, clearCurrentDevice } =
    useDeviceStore();

  /**
   * 디버그 기기를 현재 기기로 설정합니다.
   */
  const handleUseDebugDevice = useCallback(() => {
    setDebugDevice();
    Alert.alert('완료', '디버그 기기를 선택했어요.');
  }, [setDebugDevice]);

  /**
   * 기본 기기로 되돌립니다.
   */
  const handleResetToDefault = useCallback(() => {
    clearCurrentDevice();
    Alert.alert('완료', '기본 기기로 되돌렸어요.');
  }, [clearCurrentDevice]);

  /**
   * 디버그 기기로 대시보드를 엽니다.
   */
  const handleOpenDashboard = useCallback(() => {
    setDebugDevice();
    // MainTabs로 이동
    navigation.navigate(ROOT_ROUTES.MAIN_TABS);
    // TODO: MainTabs 내부에서 Dashboard 탭으로 자동 이동하는 기능이 필요할 수 있음
    // 현재는 사용자가 수동으로 Dashboard 탭을 선택해야 함
  }, [navigation, setDebugDevice]);

  /**
   * 디버그 기기로 카메라 미리보기를 엽니다.
   */
  const handleOpenCamera = useCallback(() => {
    setDebugDevice();
    navigation.navigate(ROOT_ROUTES.CAMERA_PREVIEW_DEBUG);
  }, [navigation, setDebugDevice]);

  /**
   * 디버그 기기로 리포트 스크린을 엽니다.
   */
  const handleOpenReports = useCallback(() => {
    setDebugDevice();
    // MainTabs로 이동
    // TODO: 중첩 네비게이션 타입 문제로 인해 현재는 MainTabs로만 이동
    // 사용자가 Dashboard 탭을 선택한 후 "리포트보기" 버튼을 눌러야 함
    // 또는 navigationRef를 사용하여 직접 이동하는 방법 고려 필요
    navigation.navigate(ROOT_ROUTES.MAIN_TABS);
    Alert.alert(
      '알림',
      '디버그 기기를 선택했어요.\n대시보드 탭에서 "리포트보기" 버튼을 눌러주세요.',
    );
  }, [navigation, setDebugDevice]);

  /**
   * 디버그 기기를 생성 및 페어링합니다.
   * 실제 백엔드 API를 호출하여 디버그 기기를 등록합니다.
   */
  const handleCreateAndPairDebugDevice = useCallback(async () => {
    try {
      // TODO: 디버그 기기 실제 생성/등록 API와 연동
      // 현재는 단순히 debugDeviceId만 사용하는 방식으로 구현
      // 실제 백엔드에 디버그 기기를 생성하는 API가 있다면:
      // const { devicesApi } = await import('@/api/devicesApi');
      // const device = await devicesApi.pairDevice({
      //   deviceId: DEBUG_DEVICE_ID,
      //   deviceName: '디버그 기기',
      // });
      // setCurrentDeviceId(device.deviceId);

      // 지금은 단순히 디버그 기기 ID를 설정만 함
      setDebugDevice();
      Alert.alert('완료', '디버그 기기를 선택했어요.\n(실제 생성 API는 TODO)');
    } catch (error) {
      console.error('[DeveloperModeScreen] 디버그 기기 생성 실패:', error);
      Alert.alert('오류', '디버그 기기 생성에 실패했어요.');
    }
  }, [setDebugDevice, setCurrentDeviceId]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <AppHeader
          title="개발자 모드"
          onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 디버그 기기 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>디버그 기기 정보</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>현재 선택된 기기:</Text>
              <Text style={styles.infoValue}>{currentDeviceId || '없음'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>디버그 기기 ID:</Text>
              <Text style={styles.infoValue}>{DEBUG_DEVICE_ID}</Text>
            </View>
          </View>
        </View>

        {/* 기기 선택 버튼 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기기 선택</Text>
          <View style={styles.buttonGroup}>
            <AppButton
              label="디버그 기기 사용하기"
              onPress={handleUseDebugDevice}
              variant="primary"
              size="lg"
              style={styles.button}
            />
            <AppButton
              label="기본 기기로 되돌리기"
              onPress={handleResetToDefault}
              variant="secondary"
              size="lg"
              style={styles.button}
            />
          </View>
        </View>

        {/* 빠른 이동 버튼 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>빠른 이동</Text>
          <View style={styles.buttonGroup}>
            <AppButton
              label="디버그 기기로 대시보드 열기"
              onPress={handleOpenDashboard}
              variant="primary"
              size="lg"
              style={styles.button}
            />
            <AppButton
              label="디버그 기기로 리포트 열기"
              onPress={handleOpenReports}
              variant="primary"
              size="lg"
              style={styles.button}
            />
            <AppButton
              label="디버그 기기로 카메라 미리보기 열기"
              onPress={handleOpenCamera}
              variant="primary"
              size="lg"
              style={styles.button}
            />
          </View>
        </View>

        {/* 디버그 기기 생성 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>디버그 기기 생성</Text>
          <View style={styles.buttonGroup}>
            <AppButton
              label="디버그 기기 생성 및 페어링"
              onPress={handleCreateAndPairDebugDevice}
              variant="secondary"
              size="lg"
              style={styles.button}
            />
          </View>
          <Text style={styles.noteText}>
            ※ 실제 백엔드에 디버그 기기를 생성하는 API가 있다면,{'\n'}
            해당 API를 호출하여 디버그 기기를 등록할 수 있습니다.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: spacing.md,
  },
  buttonGroup: {
    marginTop: spacing.md,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  headerContainer: {
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  infoLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoValue: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  noteText: {
    color: colors.mutedTextLight,
    fontSize: typography.sizes.xs,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
