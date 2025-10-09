import React from 'react';

import { Pressable, StyleSheet, ViewStyle } from 'react-native';

export type IconButtonProps = {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  color?: string; // Consumers can set via passed icon
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
};

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 } as const;
const MIN_TOUCH = 44;

function IconButtonComponent({
  icon,
  onPress,
  size = 24,
  style,
  testID = 'icon-button',
  accessibilityLabel = '아이콘 버튼',
  accessibilityHint,
  disabled = false,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      pressRetentionOffset={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || undefined }}
      testID={testID}
      style={[
        styles.base,
        {
          width: Math.max(size + 20, MIN_TOUCH),
          height: Math.max(size + 20, MIN_TOUCH),
        },
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
    >
      {icon}
    </Pressable>
  );
}

const IconButton = React.memo(IconButtonComponent);
export default IconButton;

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
});
