import React from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useProgressWaveAnimation } from '@/hooks/useProgressWaveAnimation';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ProgressBarProps = {
  progress: number;
  description: string;
  textColor?: string;
};

export const ProgressBar = ({
  progress,
  description,
  textColor = colors.text,
}: ProgressBarProps) => {
  const { progressWidth, waveOffset } = useProgressWaveAnimation(progress);

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
          <Animated.View style={[styles.progressBarGradient, { left: waveOffset }]}>
            <LinearGradient
              colors={[
                '#6BE092',
                '#FFD700',
                '#6BE092',
                '#FFD700',
                '#6BE092',
                '#FFD700',
                '#6BE092',
                '#FFD700',
                '#6BE092',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </Animated.View>
      </View>
      <Text style={[styles.progressText, { color: textColor }]}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    width: '100%',
  },
  progressBarBackground: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 28,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    borderRadius: 12,
    height: '100%',
    overflow: 'hidden',
  },
  progressBarGradient: {
    borderRadius: 12,
    height: '100%',
    position: 'absolute',
    width: '200%',
  },
  progressText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
