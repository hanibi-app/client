import React from 'react';

import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { colors, componentShadows, spacing, typography } from '@/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  // 버튼 스타일 결정
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.sm,
      ...componentShadows.button.default,
    };

    // 크기별 스타일
    const sizeStyles = {
      small: {
        height: 32,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
      },
      medium: {
        height: 40,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
      },
      large: {
        height: 48,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
      },
    };

    // 변형별 스타일
    const variantStyles = {
      primary: {
        backgroundColor: colors.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: colors.secondary,
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
    };

    // 상태별 스타일
    const stateStyles: ViewStyle = {};
    if (disabled) {
      stateStyles.backgroundColor = '#F5F5F5';
      stateStyles.opacity = 0.6;
      stateStyles.shadowOpacity = 0;
    }

    if (fullWidth) {
      stateStyles.width = '100%';
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...stateStyles,
      ...style,
    };
  };

  // 텍스트 스타일 결정
  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontFamily: typography.fontFamily,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.medium,
      letterSpacing: 0.4,
      textAlign: 'center',
    };

    // 변형별 텍스트 색상
    const variantTextColors = {
      primary: colors.primaryForeground,
      secondary: colors.text,
      outline: colors.primary,
      ghost: colors.primary,
    };

    const textColor = disabled ? '#9E9E9E' : variantTextColors[variant];

    return {
      ...baseTextStyle,
      color: textColor,
      ...textStyle,
    };
  };

  // 아이콘 스타일
  const iconStyle = {
    marginRight: leftIcon ? spacing.xs : 0,
    marginLeft: rightIcon ? spacing.xs : 0,
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.primaryForeground : colors.primary}
        />
      ) : (
        <>
          {leftIcon && <View style={iconStyle}>{leftIcon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <View style={iconStyle}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   // 추가 스타일이 필요한 경우 여기에 정의
// });

export default Button;
