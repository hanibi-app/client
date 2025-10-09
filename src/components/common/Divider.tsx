import React from 'react';

import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';

export type DividerProps = {
  color?: string;
  margin?: number;
  testID?: string;
  thickness?: number;
  inset?: number;
  style?: ViewStyle;
};

function DividerComponent({
  color = colors.border,
  margin = spacing.md,
  thickness = StyleSheet.hairlineWidth,
  inset = 0,
  style,
  testID = 'divider',
}: DividerProps) {
  return (
    <View
      style={[
        styles.line,
        { backgroundColor: color, marginVertical: margin, height: thickness, marginLeft: inset },
        style,
      ]}
      testID={testID}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, width: '100%' },
});

const Divider = React.memo(DividerComponent);
export default Divider;
