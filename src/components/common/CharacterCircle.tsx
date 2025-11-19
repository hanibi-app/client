import React from 'react';

import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/Colors';

import HanibiCharacter2D from './HanibiCharacter2D';

type CharacterCircleProps = {
  size: number;
  backgroundColor?: string;
  level?: 'low' | 'medium' | 'high';
  animated?: boolean;
};

export default function CharacterCircle({
  size,
  backgroundColor = colors.primary,
  level = 'medium',
  animated = true,
}: CharacterCircleProps) {
  const characterSize = Math.floor(size * 0.6);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderRadius: size / 2,
          height: size,
          width: size,
        },
      ]}
    >
      <HanibiCharacter2D level={level} animated={animated} size={characterSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
