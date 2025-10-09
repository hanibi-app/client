import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

export type SwitchRowProps = {
  label: string;
  value: boolean;
  onToggle: (next: boolean) => void;
  testID?: string;
};

export default function SwitchRow({ label, value, onToggle, testID = 'switch-row' }: SwitchRowProps) {
  const onPressRow = () => onToggle(!value);

  return (
    <Pressable
      style={styles.container}
      testID={testID}
      onPress={onPressRow}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      pressRetentionOffset={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  label: { fontSize: typography.sizes.md, color: colors.text },
});


