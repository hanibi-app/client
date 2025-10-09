import React, { useState } from 'react';

import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';

import { useAuthStore } from '@/store/useAuthStore';
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

export default function OnboardingCharacterScreen({ navigation }: OnboardingCharacterScreenProps) {
  const [selectedColor, setSelectedColor] = useState('blue');
  const { setOnboarded } = useAuthStore();

  const handleComplete = () => {
    // TODO: 선택된 캐릭터 색상 저장
    console.log('선택된 캐릭터 색상:', selectedColor);
    
    // 온보딩 완료 처리
    setOnboarded(true);
    
    // 메인 화면으로 이동 (RootNavigator에서 자동으로 MainTabs로 이동)
  };

  const selectedColorData = characterColors.find(color => color.id === selectedColor);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>캐릭터를 꾸며보세요</Text>
          <Text style={styles.description}>
            한니비의 색상을 선택해주세요. 언제든지 변경할 수 있어요.
          </Text>
        </View>
        
        <View style={styles.characterPreview}>
          <View style={[styles.characterContainer, { backgroundColor: selectedColorData?.color }]}>
            <Text style={styles.characterEmoji}>{selectedColorData?.emoji}</Text>
          </View>
          <Text style={styles.characterName}>한니비</Text>
        </View>
        
        <ScrollView style={styles.colorSelector} showsVerticalScrollIndicator={false}>
          <Text style={styles.selectorTitle}>색상 선택</Text>
          <View style={styles.colorGrid}>
            {characterColors.map((color) => (
              <Pressable
                key={color.id}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.color },
                  selectedColor === color.id && styles.selectedColorOption,
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
          <Pressable style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>완료</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: 120,
  },
  characterEmoji: {
    fontSize: 60,
  },
  characterName: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  characterPreview: {
    alignItems: 'center',
    marginBottom: 40,
  },
  checkmark: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    top: 4,
    width: 20,
  },
  checkmarkText: {
    color: '#fff',
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
  colorOption: {
    alignItems: 'center',
    aspectRatio: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    marginBottom: 16,
    width: '30%',
  },
  colorSelector: {
    flex: 1,
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  selectedColorOption: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  selectorTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});
