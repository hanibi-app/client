import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeStackParamList } from '@/navigation/types';
import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type CharacterNameEditScreenProps = NativeStackScreenProps<HomeStackParamList, 'CharacterNameEdit'>;

export default function CharacterNameEditScreen({ navigation }: CharacterNameEditScreenProps) {
  const insets = useSafeAreaInsets();
  const characterName = useAppState((s) => s.characterName);
  const setCharacterName = useAppState((s) => s.setCharacterName);
  const [inputValue, setInputValue] = useState(characterName);

  const handleSave = () => {
    if (inputValue.trim()) {
      setCharacterName(inputValue.trim());
      navigation.goBack();
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>이름 수정</Text>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>저장</Text>
        </Pressable>
      </View>

      {/* 입력 영역 */}
      <View style={styles.content}>
        <Text style={styles.label}>캐릭터 이름</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="이름을 입력하세요"
          placeholderTextColor={colors.mutedText}
          maxLength={10}
          autoFocus
        />
        <Text style={styles.hint}>최대 10자까지 입력할 수 있습니다</Text>
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
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
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
  headerTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  hint: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.sizes.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  saveButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    minWidth: 60,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
});
