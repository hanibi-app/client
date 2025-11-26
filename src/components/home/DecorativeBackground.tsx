import React from 'react';

import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';

type DecorativeBackgroundProps = {
  rectangleColor: string;
};

export const DecorativeBackground = ({ rectangleColor }: DecorativeBackgroundProps) => {
  return (
    <View style={styles.decorativeElements}>
      <View style={[styles.yellowRectangle, { backgroundColor: rectangleColor }]} />
      <View style={styles.whiteDot1} />
      <View style={styles.whiteDot2} />
      <View style={styles.pinkStar1}>
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            d="M12 2L14.09 8.26L20 9.27L15 13.14L16.18 19.02L12 15.77L7.82 19.02L9 13.14L4 9.27L9.91 8.26L12 2Z"
            fill="#FFB6C1"
          />
        </Svg>
      </View>
      <View style={styles.pinkStar2}>
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Path
            d="M12 2L14.09 8.26L20 9.27L15 13.14L16.18 19.02L12 15.77L7.82 19.02L9 13.14L4 9.27L9.91 8.26L12 2Z"
            fill="#FFB6C1"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  decorativeElements: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  pinkStar1: {
    position: 'absolute',
    right: '15%',
    top: '40%',
    zIndex: 0,
  },
  pinkStar2: {
    position: 'absolute',
    right: '12%',
    top: '45%',
    zIndex: 0,
  },
  whiteDot1: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 8,
    left: spacing.xl,
    position: 'absolute',
    top: '25%',
    width: 8,
    zIndex: 0,
  },
  whiteDot2: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 8,
    position: 'absolute',
    right: '18%',
    top: '55%',
    width: 8,
    zIndex: 0,
  },
  yellowRectangle: {
    borderRadius: 20,
    height: 40,
    left: spacing.xl,
    position: 'absolute',
    top: spacing.lg,
    width: 120,
    zIndex: 0,
  },
});
