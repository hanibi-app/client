import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import CharacterCircle from '@/components/common/CharacterCircle';
import { HomeStackParamList } from '@/navigation/types';
import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { hungryLevel, humidityLevel, smellIndex, setHungryLevel, setHumidityLevel } =
    useAppState();
  const [showDebug, setShowDebug] = useState(false);

  const CIRCLE_SIZE = Math.floor(SCREEN_WIDTH * 0.5);

  const getBackgroundColor = () => {
    if (hungryLevel === 'high' && humidityLevel === 'high') return '#FFE5E5';
    if (hungryLevel === 'low' && humidityLevel === 'low') return '#E5F5FF';
    return '#F0FFF0';
  };

  const handleLongPress = () => {
    setShowDebug(!showDebug);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {showDebug && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>디버그 모드</Text>
          <Pressable
            onPress={() => setHungryLevel(hungryLevel === 'low' ? 'high' : 'low')}
            style={styles.debugButton}
          >
            <Text>배고픔: {hungryLevel === 'low' ? '배부름 🟢' : '배고픔 🔴'}</Text>
          </Pressable>
          <Pressable
            onPress={() => setHumidityLevel(humidityLevel === 'low' ? 'high' : 'low')}
            style={styles.debugButton}
          >
            <Text>습도: {humidityLevel === 'low' ? '낮음 🟢' : '높음 🔴'}</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.content}>
        <Pressable onLongPress={handleLongPress} style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.badgeText}>
                {hungryLevel === 'low' ? '배부르고' : '배고프고'} /{' '}
                {humidityLevel === 'low' ? '건조' : '습함'}
              </Text>
            </View>
            <View style={styles.smellBadge}>
              <Text style={styles.smellText}>냄새지수 {smellIndex}</Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.characterContainer}>
          <CharacterCircle
            size={CIRCLE_SIZE}
            backgroundColor={colors.primary}
            level="medium"
            animated={true}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => navigation.navigate('CharacterCustomize')}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}>캐릭터 꾸며주기</Text>
          </Pressable>
          <Pressable onPress={() => console.log('카메라 열기')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>카메라 열기</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badgeText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  buttonText: {
    color: colors.primaryForeground,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  characterContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  debugButton: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  debugPanel: {
    backgroundColor: colors.softCream,
    borderBottomWidth: 2,
    borderColor: colors.brightYellow,
    padding: spacing.md,
  },
  debugTitle: {
    fontWeight: typography.weights.bold,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    width: '100%',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.md,
    width: '100%',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  smellBadge: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  smellText: {
    color: colors.text,
    fontSize: typography.sizes.xs,
  },
  statusBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '90%',
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
