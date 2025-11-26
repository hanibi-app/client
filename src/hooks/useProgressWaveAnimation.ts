import { useEffect, useRef } from 'react';

import { Animated } from 'react-native';

export const useProgressWaveAnimation = (progress: number) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false, // width 애니메이션은 native driver 사용 불가
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [progress, progressAnim]);

  useEffect(() => {
    waveAnim.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 0.5,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
      waveAnim.setValue(0);
    };
  }, [waveAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const waveOffset = waveAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: ['-50%', '0%'],
  });

  return { progressWidth, waveOffset };
};
