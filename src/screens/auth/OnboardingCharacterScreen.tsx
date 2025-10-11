import React, { useState } from 'react';

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/theme';
import { AuthStackScreenProps } from '@/types/navigation';

type OnboardingCharacterScreenProps = AuthStackScreenProps<'OnboardingCharacter'>;

const characterColors = [
  { id: 'blue', name: '파랑', color: '#007AFF', emoji: '🤖' },
  { id: 'green', name: '초록', color: '#34C759', emoji: '🤖' },
  { id: 'orange', name: '주황', color: '#FF9500', emoji: '🤖' },
  { id: 'purple', name: '보라', color: '#AF52DE', emoji: '🤖' },
  { id: 'pink', name: '분홍', color: '#FF2D92', emoji: '🤖' },
  { id: 'yellow', name: '노랑', color: '#FFCC00', emoji: '🤖' },
];

export default function OnboardingCharacterScreen({
  navigation: _navigation,
}: OnboardingCharacterScreenProps) {
  const [selectedColor, setSelectedColor] = useState('blue');
  const { setOnboarded } = useAuthStore();
  const { tokens } = useTheme();

  const handleComplete = () => {
    // TODO: 선택된 캐릭터 색상 저장
    console.log('선택된 캐릭터 색상:', selectedColor);

    // 온보딩 완료 처리
    setOnboarded(true);

    // 메인 화면으로 이동 (RootNavigator에서 자동으로 MainTabs로 이동)
  };

  const selectedColorData = characterColors.find(color => color.id === selectedColor);

  const dynamicStyles = StyleSheet.create({
    characterName: {
      color: tokens.text.primary,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 16,
      textAlign: 'center',
    },
    colorOption: {
      backgroundColor: tokens.surface.card,
      borderRadius: 12,
      elevation: 1,
      marginBottom: 12,
      shadowColor: tokens.surface.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    colorOptionSelected: {
      backgroundColor: tokens.brand.primary,
      borderRadius: 12,
      elevation: 2,
      marginBottom: 12,
      shadowColor: tokens.surface.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    completeButton: {
      backgroundColor: tokens.brand.primary,
      borderRadius: 12,
      marginTop: 20,
      paddingVertical: 16,
    },
    completeButton: {
      backgroundColor: tokens.brand.primary,
      borderRadius: 12,
      marginTop: 20,
      paddingVertical: 16,
    },
    completeButtonText: {
      color: tokens.text.inverse,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    completeButtonText: {
      color: tokens.text.inverse,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    container: {
      backgroundColor: tokens.surface.background,
      flex: 1,
    },
    description: {
      color: tokens.text.muted,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
    },
    title: {
      color: tokens.text.primary,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={dynamicStyles.title}>캐릭터를 꾸며보세요</Text>
          <Text style={dynamicStyles.description}>
            한니비의 색상을 선택해주세요. 언제든지 변경할 수 있어요.
          </Text>
        </View>

        <View style={styles.characterPreview}>
          <View style={[styles.characterContainer, { backgroundColor: selectedColorData?.color }]}>
            <Text style={styles.characterEmoji}>{selectedColorData?.emoji}</Text>
          </View>
          <Text style={dynamicStyles.characterName}>한니비</Text>
        </View>

        <ScrollView style={styles.colorSelector} showsVerticalScrollIndicator={false}>
          <Text style={styles.selectorTitle}>색상 선택</Text>
          <View style={styles.colorGrid}>
            {characterColors.map(color => (
              <Pressable
                key={color.id}
                style={[
                  selectedColor === color.id
                    ? dynamicStyles.colorOptionSelected
                    : dynamicStyles.colorOption,
                  { backgroundColor: color.color },
                ]}
                onPress={() => setSelectedColor(color.id)}
              >
                <Text style={styles.colorEmoji}>{color.emoji}</Text>
                {selectedColor === color.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable style={dynamicStyles.completeButton} onPress={handleComplete}>
            <Text style={dynamicStyles.completeButtonText}>완료</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingBottom: 20,
  },
  characterContainer: {
    alignItems: 'center',
    borderRadius: 60,
    elevation: 4,
    height: 120,
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: tokens.surface.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: 120,
  },
  characterEmoji: {
    fontSize: 60,
  },
  characterPreview: {
    alignItems: 'center',
    marginBottom: 40,
  },
  checkmark: {
    alignItems: 'center',
    backgroundColor: tokens.brand.primary,
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    top: 4,
    width: 20,
  },
  checkmarkText: {
    color: tokens.text.inverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  colorEmoji: {
    fontSize: 32,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorSelector: {
    flex: 1,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  selectorTitle: {
    color: tokens.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
