import React from 'react';

import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/Colors';
import { typography } from '@/theme/typography';

export type ScreenHeaderProps = {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  testID?: string;
};

export default function ScreenHeader({
  title,
  containerStyle,
  titleStyle,
  testID = 'screen-header',
}: ScreenHeaderProps) {
  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
});
