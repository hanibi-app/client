import { useEffect, useMemo, useRef, useState } from 'react';

import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { HanibiLevel } from '@/constants/hanibiThresholds';

// --- 타입 정의 ---
export type HanibiCharacter2DProps = {
  level?: HanibiLevel;
  animated?: boolean;
  size?: number;
  testID?: string;
  customColor?: string;
  emotion?: 'normal' | 'sad';
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
  emotion = 'normal',
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
    [palette.bodyBase, palette.gradientAccent, palette.gradientHighlight, palette.darkOutline],
  );

  // SVG 비율 (200 x 220) - 팔 애니메이션을 위한 여유 공간 확보를 위해 크기 조정
  const width = size * 0.85;
  const height = size * 0.85 * (220 / 200);

  // --- 애니메이션 로직 (기존 코드 유지 및 보완) ---
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const leftArmRotateAnim = useRef(new Animated.Value(0)).current;
  const rightArmRotateAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const tearLeftAnim = useRef(new Animated.Value(0)).current;
  const tearRightAnim = useRef(new Animated.Value(0)).current;
  const tearWaveLeftAnim = useRef(new Animated.Value(0)).current;
  const tearWaveRightAnim = useRef(new Animated.Value(0)).current;

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
      ]),
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
      ]),
    );

    // 팔 흔들림 애니메이션 (같은 일정한 각도로 동기화)
    const armAnimationDuration = 3000;
    const leftArmAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(leftArmRotateAnim, {
          toValue: 1,
          duration: armAnimationDuration,
          useNativeDriver: false, // SVG transform은 native driver 미지원
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(leftArmRotateAnim, {
          toValue: 0,
          duration: armAnimationDuration,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    );

    // 오른쪽 팔 흔들림 애니메이션 (왼쪽과 같은 각도, 같은 타이밍)
    const rightArmAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rightArmRotateAnim, {
          toValue: 1,
          duration: armAnimationDuration,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(rightArmRotateAnim, {
          toValue: 0,
          duration: armAnimationDuration,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    );

    // 눈 깜빡임 애니메이션 (3-5초마다 자연스럽게)
    const runBlinkAnimation = () => {
      const delay = 3000 + Math.random() * 2000; // 3-5초 랜덤 딜레이
      const blinkSequence = Animated.sequence([
        Animated.delay(delay),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false, // SVG 애니메이션은 native driver 미지원
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
          easing: Easing.in(Easing.quad),
        }),
      ]);

      blinkSequence.start(() => {
        // 애니메이션 완료 후 다시 시작 (재귀)
        runBlinkAnimation();
      });
    };

    runBlinkAnimation();

    // 슬픈 표정일 때 눈물 떨어지는 애니메이션 (물결 효과)
    let tearAnimation: Animated.CompositeAnimation | null = null;
    let tearRightAnimation: Animated.CompositeAnimation | null = null;
    let tearWaveLeftAnimation: Animated.CompositeAnimation | null = null;
    let tearWaveRightAnimation: Animated.CompositeAnimation | null = null;

    if (emotion === 'sad') {
      // 눈물이 아래로 떨어지는 애니메이션
      tearAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(tearLeftAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
            easing: Easing.linear,
          }),
          Animated.timing(tearLeftAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
      );
      tearRightAnimation = Animated.loop(
        Animated.sequence([
          Animated.delay(500), // 오른쪽 눈물은 0.5초 지연
          Animated.timing(tearRightAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
            easing: Easing.linear,
          }),
          Animated.timing(tearRightAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
      );

      // 물결 효과 (좌우로 흔들리는 애니메이션)
      tearWaveLeftAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(tearWaveLeftAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(tearWaveLeftAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      );
      tearWaveRightAnimation = Animated.loop(
        Animated.sequence([
          Animated.delay(250), // 오른쪽 물결은 약간 지연
          Animated.timing(tearWaveRightAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(tearWaveRightAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      );

      tearAnimation.start();
      tearRightAnimation.start();
      tearWaveLeftAnimation.start();
      tearWaveRightAnimation.start();
    }

    scaleAnimation.start();
    translateYAnimation.start();
    leftArmAnimation.start();
    rightArmAnimation.start();

    return () => {
      scaleAnimation.stop();
      translateYAnimation.stop();
      leftArmAnimation.stop();
      rightArmAnimation.stop();
      blinkAnim.stopAnimation();
      if (tearAnimation) {
        tearAnimation.stop();
      }
      if (tearRightAnimation) {
        tearRightAnimation.stop();
      }
      if (tearWaveLeftAnimation) {
        tearWaveLeftAnimation.stop();
      }
      if (tearWaveRightAnimation) {
        tearWaveRightAnimation.stop();
      }
    };
  }, [
    animated,
    scaleAnim,
    translateYAnim,
    leftArmRotateAnim,
    rightArmRotateAnim,
    blinkAnim,
    emotion,
    tearLeftAnim,
    tearRightAnim,
    tearWaveLeftAnim,
    tearWaveRightAnim,
  ]);

  const translateY = translateYAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 6],
  });

  const [leftArmAngle, setLeftArmAngle] = useState(0);
  const [rightArmAngle, setRightArmAngle] = useState(0);
  const [blinkHeight, setBlinkHeight] = useState(1);
  const [tearLeftY, setTearLeftY] = useState(0);
  const [tearRightY, setTearRightY] = useState(0);
  const [tearLeftWave, setTearLeftWave] = useState(0);
  const [tearRightWave, setTearRightWave] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const leftListener = leftArmRotateAnim.addListener(({ value }: { value: number }) => {
      const angle = -5 + value * 10; // -5deg to 5deg
      setLeftArmAngle(angle);
    });

    const rightListener = rightArmRotateAnim.addListener(({ value }: { value: number }) => {
      const angle = 5 - value * 10; // 5deg to -5deg (왼쪽과 대칭)
      setRightArmAngle(angle);
    });

    const blinkListener = blinkAnim.addListener(({ value }: { value: number }) => {
      setBlinkHeight(value); // 1 = 열림, 0 = 닫힘
    });

    const tearLeftListener = tearLeftAnim.addListener(({ value }: { value: number }) => {
      setTearLeftY(value); // 0 = 시작, 1 = 끝
    });

    const tearRightListener = tearRightAnim.addListener(({ value }: { value: number }) => {
      setTearRightY(value); // 0 = 시작, 1 = 끝
    });

    const tearWaveLeftListener = tearWaveLeftAnim.addListener(({ value }: { value: number }) => {
      setTearLeftWave(value); // 0~1 사이의 값으로 좌우 움직임
    });

    const tearWaveRightListener = tearWaveRightAnim.addListener(({ value }: { value: number }) => {
      setTearRightWave(value); // 0~1 사이의 값으로 좌우 움직임
    });

    return () => {
      leftArmRotateAnim.removeListener(leftListener);
      rightArmRotateAnim.removeListener(rightListener);
      blinkAnim.removeListener(blinkListener);
      tearLeftAnim.removeListener(tearLeftListener);
      tearRightAnim.removeListener(tearRightListener);
      tearWaveLeftAnim.removeListener(tearWaveLeftListener);
      tearWaveRightAnim.removeListener(tearWaveRightListener);
    };
  }, [
    animated,
    leftArmRotateAnim,
    rightArmRotateAnim,
    blinkAnim,
    tearLeftAnim,
    tearRightAnim,
    tearWaveLeftAnim,
    tearWaveRightAnim,
  ]);

  // 팔 좌표 계산 함수
  const getLeftArmPath = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const baseX = 31;
    const baseY = 135; // 위로 10px 올림

    // 기본 좌표
    const points = [
      { x: 15, y: 160 },
      { x: 8, y: 175 },
      { x: 10, y: 190 },
      { x: 20, y: 190 },
      { x: 25, y: 185 },
      { x: 28, y: 175 },
      { x: 31, y: 165 },
    ];

    // 회전 변환 적용
    const rotatedPoints = points.map((p) => {
      const dx = p.x - baseX;
      const dy = p.y - baseY;
      return {
        x: baseX + dx * Math.cos(rad) - dy * Math.sin(rad),
        y: baseY + dx * Math.sin(rad) + dy * Math.cos(rad),
      };
    });

    return {
      outline: `M ${baseX} ${baseY} L ${rotatedPoints[0].x} ${rotatedPoints[0].y} L ${rotatedPoints[1].x} ${rotatedPoints[1].y} L ${rotatedPoints[2].x} ${rotatedPoints[2].y} L ${rotatedPoints[3].x} ${rotatedPoints[3].y} L ${rotatedPoints[4].x} ${rotatedPoints[4].y} L ${rotatedPoints[5].x} ${rotatedPoints[5].y} L ${rotatedPoints[6].x} ${rotatedPoints[6].y} Z`,
      fill: `M ${baseX} ${baseY} L ${rotatedPoints[0].x + 3} ${rotatedPoints[0].y - 2} L ${rotatedPoints[1].x + 2} ${rotatedPoints[1].y - 3} L ${rotatedPoints[2].x + 2} ${rotatedPoints[2].y - 2} L ${rotatedPoints[3].x - 2} ${rotatedPoints[3].y - 2} L ${rotatedPoints[4].x - 2} ${rotatedPoints[4].y - 1} L ${rotatedPoints[5].x - 1} ${rotatedPoints[5].y + 2} L ${rotatedPoints[6].x} ${rotatedPoints[6].y + 2} Z`,
      fistX: rotatedPoints[2].x,
      fistY: rotatedPoints[2].y,
    };
  };

  const getRightArmPath = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const baseX = 176;
    const baseY = 135; // 위로 10px 올림

    // 기본 좌표
    const points = [
      { x: 192, y: 160 },
      { x: 199, y: 175 },
      { x: 197, y: 190 },
      { x: 187, y: 190 },
      { x: 182, y: 185 },
      { x: 179, y: 175 },
      { x: 176, y: 165 },
    ];

    // 회전 변환 적용
    const rotatedPoints = points.map((p) => {
      const dx = p.x - baseX;
      const dy = p.y - baseY;
      return {
        x: baseX + dx * Math.cos(rad) - dy * Math.sin(rad),
        y: baseY + dx * Math.sin(rad) + dy * Math.cos(rad),
      };
    });

    return {
      outline: `M ${baseX} ${baseY} L ${rotatedPoints[0].x} ${rotatedPoints[0].y} L ${rotatedPoints[1].x} ${rotatedPoints[1].y} L ${rotatedPoints[2].x} ${rotatedPoints[2].y} L ${rotatedPoints[3].x} ${rotatedPoints[3].y} L ${rotatedPoints[4].x} ${rotatedPoints[4].y} L ${rotatedPoints[5].x} ${rotatedPoints[5].y} L ${rotatedPoints[6].x} ${rotatedPoints[6].y} Z`,
      fill: `M ${baseX} ${baseY} L ${rotatedPoints[0].x - 3} ${rotatedPoints[0].y - 2} L ${rotatedPoints[1].x - 2} ${rotatedPoints[1].y - 3} L ${rotatedPoints[2].x - 2} ${rotatedPoints[2].y - 2} L ${rotatedPoints[3].x + 2} ${rotatedPoints[3].y - 2} L ${rotatedPoints[4].x + 2} ${rotatedPoints[4].y - 1} L ${rotatedPoints[5].x + 1} ${rotatedPoints[5].y + 2} L ${rotatedPoints[6].x} ${rotatedPoints[6].y + 2} Z`,
      fistX: rotatedPoints[2].x,
      fistY: rotatedPoints[2].y,
    };
  };

  const leftArm = getLeftArmPath(leftArmAngle);
  const rightArm = getRightArmPath(rightArmAngle);

  // --- 눈 렌더링 (레벨에 따른 표정 변화 + 깜빡임 애니메이션) ---
  const renderEyes = () => {
    const eyeY = 70;

    if (level === 'high') {
      // 깜빡임 애니메이션: blinkHeight가 1이면 열림, 0이면 닫힘
      const isBlinking = blinkHeight < 0.5;

      if (isBlinking) {
        // 깜빡일 때는 눈을 닫음 (수평선)
        return (
          <G stroke={palette.eyeColor} strokeWidth={7} strokeLinecap="round">
            <Path d={`M 70 ${eyeY} L 90 ${eyeY}`} />
            <Path d={`M 110 ${eyeY} L 130 ${eyeY}`} />
          </G>
        );
      }

      // 열렸을 때는 X자 형태 (화난 눈)
      return (
        <G stroke={palette.eyeColor} strokeWidth={7} strokeLinecap="round">
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

    // 깜빡임 애니메이션: blinkHeight가 1이면 열림, 0이면 닫힘
    const isBlinking = blinkHeight < 0.5;

    // 우울한 표정: ㅠ ㅠ 형태의 눈물이 나는 표정
    if (emotion === 'sad') {
      const sadEyeY = eyeY - 7; // 눈을 약간 아래로 내림
      // 눈물 애니메이션 위치 계산 (0~1 값을 실제 픽셀 위치로 변환)
      const tearStartY = sadEyeY + 4;
      const tearEndY = sadEyeY + 30;
      const tearLeftStartY = tearStartY + tearLeftY * (tearEndY - tearStartY);
      const tearRightStartY = tearStartY + tearRightY * (tearEndY - tearStartY);

      // 물결 효과: 좌우로 흔들리는 오프셋 계산 (-2~2 픽셀)
      const waveOffsetLeft = (tearLeftWave - 0.5) * 4; // -2 ~ 2
      const waveOffsetRight = (tearRightWave - 0.5) * 4; // -2 ~ 2

      return (
        <G>
          {/* 왼쪽 눈 - ㅠ 형태 (양 끝이 아래로 휘어진 일직선) */}
          {!isBlinking && (
            <>
              {/* 일직선 눈 (왼쪽 끝은 왼쪽 아래로, 오른쪽 끝은 오른쪽 아래로 휘어짐) */}
              <Path
                d={`M 50 ${sadEyeY + 2} Q 70 ${sadEyeY + 6} 90 ${sadEyeY + 2}`}
                stroke={palette.eyeColor}
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              {/* 눈물 세로선 두 개 | | (고정) */}
              <Path
                d={`M 70 ${sadEyeY + 4} L 70 ${sadEyeY + 18}`}
                stroke={palette.eyeColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <Path
                d={`M 80 ${sadEyeY + 4} L 80 ${sadEyeY + 18}`}
                stroke={palette.eyeColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* 떨어지는 눈물 애니메이션 (왼쪽) - 물결 효과 */}
              {tearLeftY > 0 && (
                <>
                  <Path
                    d={`M ${70 + waveOffsetLeft} ${tearLeftStartY} Q ${70 + waveOffsetLeft * 0.5} ${tearLeftStartY + 4} ${70 + waveOffsetLeft} ${tearLeftStartY + 8}`}
                    stroke={palette.eyeColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity={0.8}
                  />
                  <Path
                    d={`M ${80 + waveOffsetLeft} ${tearLeftStartY} Q ${80 + waveOffsetLeft * 0.5} ${tearLeftStartY + 4} ${80 + waveOffsetLeft} ${tearLeftStartY + 8}`}
                    stroke={palette.eyeColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity={0.8}
                  />
                </>
              )}
            </>
          )}
          {isBlinking && (
            <Path
              d={`M 50 ${sadEyeY + 2} Q 70 ${sadEyeY + 6} 90 ${sadEyeY + 2}`}
              stroke={palette.eyeColor}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* 오른쪽 눈 - ㅠ 형태 (양 끝이 아래로 휘어진 일직선) */}
          {!isBlinking && (
            <>
              {/* 일직선 눈 (왼쪽 끝은 왼쪽 아래로, 오른쪽 끝은 오른쪽 아래로 휘어짐) */}
              <Path
                d={`M 110 ${sadEyeY + 2} Q 130 ${sadEyeY + 6} 150 ${sadEyeY + 2}`}
                stroke={palette.eyeColor}
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              {/* 눈물 세로선 두 개 | | (고정) */}
              <Path
                d={`M 120 ${sadEyeY + 4} L 120 ${sadEyeY + 18}`}
                stroke={palette.eyeColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <Path
                d={`M 130 ${sadEyeY + 4} L 130 ${sadEyeY + 18}`}
                stroke={palette.eyeColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* 떨어지는 눈물 애니메이션 (오른쪽) - 물결 효과 */}
              {tearRightY > 0 && (
                <>
                  <Path
                    d={`M ${120 + waveOffsetRight} ${tearRightStartY} Q ${120 + waveOffsetRight * 0.5} ${tearRightStartY + 4} ${120 + waveOffsetRight} ${tearRightStartY + 8}`}
                    stroke={palette.eyeColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity={0.8}
                  />
                  <Path
                    d={`M ${130 + waveOffsetRight} ${tearRightStartY} Q ${130 + waveOffsetRight * 0.5} ${tearRightStartY + 4} ${130 + waveOffsetRight} ${tearRightStartY + 8}`}
                    stroke={palette.eyeColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    opacity={0.8}
                  />
                </>
              )}
            </>
          )}
          {isBlinking && (
            <Path
              d={`M 110 ${sadEyeY + 2} Q 130 ${sadEyeY + 6} 150 ${sadEyeY + 2}`}
              stroke={palette.eyeColor}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </G>
      );
    }

    return (
      <G>
        {/* 왼쪽 눈 */}
        {!isBlinking && (
          <>
            <Path d={`M 50 ${eyeY + 10} A 22 22 0 0 1 90 ${eyeY - 6}`} {...arcProps} />
            <Circle cx="80" cy={eyeY + 2} r="7" fill={palette.eyeColor} stroke="none" />
          </>
        )}
        {/* 왼쪽 눈 깜빡임 (닫힘) */}
        {isBlinking && (
          <Path
            d={`M 50 ${eyeY + 2} L 90 ${eyeY + 2}`}
            stroke={palette.eyeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* 오른쪽 눈 */}
        {!isBlinking && (
          <>
            <Path d={`M 150 ${eyeY + 10} A 22 22 0 0 0 110 ${eyeY - 6}`} {...arcProps} />
            <Circle cx="120" cy={eyeY + 2} r="7" fill={palette.eyeColor} stroke="none" />
          </>
        )}
        {/* 오른쪽 눈 깜빡임 (닫힘) */}
        {isBlinking && (
          <Path
            d={`M 110 ${eyeY + 2} L 150 ${eyeY + 2}`}
            stroke={palette.eyeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
      </G>
    );
  };

  return (
    <View style={[styles.container, { width, height }]} testID={testID}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { translateY }],
        }}
      >
        <Svg width={width} height={height} viewBox="-20 -10 240 240" fill="none">
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
            {/* 팔용 부드러운 그라데이션 */}
            <LinearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={palette.gradientHighlight} stopOpacity="0.9" />
              <Stop offset="50%" stopColor={palette.bodyBase} stopOpacity="1" />
              <Stop offset="100%" stopColor={palette.darkOutline} stopOpacity="0.8" />
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

          {/* 왼쪽 팔 (< 모양) - 애니메이션 적용 */}
          <G>
            <Path d={leftArm.outline} fill={palette.darkOutline} opacity="0.85" />
            <Path d={leftArm.fill} fill="url(#bodyGrad)" />
            {/* 왼쪽 주먹 */}
            <Circle
              cx={leftArm.fistX}
              cy={leftArm.fistY}
              r="8"
              fill={palette.darkOutline}
              opacity="0.8"
            />
            <Circle cx={leftArm.fistX} cy={leftArm.fistY} r="6" fill={palette.bodyBase} />
            <Circle
              cx={leftArm.fistX}
              cy={leftArm.fistY}
              r="4"
              fill={palette.gradientHighlight}
              opacity="0.5"
            />
          </G>

          {/* 오른쪽 팔 (> 모양) - 애니메이션 적용 */}
          <G>
            <Path d={rightArm.outline} fill={palette.darkOutline} opacity="0.85" />
            <Path d={rightArm.fill} fill="url(#bodyGrad)" />
            {/* 오른쪽 주먹 */}
            <Circle
              cx={rightArm.fistX}
              cy={rightArm.fistY}
              r="8"
              fill={palette.darkOutline}
              opacity="0.8"
            />
            <Circle cx={rightArm.fistX} cy={rightArm.fistY} r="6" fill={palette.bodyBase} />
            <Circle
              cx={rightArm.fistX}
              cy={rightArm.fistY}
              r="4"
              fill={palette.gradientHighlight}
              opacity="0.5"
            />
          </G>

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
