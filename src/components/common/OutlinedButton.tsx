import React from 'react';

import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type OutlinedButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  testID?: string;
};

export default function OutlinedButton({
  label,
  onPress,
  style,
  labelStyle,
  disabled = false,
  testID = 'outlined-button',
}: OutlinedButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.buttonDisabled : null,
        pressed ? styles.buttonPressed : null,
        style,
      ]}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  label: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.md * 1.4,
  },
});
