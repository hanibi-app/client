import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export type DividerProps = {
  color?: string;
  margin?: number;
  testID?: string;
};

export default function Divider({ color = colors.border, margin = spacing.md, testID = 'divider' }: DividerProps) {
  return <View style={[styles.line, { backgroundColor: color, marginVertical: margin }]} testID={testID} accessibilityLabel="구분선" />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, width: '100%' },
});


