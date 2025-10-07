import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export type SwitchRowProps = {
  label: string;
  value: boolean;
  onToggle: (next: boolean) => void;
  testID?: string;
};

export default function SwitchRow({ label, value, onToggle, testID = 'switch-row' }: SwitchRowProps) {
  return (
    <View style={styles.container} testID={testID} accessibilityRole="switch" accessibilityLabel={label}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  label: { fontSize: typography.sizes.md, color: colors.text },
});


