import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Shadows } from '../constants/DesignSystem';

export default function CharacterCustomizeScreen() {
  const [selectedColor, setSelectedColor] = useState('#4CAF50');

  const colorOptions = [
    '#4CAF50', // 초록색
    '#FF9800', // 주황색
    '#2196F3', // 파란색
    '#E91E63', // 분홍색
    '#9C27B0', // 보라색
    '#FF5722', // 빨간색
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>캐릭터 꾸미기</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.characterSection}>
          <View style={[styles.characterCircle, { backgroundColor: selectedColor }]}>
            <View style={styles.characterContainer}>
              <Image 
                source={require('../assets/images/icon.png')} 
                style={styles.characterImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.characterText}>상호작용 캐릭터</Text>
          </View>
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.sectionTitle}>색상 선택</Text>
          <View style={styles.colorGrid}>
            {colorOptions.map((color, index) => (
              <Pressable
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.actionSection}>
          <Pressable 
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)/home')}
          >
            <Text style={styles.primaryText}>완료</Text>
          </Pressable>
          <Pressable 
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryText}>취소</Text>
          </Pressable>
          
          <Pressable 
            style={styles.demoButton}
            onPress={() => router.push('/dashboard')}
          >
            <Text style={styles.demoButtonText}>대시보드 보기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  backText: {
    fontSize: 24,
    color: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  characterSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
  },
  characterCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  characterContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  characterImage: {
    width: 80,
    height: 80,
  },
  characterText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  colorSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: Spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333333',
    borderWidth: 3,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: 'bold',
  },
  actionSection: {
    gap: Spacing.md,
    marginTop: 'auto',
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 48,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 16,
    color: '#666666',
  },
  demoButton: {
    height: 44,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  demoButtonText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
});
