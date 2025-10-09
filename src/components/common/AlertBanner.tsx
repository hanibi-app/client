import React from 'react';

import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export type AlertBannerProps = {
  type?: AlertType;
  message: string;
  testID?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

function AlertBannerComponent({
  type = 'info',
  message,
  testID = 'alert-banner',
  style,
  accessibilityLabel,
}: AlertBannerProps) {
  const styleByType = getStyle(type);
  return (
    <View
      style={[styles.container, styleByType.container, style]}
      testID={testID}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={accessibilityLabel ?? message}
    >
      <Text style={[styles.text, styleByType.text]}>{message}</Text>
    </View>
  );
}

const AlertBanner = React.memo(AlertBannerComponent);
export default AlertBanner;

function getStyle(type: AlertType) {
  switch (type) {
    case 'success':
      return {
        container: { backgroundColor: '#ecfdf5', borderColor: colors.success },
        text: { color: colors.success },
      };
    case 'warning':
      return {
        container: { backgroundColor: '#fffbeb', borderColor: colors.warning },
        text: { color: colors.warning },
      };
    case 'error':
      return {
        container: { backgroundColor: '#fef2f2', borderColor: colors.danger },
        text: { color: colors.danger },
      };
    default:
      return {
        container: { backgroundColor: '#eff6ff', borderColor: colors.info },
        text: { color: colors.info },
      };
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
  },
  text: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
  },
});
