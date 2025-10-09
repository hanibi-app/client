import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type AppHeaderProps = {
  title: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
};

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 } as const;

export default function AppHeader({
  title,
  onBack,
  rightIcon,
  accessibilityLabel,
  testID = 'app-header',
}: AppHeaderProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel ?? title}
      testID={testID}
    >
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로"
          hitSlop={HIT_SLOP}
          pressRetentionOffset={HIT_SLOP}
          onPress={onBack}
          style={styles.left}
        >
          <Text style={styles.backText}>{'‹'}</Text>
        </Pressable>
      ) : (
        <View style={styles.left} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>{rightIcon}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  backText: { color: colors.text, fontSize: 24 },
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  left: { alignItems: 'flex-start', width: 48 },
  right: { alignItems: 'flex-end', width: 48 },
  title: {
    color: colors.text,
    flex: 1,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
});
