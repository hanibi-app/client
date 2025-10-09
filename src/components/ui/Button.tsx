import React from 'react';

import { ActivityIndicator, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { Colors, ComponentShadows, Spacing, Typography } from '../../constants/DesignSystem';

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
      borderRadius: Spacing.sm,
      ...ComponentShadows.button.default,
    };

    // 크기별 스타일
    const sizeStyles = {
      small: {
        height: 32,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
      },
      medium: {
        height: 40,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
      },
      large: {
        height: 48,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
      },
    };

    // 변형별 스타일
    const variantStyles = {
      primary: {
        backgroundColor: Colors.light.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: Colors.light.secondary,
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.light.primary,
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
      ...Typography.button,
      textAlign: 'center',
    };

    // 변형별 텍스트 색상
    const variantTextColors = {
      primary: Colors.light.background,
      secondary: Colors.light.text,
      outline: Colors.light.primary,
      ghost: Colors.light.primary,
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
    marginRight: leftIcon ? Spacing.xs : 0,
    marginLeft: rightIcon ? Spacing.xs : 0,
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
          color={variant === 'primary' ? Colors.light.background : Colors.light.primary}
        />
      ) : (
        <>
          {leftIcon && <span style={iconStyle}>{leftIcon}</span>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <span style={iconStyle}>{rightIcon}</span>}
        </>
      )}
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   // 추가 스타일이 필요한 경우 여기에 정의
// });

export default Button;
