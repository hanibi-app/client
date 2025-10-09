import React from 'react';

import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type ToastType = 'success' | 'error' | 'info';

export type ToastMessageProps = {
  message: string;
  type?: ToastType;
  testID?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

function ToastMessageComponent({
  message,
  type = 'info',
  testID = 'toast-message',
  style,
  accessibilityLabel,
}: ToastMessageProps) {
  const backgroundStyle =
    type === 'success' ? styles.success : type === 'error' ? styles.error : styles.info;
  const textColor =
    type === 'success' ? styles.successText : type === 'error' ? styles.errorText : styles.infoText;
  return (
    <View
      style={[styles.container, backgroundStyle, style]}
      testID={testID}
      accessibilityRole="status"
      accessibilityLiveRegion="polite"
      accessibilityLabel={accessibilityLabel ?? message}
    >
      <Text style={[styles.text, textColor]}>{message}</Text>
    </View>
  );
}

const ToastMessage = React.memo(ToastMessageComponent);
export default ToastMessage;

const styles = StyleSheet.create({
  container: { borderRadius: 8, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  error: { backgroundColor: colors.danger + '20' }, // 12% opacity
  errorText: { color: colors.danger },
  info: { backgroundColor: colors.info + '20' }, // 12% opacity
  infoText: { color: colors.info },
  success: { backgroundColor: colors.success + '20' }, // 12% opacity
  successText: { color: colors.success },
  text: { fontSize: typography.sizes.md },
});
