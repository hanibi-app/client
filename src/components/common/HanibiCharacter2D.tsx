import React, { useEffect, useMemo, useRef } from 'react';

import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { HanibiLevel } from '@/constants/hanibiThresholds';

// --- 타입 정의 ---
export type HanibiCharacter2DProps = {
  level?: HanibiLevel;
  animated?: boolean;
  size?: number;
  testID?: string;
  customColor?: string;
};

// --- 색상 및 상태 설정 ---
const LEVEL_COLORS: Record<HanibiLevel, string> = {
  low: '#60a5fa', // 파란색
  medium: '#467D60', // 기본 로봇 녹색 (이미지 원본 색상)
  high: '#ef4444', // 빨간색
};

// 색상 밝기 조절 유틸리티 (입체감을 만들기 위해 필요)
const adjustColor = (hex: string, amount: number) => {
  const color = hex.replace('#', '');
  const num = parseInt(color, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export default function HanibiCharacter2D({
  level = 'medium',
  animated = true,
  size = 200,
  testID = 'hanibi-character-2d',
  customColor,
}: HanibiCharacter2DProps) {
  // 1. 색상 팔레트 생성 (그라데이션 및 입체감)
  const baseColor = customColor || LEVEL_COLORS[level];
  const palette = useMemo(() => {
    // 기본 녹색 테마일 때의 원본 색상값 유지, 그 외에는 baseColor 기반 계산
    const isDefaultGreen = baseColor === '#467D60';
    
    return {
      darkOutline: isDefaultGreen ? '#0E2C1D' : adjustColor(baseColor, -80),
      bodyBase: baseColor,
      gradientAccent: isDefaultGreen ? '#5EA382' : adjustColor(baseColor, 18),
      gradientHighlight: isDefaultGreen ? '#9CEBC3' : adjustColor(baseColor, 55),
      gloss: isDefaultGreen ? '#D7FFE9' : adjustColor(baseColor, 95),
      screenBg: isDefaultGreen ? '#0F2318' : adjustColor(baseColor, -95),
      eyeColor: isDefaultGreen ? '#C7FFE5' : '#FFFFFF',
      shadowOverlay: isDefaultGreen ? '#06120B' : adjustColor(baseColor, -120),
    };
  }, [baseColor]);

  const bodyGradientStops = useMemo(
    () => [
      palette.bodyBase,
      palette.gradientAccent,
      palette.gradientHighlight,
      palette.darkOutline,
    ],
    [
      palette.bodyBase,
      palette.gradientAccent,
      palette.gradientHighlight,
      palette.darkOutline,
    ]
  );

  // SVG 비율 (200 x 220)
  const width = size;
  const height = size * (220 / 200);

  // --- 애니메이션 로직 (기존 코드 유지 및 보완) ---
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    // 호흡 효과 (로봇이라 약간 더 절제된 움직임)
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );

    // 둥둥 떠다니는 효과
    const translateYAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateYAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
      ])
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
    outputRange: [-6, 6],
  });

  // --- 눈 렌더링 (레벨에 따른 표정 변화) ---
  const renderEyes = () => {
    const eyeY = 70;

    if (level === 'high') {
      return (
        <G stroke={palette.eyeColor} strokeWidth="6" strokeLinecap="round">
          <Path d={`M 70 ${eyeY - 10} L 90 ${eyeY + 10}`} />
          <Path d={`M 90 ${eyeY - 10} L 70 ${eyeY + 10}`} />
          <Path d={`M 110 ${eyeY - 10} L 130 ${eyeY + 10}`} />
          <Path d={`M 130 ${eyeY - 10} L 110 ${eyeY + 10}`} />
        </G>
      );
    }

    const arcProps = {
      stroke: palette.eyeColor,
      strokeWidth: 7,
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
      fill: 'none',
    };

    return (
      <G>
        <Path d={`M 50 ${eyeY + 10} A 22 22 0 0 1 90 ${eyeY - 6}`} {...arcProps} />
        <Circle cx="80" cy={eyeY + 2} r="7" fill={palette.eyeColor} stroke="none" />

        <Path d={`M 150 ${eyeY + 10} A 22 22 0 0 0 110 ${eyeY - 6}`} {...arcProps} />
        <Circle cx="120" cy={eyeY + 2} r="7" fill={palette.eyeColor} stroke="none" />
      </G>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { width, height },
      ]}
      testID={testID}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { translateY }],
        }}
      >
        <Svg width={width} height={height} viewBox="0 0 200 220" fill="none">
          <Defs>
            {/* 몸체 금속 질감 그라데이션 */}
            <LinearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              {bodyGradientStops.map((color, index) => (
                <Stop
                  key={`${color}-${index}`}
                  offset={`${(index / (bodyGradientStops.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </LinearGradient>
          </Defs>

          {/* 1. 발 (Feet) */}
          {/* <G transform="translate(0, 10)">
             <Path d="M 50 190 L 50 205 Q 50 210 60 210 L 80 210 Q 90 210 90 205 L 90 190 Z" fill={palette.darkOutline} />
             <Path d="M 110 190 L 110 205 Q 110 210 120 210 L 140 210 Q 150 210 150 205 L 150 190 Z" fill={palette.darkOutline} />
          </G> */}

          {/* 2. 몸통 (Lower Body) */}
          {/* 외곽선 (그림자 역할) */}
          <Rect x="26" y="125" width="155" height="70" rx="18" fill={palette.darkOutline} />
          {/* 본체 */}
          <Rect x="31" y="128" width="145" height="60" rx="15" fill="url(#bodyGrad)" />
          {/* 왼쪽 하이라이트 (광택) */}
          <Path
            d="M 36 135 L 36 180 Q 36 185 41 185 L 51 185 L 51 135 Z"
            fill={palette.gloss}
            fillOpacity="0.25"
          />

          {/* 3. 목 (Neck) */}
          <Rect x="60" y="115" width="80" height="15" fill={palette.darkOutline} />

          {/* 4. 머리 (Head) */}
          {/* 머리 외곽선 */}
          <Rect x="20" y="20" width="160" height="100" rx="20" fill={palette.darkOutline} />
          {/* 머리 본체 */}
          <Rect x="28" y="28" width="144" height="84" rx="15" fill="url(#bodyGrad)" opacity={0.9} />
          
          {/* 머리 상단/왼쪽 하이라이트 */}
          {/* <Path d="M 35 35 L 165 35" stroke={palette.highlight} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <Path d="M 35 35 L 35 105" stroke={palette.highlight} strokeWidth="2" strokeLinecap="round" opacity="0.6" /> */}

          {/* 5. 얼굴 스크린 (Screen) */}
          <Rect x="40" y="40" width="120" height="60" rx="8" fill={palette.screenBg} />
          {/* 스크린 내부 그림자 (Inset Shadow 효과) */}
          <Path
            d="M 40 40 L 160 40 L 160 45 L 40 45 Z"
            fill={palette.shadowOverlay}
            fillOpacity="0.35"
          />

          {/* 6. 표정 (Eyes) */}
          {renderEyes()}
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible', // 애니메이션이나 그림자가 잘리지 않도록 설정
  },
});