import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Shadows } from '../../constants/DesignSystem';

export default function HomeTabScreen() {
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
        <Text style={styles.headerTitle}>꾸며주기</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.characterSection}>
          <View style={[styles.characterCircle, { backgroundColor: selectedColor }]}>
            <View style={styles.characterContainer}>
              <Image 
                source={require('../../assets/images/icon.png')} 
                style={styles.characterImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.characterText}>상호작용 캐릭터</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>캐릭터 꾸며주기</Text>
          <Pressable 
            style={styles.completeButton}
            onPress={() => router.push('/dashboard')}
          >
            <Text style={styles.completeText}>완성</Text>
          </Pressable>
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.colorLabel}>색상</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingBottom: 100, // 하단 탭바를 위한 여백
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
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
  placeholder: {
    width: 40,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  completeButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  completeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  colorSection: {
    marginBottom: Spacing.xl,
  },
  colorLabel: {
    fontSize: 14,
    color: '#666666',
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
});
