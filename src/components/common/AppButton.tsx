import React from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost';
export type AppButtonSize = 'sm' | 'md' | 'lg';

export type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
  textColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 } as const;

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  testID = 'app-button',
  textColor,
  containerStyle,
}: AppButtonProps) {
  const { container, text } = getVariantStyles(variant, disabled);
  const sizeStyle = getSizeStyle(size);

  const a11yLabel = accessibilityLabel ?? label;

  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityState={{ disabled: disabled || loading, busy: loading || undefined }}
      hitSlop={HIT_SLOP}
      pressRetentionOffset={HIT_SLOP}
      style={[styles.base, sizeStyle, container, containerStyle, style]}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getSpinnerColor(variant)} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
          <Text style={[styles.text, text, textColor ? { color: textColor } : undefined]}>
            {label}
          </Text>
          {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

function getVariantStyles(variant: AppButtonVariant, disabled: boolean) {
  if (variant === 'secondary') {
    return {
      container: [styles.secondary, disabled ? styles.disabled : undefined] as ViewStyle[],
      text: styles.secondaryText,
    };
  }
  if (variant === 'ghost') {
    return {
      container: [styles.ghost, disabled ? styles.disabledGhost : undefined] as ViewStyle[],
      text: styles.ghostText,
    };
  }
  return {
    container: [styles.primary, disabled ? styles.disabled : undefined] as ViewStyle[],
    text: styles.primaryText,
  };
}

function getSpinnerColor(variant: AppButtonVariant): string {
  if (variant === 'primary') return colors.primaryForeground;
  if (variant === 'secondary') return colors.secondaryForeground;
  return colors.ghostForeground;
}

function getSizeStyle(size: AppButtonSize): ViewStyle {
  if (size === 'sm') {
    return {
      minHeight: 36,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 6,
    };
  }
  if (size === 'lg') {
    return {
      minHeight: 48,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: 10,
    };
  }
  return {
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  };
}

const MIN_TOUCH_SIZE = 44;

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    minWidth: MIN_TOUCH_SIZE,
  },
  contentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledGhost: {
    opacity: 0.5,
  },
  ghost: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  ghostText: {
    color: colors.ghostForeground,
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primaryText: {
    color: colors.primaryForeground,
  },
  rightIcon: {
    marginLeft: spacing.xs,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.secondaryForeground,
  },
  text: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
});
