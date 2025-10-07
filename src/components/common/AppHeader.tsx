import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type AppHeaderProps = {
  title: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
};

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 } as const;

export default function AppHeader({ title, onBack, rightIcon, accessibilityLabel, testID = 'app-header' }: AppHeaderProps) {
  return (
    <View style={styles.container} accessibilityRole="header" accessibilityLabel={accessibilityLabel ?? title} testID={testID}>
      {onBack ? (
        <Pressable accessibilityRole="button" accessibilityLabel="뒤로" hitSlop={HIT_SLOP} pressRetentionOffset={HIT_SLOP} onPress={onBack} style={styles.left}>
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
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  left: { width: 48, alignItems: 'flex-start' },
  right: { width: 48, alignItems: 'flex-end' },
  backText: { fontSize: 24, color: colors.text },
});


