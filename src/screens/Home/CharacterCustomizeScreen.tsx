import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import CharacterCircle from '@/components/common/CharacterCircle';
import { HomeStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const COLOR_CHIPS = [
  { id: 'green', color: '#6BE092', name: '초록' },
  { id: 'orange', color: '#FFA500', name: '주황' },
  { id: 'red', color: '#FF6B6B', name: '레드' },
  { id: 'sky', color: '#87CEEB', name: '스카이' },
  { id: 'pink', color: '#FFB6C1', name: '핑크' },
];

type CharacterCustomizeScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'CharacterCustomize'
>;

export default function CharacterCustomizeScreen({ navigation }: CharacterCustomizeScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [selectedColor, setSelectedColor] = useState(COLOR_CHIPS[0].color);
  const CIRCLE_SIZE = Math.floor(SCREEN_WIDTH * 0.6);

  const handleComplete = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>꾸며주기</Text>
        <Pressable onPress={handleComplete} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>완성</Text>
        </Pressable>
      </View>

      {/* 큰 캐릭터 원 */}
      <View style={styles.characterContainer}>
        <CharacterCircle
          size={CIRCLE_SIZE}
          backgroundColor={selectedColor}
          level="medium"
          animated={true}
        />
      </View>

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
          >
            {selectedColor === chip.color && <Text style={styles.checkMark}>✓</Text>}
          </Pressable>
        ))}
      </View>

      <Text style={styles.hintText}>원하는 색상을 선택해 주세요</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  characterContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  checkMark: {
    color: colors.white,
    fontSize: 20,
    fontWeight: typography.weights.bold,
  },
  colorChip: {
    alignItems: 'center',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
    width: 60,
  },
  colorChipSelected: {
    borderColor: colors.text,
    borderWidth: 3,
  },
  colorChipsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  completeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  completeButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingTop: spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  hintText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
