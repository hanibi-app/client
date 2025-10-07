import { getHanibiLevel, HanibiMetric } from '@/constants/hanibiThresholds';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export type HanibiStateProps = {
  metric: HanibiMetric; // 'temp' | 'hum' | 'index'
  value: number;
  unitOverride?: string;
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  onPress?: () => void;
  testID?: string;
};

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 } as const;

export default function HanibiState({
  metric,
  value,
  unitOverride,
  progress,
  size = 120,
  strokeWidth = 10,
  animated = false,
  onPress,
  testID = 'hanibi-state',
}: HanibiStateProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const level = getHanibiLevel(metric, value);
  const color = colors.hanibi[metric][level];
  const unit = unitOverride ?? (metric === 'temp' ? '°C' : metric === 'hum' ? '%' : '지수');
  const metricLabel = metric === 'temp' ? '온도' : metric === 'hum' ? '습도' : '지수';
  const levelLabel = level === 'low' ? '낮음' : level === 'medium' ? '보통' : '높음';

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressValue = React.useRef(new Animated.Value(clamped)).current;

  React.useEffect(() => {
    if (!animated) {
      progressValue.setValue(clamped);
      return;
    }
    Animated.timing(progressValue, {
      toValue: clamped,
      duration: 240,
      useNativeDriver: false,
    }).start();
  }, [clamped, animated, progressValue]);

  const strokeDashoffset = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const a11y = `현재 ${metricLabel} ${value}${unit}, ${levelLabel}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={HIT_SLOP}
      pressRetentionOffset={HIT_SLOP}
      accessibilityRole={onPress ? 'button' : 'summary'}
      accessibilityLabel={a11y}
      testID={testID}
      style={[styles.container, { width: size, height: size }]}
    >
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={'#e5e7eb'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset as unknown as number}
            fill="none"
            rotation="-90"
            originX={size / 2}
            originY={size / 2}
          />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.metric}>{metricLabel}</Text>
          <Text style={[styles.value, { color }]}>
            {value}
            <Text style={styles.unit}>{unit}</Text>
          </Text>
          <Text style={styles.level}>{levelLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle as unknown as React.ComponentType<any>);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  metric: { fontSize: typography.sizes.sm, color: '#6b7280' },
  value: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold },
  unit: { fontSize: typography.sizes.md, color: '#6b7280' },
  level: { fontSize: typography.sizes.sm, color: '#6b7280' },
});


