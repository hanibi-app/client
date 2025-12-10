/**
 * Intent Palette 컴포넌트
 * 카테고리별 Intent 버튼을 표시하는 컴포넌트입니다.
 */

import React, { useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_LABEL, getPresetsByCategory, INTENT_PRESETS } from '@/constants/intentPresets';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { ChatIntent, IntentPreset } from '@/types/chat';

export interface IntentPaletteProps {
  onSelectIntent: (intent: ChatIntent, preset: IntentPreset) => void;
}

/**
 * Intent Palette 컴포넌트
 * 카테고리 탭과 Intent 버튼들을 표시합니다.
 */
export default function IntentPalette({ onSelectIntent }: IntentPaletteProps) {
  const [category, setCategory] = useState<IntentPreset['category']>('STATUS');

  // 고유한 카테고리 목록 추출
  const categories = Array.from(
    new Set(INTENT_PRESETS.map((p) => p.category)),
  ) as IntentPreset['category'][];

  // 선택된 카테고리의 Preset 필터링
  const filtered = getPresetsByCategory(category);

  return (
    <View style={styles.container}>
      {/* 카테고리 탭 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => {
          const isSelected = cat === category;
          const label = CATEGORY_LABEL[cat] || cat; // 안전한 fallback
          return (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.categoryTab, isSelected && styles.categoryTabSelected]}
            >
              <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Intent 버튼들 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.intentContainer}
      >
        {filtered.map((preset, index) => {
          // 같은 intent가 여러 개 있을 수 있으므로 index를 key에 포함
          const key = `${preset.intent}-${preset.label}-${index}`;
          return (
            <Pressable
              key={key}
              onPress={() => onSelectIntent(preset.intent, preset)}
              style={styles.intentButton}
            >
              {preset.icon && (
                <MaterialIcons
                  name={preset.icon as React.ComponentProps<typeof MaterialIcons>['name']}
                  size={18}
                  color={colors.primary}
                  style={styles.intentIcon}
                />
              )}
              <View style={styles.intentContent}>
                <Text style={styles.intentLabel}>{preset.label}</Text>
                {preset.description && (
                  <Text style={styles.intentDescription}>{preset.description}</Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryTab: {
    backgroundColor: colors.gray50,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryTabSelected: {
    backgroundColor: colors.text,
  },
  categoryText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  categoryTextSelected: {
    color: colors.white,
  },
  container: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm,
  },
  intentButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  intentContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  intentContent: {
    flex: 1,
  },
  intentDescription: {
    color: colors.mutedText,
    fontSize: 11,
  },
  intentIcon: {
    marginRight: spacing.xs,
  },
  intentLabel: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    marginBottom: 2,
  },
});
