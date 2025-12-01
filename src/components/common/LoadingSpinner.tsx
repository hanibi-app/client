import React from 'react';

import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type LoadingSpinnerProps = {
  /**
   * 로딩 메시지 (선택사항)
   */
  message?: string;
  /**
   * 스피너 크기 ('small' | 'large')
   * @default 'large'
   */
  size?: 'small' | 'large';
  /**
   * 스피너 색상
   * @default colors.primary
   */
  color?: string;
  /**
   * 컨테이너 스타일
   */
  containerStyle?: ViewStyle;
  /**
   * 전체 화면 오버레이로 표시할지 여부
   * @default false
   */
  fullScreen?: boolean;
  /**
   * 테스트 ID
   */
  testID?: string;
};

/**
 * 로딩 스피너 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <LoadingSpinner />
 *
 * // 메시지와 함께
 * <LoadingSpinner message="로딩 중..." />
 *
 * // 전체 화면 오버레이
 * <LoadingSpinner fullScreen message="데이터를 불러오는 중..." />
 * ```
 */
function LoadingSpinnerComponent({
  message,
  size = 'large',
  color = colors.primary,
  containerStyle,
  fullScreen = false,
  testID = 'loading-spinner',
}: LoadingSpinnerProps) {
  const containerStyles = [styles.container, fullScreen && styles.fullScreen, containerStyle];

  return (
    <View style={containerStyles} testID={testID}>
      <ActivityIndicator size={size} color={color} testID={`${testID}-indicator`} />
      {message && (
        <Text style={styles.message} testID={`${testID}-message`}>
          {message}
        </Text>
      )}
    </View>
  );
}

const LoadingSpinner = React.memo(LoadingSpinnerComponent);
export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    zIndex: 9999,
  },
  message: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
