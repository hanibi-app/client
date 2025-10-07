import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type InfoCardProps = {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  testID?: string;
};

export default function InfoCard({ title, value, unit, icon, testID = 'info-card' }: InfoCardProps) {
  return (
    <View style={styles.container} accessibilityRole="summary" accessibilityLabel={`${title} ${value}${unit ?? ''}`} testID={testID}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>
          {value}
          {unit ? <Text style={styles.unit}> {unit}</Text> : null}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: { marginRight: spacing.md },
  content: { flex: 1 },
  title: { color: colors.mutedText, fontSize: typography.sizes.sm },
  value: { color: colors.text, fontSize: typography.sizes.xl, fontWeight: typography.weights.bold },
  unit: { color: colors.mutedText, fontSize: typography.sizes.md },
});


