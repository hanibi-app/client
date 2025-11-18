import React, { useEffect, useRef } from 'react';

import { Animated, StyleSheet, View } from 'react-native';

import { HanibiLevel } from '@/constants/hanibiThresholds';
import { colors } from '@/theme/Colors';

export type HanibiCharacter2DProps = {
  level?: HanibiLevel;
  animated?: boolean;
  size?: number;
  testID?: string;
};

// 레벨별 색상 정의
const LEVEL_COLORS: Record<HanibiLevel, string> = {
  low: '#60a5fa', // 파란색 (쾌적)
  medium: '#90EE90', // 연두색 (온보딩/기본)
  high: '#ef4444', // 빨간색 (주의)
};

export default function HanibiCharacter2D({
  level = 'medium',
  animated = true,
  size = 200,
  testID = 'hanibi-character-2d',
}: HanibiCharacter2DProps) {
  const color = LEVEL_COLORS[level];
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) {
      return;
    }

    // 호흡 효과 (크기 변화)
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    // 상하 움직임
    const translateYAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateYAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    );

    scaleAnimation.start();
    translateYAnimation.start();

    return () => {
      scaleAnimation.stop();
      translateYAnimation.stop();
    };
  }, [animated, scaleAnim, translateYAnim]);

  const translateY = translateYAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  const bodySize = size * 0.7;
  const eyeSize = size * 0.08;
  const eyeOffset = size * 0.15;
  const smileWidth = size * 0.3;
  const cheekSize = size * 0.06;
  const cheekOffset = size * 0.25;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.characterWrapper,
          {
            transform: [{ scale: scaleAnim }, { translateY }],
          },
        ]}
      >
        {/* 메인 바디 (물방울 모양) */}
        <View
          style={[
            styles.body,
            {
              width: bodySize,
              height: bodySize,
              backgroundColor: color,
              borderRadius: bodySize / 2,
            },
          ]}
        >
          {/* 눈 (왼쪽) */}
          <View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize,
                borderRadius: eyeSize / 2,
                left: bodySize / 2 - eyeOffset - eyeSize / 2,
                top: bodySize * 0.3,
              },
            ]}
          >
            {/* 눈 하이라이트 */}
            <View
              style={[
                styles.eyeHighlight,
                {
                  width: eyeSize * 0.4,
                  height: eyeSize * 0.4,
                  borderRadius: eyeSize * 0.2,
                },
              ]}
            />
          </View>

          {/* 눈 (오른쪽) */}
          <View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize,
                borderRadius: eyeSize / 2,
                right: bodySize / 2 - eyeOffset - eyeSize / 2,
                top: bodySize * 0.3,
              },
            ]}
          >
            {/* 눈 하이라이트 */}
            <View
              style={[
                styles.eyeHighlight,
                {
                  width: eyeSize * 0.4,
                  height: eyeSize * 0.4,
                  borderRadius: eyeSize * 0.2,
                  right: eyeSize * 0.15,
                },
              ]}
            />
          </View>

          {/* 입 (미소) */}
          <View
            style={[
              styles.smile,
              {
                width: smileWidth,
                height: smileWidth * 0.5,
                borderRadius: smileWidth / 2,
                top: bodySize * 0.55,
                left: bodySize / 2 - smileWidth / 2,
              },
            ]}
          />

          {/* 볼 터치 (왼쪽) */}
          <View
            style={[
              styles.cheek,
              {
                width: cheekSize,
                height: cheekSize,
                borderRadius: cheekSize / 2,
                left: bodySize / 2 - cheekOffset - cheekSize / 2,
                top: bodySize * 0.5,
              },
            ]}
          />

          {/* 볼 터치 (오른쪽) */}
          <View
            style={[
              styles.cheek,
              {
                width: cheekSize,
                height: cheekSize,
                borderRadius: cheekSize / 2,
                right: bodySize / 2 - cheekOffset - cheekSize / 2,
                top: bodySize * 0.5,
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  characterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cheek: {
    backgroundColor: colors.blushPink,
    opacity: 0.6,
    position: 'absolute',
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    overflow: 'visible',
  },
  eye: {
    backgroundColor: colors.black,
    position: 'absolute',
  },
  eyeHighlight: {
    backgroundColor: colors.white,
    left: '20%',
    position: 'absolute',
    top: '20%',
  },
  smile: {
    borderBottomColor: colors.black,
    borderBottomWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    position: 'absolute',
  },
});
