import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

export type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  testID?: string;
};

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 } as const;

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  accessibilityLabel,
  testID = 'app-button',
}: AppButtonProps) {
  const { container, text } = getVariantStyles(variant, disabled);

  const a11yLabel = accessibilityLabel ?? label;

  const handlePress = () => {
    if (disabled) return;
    onPress();
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      hitSlop={HIT_SLOP}
      pressRetentionOffset={HIT_SLOP}
      style={[styles.base, container, style]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={[styles.text, text]}>{label}</Text>
    </Pressable>
  );
}

function getVariantStyles(variant: AppButtonVariant, disabled: boolean) {
  if (variant === 'secondary') {
    return {
      container: [
        styles.secondary,
        disabled ? styles.disabled : undefined,
      ] as ViewStyle[],
      text: styles.secondaryText,
    };
  }
  if (variant === 'ghost') {
    return {
      container: [
        styles.ghost,
        disabled ? styles.disabledGhost : undefined,
      ] as ViewStyle[],
      text: styles.ghostText,
    };
  }
  return {
    container: [styles.primary, disabled ? styles.disabled : undefined] as ViewStyle[],
    text: styles.primaryText,
  };
}

const MIN_TOUCH_SIZE = 44;

const styles = StyleSheet.create({
  base: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primaryText: {
    color: colors.primaryForeground,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.secondaryForeground,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  ghostText: {
    color: colors.ghostForeground,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledGhost: {
    opacity: 0.5,
  },
});


