import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type ToastType = 'success' | 'error' | 'info';

export type ToastMessageProps = {
  message: string;
  type?: ToastType;
  testID?: string;
};

export default function ToastMessage({ message, type = 'info', testID = 'toast-message' }: ToastMessageProps) {
  const style = type === 'success' ? styles.success : type === 'error' ? styles.error : styles.info;
  const textColor = type === 'success' ? styles.successText : type === 'error' ? styles.errorText : styles.infoText;
  return (
    <View style={[styles.container, style]} testID={testID} accessibilityRole="status" accessibilityLabel={message}>
      <Text style={[styles.text, textColor]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: 8 },
  text: { fontSize: typography.sizes.md },
  success: { backgroundColor: '#ecfdf5' },
  successText: { color: colors.success },
  error: { backgroundColor: '#fef2f2' },
  errorText: { color: colors.danger },
  info: { backgroundColor: '#eff6ff' },
  infoText: { color: colors.info },
});


