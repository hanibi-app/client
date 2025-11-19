import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type ReportTabType = 'temp' | 'humidity' | 'weight' | 'voc';

export type ReportTabsProps = {
  activeTab: ReportTabType;
  onTabChange: (tab: ReportTabType) => void;
};

const TABS: Array<{ id: ReportTabType; label: string; subtitle: string }> = [
  { id: 'temp', label: '체온', subtitle: '(온도)' },
  { id: 'humidity', label: '수분 컨디션', subtitle: '(습도)' },
  { id: 'weight', label: '급식량', subtitle: '(무게)' },
  { id: 'voc', label: '향기지수', subtitle: '(VOC)' },
];

export default function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            <Text style={[styles.tabSubtitle, isActive && styles.tabSubtitleActive]}>
              {tab.subtitle}
            </Text>
            {isActive && <View style={styles.underline} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.sm,
  },
  tabActive: {},
  tabLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  tabSubtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  tabSubtitleActive: {
    color: colors.primary,
  },
  underline: {
    backgroundColor: colors.primary,
    bottom: 0,
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
  },
});
