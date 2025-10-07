import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

export type InputFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
  testID?: string;
  accessibilityLabel?: string;
};

export default function InputField({ value, onChangeText, placeholder, keyboardType, testID = 'input-field', accessibilityLabel }: InputFieldProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      style={styles.input}
      returnKeyType="done"
      blurOnSubmit={Platform.OS === 'ios'}
      keyboardAppearance={Platform.OS === 'ios' ? 'default' : undefined}
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? placeholder ?? '입력'}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
});


