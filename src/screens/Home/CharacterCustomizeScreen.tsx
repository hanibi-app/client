import React, { useState } from 'react';

import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import { HomeStackParamList, RootStackParamList } from '@/navigation/types';
import { markOnboardingComplete } from '@/services/storage/onboarding';
import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const COLOR_CHIPS = [
  { id: 'green', color: '#40EA87', name: '초록' },
  { id: 'orange', color: '#FF7017', name: '주황' },
  { id: 'red', color: '#ED5B5B', name: '레드' },
  { id: 'sky', color: '#2BD4DB', name: '스카이' },
  { id: 'pink', color: '#F676E5', name: '핑크' },
];

type CharacterCustomizeScreenProps = NativeStackScreenProps<
  HomeStackParamList | RootStackParamList,
  'CharacterCustomize'
>;

export default function CharacterCustomizeScreen({ navigation }: CharacterCustomizeScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const setHasOnboarded = useAppState((s) => s.setHasOnboarded);
  const [selectedColor, setSelectedColor] = useState(COLOR_CHIPS[0].color);
  const CIRCLE_SIZE = Math.floor(SCREEN_WIDTH * 0.6);

  const handleComplete = async () => {
    // 온보딩 완료 처리
    try {
      await markOnboardingComplete();
      setHasOnboarded(true);
    } catch (error) {
      console.error('온보딩 완료 저장 오류:', error);
    }

    // MainTabs로 이동
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      }),
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 상단 힌트 텍스트 */}

      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>꾸며주기</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 큰 캐릭터 원 (2D 캐릭터 들어갈 부분) */}
      <View style={styles.characterWrapper}>
        <View style={styles.characterContainer}>
          <HanibiCharacter2D
            size={CIRCLE_SIZE}
            level="medium"
            animated={true}
            customColor={selectedColor}
          />
        </View>
      </View>

      {/* 하단 패널 */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>캐릭터 꾸며주기</Text>
          <Pressable onPress={handleComplete} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>완성</Text>
          </Pressable>
        </View>

        <Text style={styles.colorLabel}>색상</Text>

        {/* 색상 칩 5개 */}
        <View style={styles.colorChipsContainer}>
          {COLOR_CHIPS.map((chip) => (
            <Pressable
              key={chip.id}
              onPress={() => setSelectedColor(chip.color)}
              style={[
                styles.colorChip,
                { backgroundColor: chip.color },
                selectedColor === chip.color ? styles.colorChipSelected : undefined,
              ]}
            />
          ))}
        </View>
      </View>
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
  characterContainer: {
    alignItems: 'center',
    elevation: 4,
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  characterWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  colorChip: {
    borderRadius: 30,
    height: 60,
    marginHorizontal: spacing.sm,
    width: 60,
  },
  colorChipSelected: {
    borderColor: colors.darkGreen,
    borderWidth: 2,
  },
  colorChipsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  colorLabel: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginTop: spacing.lg,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  container: {
    backgroundColor: colors.background,
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
  panel: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 5,
    marginTop: 0, // 패널과 캐릭터 영역 사이 간격 조정 (음수면 위로, 양수면 아래로)
    paddingBottom: 70,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { height: -2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  panelTitle: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
});
