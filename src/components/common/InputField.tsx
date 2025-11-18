import React from 'react';

import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type InputFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
  testID?: string;
  accessibilityLabel?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  isPassword?: boolean;
};

export default function InputField({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  testID = 'input-field',
  accessibilityLabel,
  label,
  helperText,
  errorText,
  isPassword = false,
}: InputFieldProps) {
  const [focused, setFocused] = React.useState(false);

  const a11yLabel = accessibilityLabel ?? label ?? placeholder ?? '입력';
  const a11yHint = helperText;
  const invalid = Boolean(errorText);

  return (
    <View>
      {label ? (
        <Text style={styles.label} accessibilityElementsHidden>
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={[
          styles.input,
          focused ? styles.inputFocused : undefined,
          invalid ? styles.inputError : undefined,
        ]}
        returnKeyType="done"
        blurOnSubmit={Platform.OS === 'ios'}
        keyboardAppearance={Platform.OS === 'ios' ? 'default' : undefined}
        testID={testID}
        accessibilityLabel={a11yLabel}
        accessibilityHint={a11yHint}
        accessibilityState={{ disabled: false, selected: false }}
        secureTextEntry={isPassword}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: colors.danger,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginTop: spacing.xs,
  },
  helperText: {
    color: colors.mutedText,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  input: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.text,
    fontSize: typography.sizes.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  label: {
    color: colors.mutedText,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
});
