import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type BottomTabBarProps = {
  tabs: string[];
  activeTab: string;
  onChangeTab: (tab: string) => void;
  testID?: string;
};

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 } as const;

export default function BottomTabBar({
  tabs,
  activeTab,
  onChangeTab,
  testID = 'bottom-tab-bar',
}: BottomTabBarProps) {
  return (
    <View style={styles.container} testID={testID} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const focused = tab === activeTab;
        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab}
            hitSlop={HIT_SLOP}
            pressRetentionOffset={HIT_SLOP}
            style={[styles.tab, focused && styles.tabActive]}
            onPress={() => onChangeTab(tab)}
          >
            <Text style={[styles.label, focused && styles.labelActive]}>{tab}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  label: {
    color: colors.mutedText,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
  },
  labelActive: {
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.md,
  },
  tabActive: {
    backgroundColor: colors.secondary,
  },
});
