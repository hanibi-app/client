import React, { useCallback } from 'react';

import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/common/AppButton';
import AppHeader from '@/components/common/AppHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCameraSnapshot } from '@/features/dashboard/hooks/useCameraSnapshot';
import { RootStackParamList } from '@/navigation/types';
import { useCurrentDeviceId } from '@/store/deviceStore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/**
 * 카메라 미리보기 디버그 화면
 * 개발자 모드에서 디버그 기기의 카메라 스냅샷을 확인할 수 있는 화면입니다.
 */
export default function CameraPreviewDebugScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused(); // 화면 포커스 상태 확인
  const deviceId = useCurrentDeviceId();

  // 카메라 스냅샷 조회 (화면이 포커스되어 있을 때만 폴링 - 최적화)
  const {
    data: snapshot,
    isLoading,
    isError,
    error,
    refetch,
  } = useCameraSnapshot(deviceId, {
    refetchInterval: isFocused ? 30000 : false, // 포커스되어 있을 때만 30초마다 폴링 (429 에러 방지)
  });

  /**
   * 수동으로 스냅샷을 새로고침합니다.
   */
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <AppHeader
          title="카메라 미리보기"
          onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 기기 정보 */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>기기 ID:</Text>
          <Text style={styles.infoValue}>{deviceId}</Text>
        </View>

        {/* 로딩 상태 */}
        {isLoading && (
          <View style={styles.centerContainer}>
            <LoadingSpinner message="카메라 스냅샷을 불러오는 중..." />
          </View>
        )}

        {/* 에러 상태 */}
        {isError && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>카메라 스냅샷을 불러오지 못했어요.</Text>
            {error && (
              <Text style={styles.errorDetail}>
                {error instanceof Error ? error.message : '알 수 없는 오류'}
              </Text>
            )}
            <AppButton
              label="다시 시도"
              onPress={handleRefresh}
              variant="primary"
              size="md"
              style={styles.retryButton}
            />
          </View>
        )}

        {/* 스냅샷 이미지 */}
        {!isLoading && !isError && snapshot && (
          <View style={styles.imageContainer}>
            {snapshot.imageUrl ? (
              <Image
                source={{ uri: snapshot.imageUrl }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>이미지 URL이 없어요.</Text>
              </View>
            )}
            {snapshot.timestamp && (
              <Text style={styles.timestampText}>
                생성 시간: {new Date(snapshot.timestamp).toLocaleString('ko-KR')}
              </Text>
            )}
          </View>
        )}

        {/* 새로고침 버튼 */}
        {!isLoading && (
          <View style={styles.buttonContainer}>
            <AppButton label="새로고침" onPress={handleRefresh} variant="secondary" size="lg" />
          </View>
        )}

        {/* 안내 텍스트 */}
        <View style={styles.noteSection}>
          <Text style={styles.noteText}>
            ※ 이 화면은 개발자 모드 전용입니다.{'\n'}※ 카메라 스냅샷은 10초마다 자동으로 갱신됩니다.
            (최적화됨)
            {'\n'}※ TODO: 실제 카메라 API 엔드포인트 및 응답 스펙이 확정되면 업데이트 필요
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: spacing.xl,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    paddingVertical: spacing.xl,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  errorDetail: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  headerContainer: {
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    borderRadius: 12,
    height: 300,
    width: '100%',
  },
  imageContainer: {
    marginTop: spacing.lg,
  },
  infoLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  infoValue: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  noteSection: {
    marginTop: spacing.xl,
  },
  noteText: {
    color: colors.mutedTextLight,
    fontSize: typography.sizes.xs,
    lineHeight: 18,
    textAlign: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: 12,
    height: 300,
    justifyContent: 'center',
    width: '100%',
  },
  placeholderText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
  },
  retryButton: {
    marginTop: spacing.md,
  },
  timestampText: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
