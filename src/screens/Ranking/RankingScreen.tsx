/**
 * 랭킹 화면
 * 기간별 랭킹 정보를 표시하는 화면입니다.
 */

import React, { useEffect, useRef } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RankingList } from '@/features/reports/components/RankingList';
import { HomeStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type RankingScreenProps = NativeStackScreenProps<HomeStackParamList, 'Ranking'>;

export default function RankingScreen({ navigation }: RankingScreenProps) {
  const insets = useSafeAreaInsets();

  // 애니메이션 값들
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // 화면 진입 애니메이션
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.sm },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>랭킹</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      {/* 랭킹 리스트 */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <RankingList initialPeriod="DAILY" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backButtonIcon: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerRight: {
    width: 44,
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
