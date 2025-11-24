import React from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import { HomeStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // 진행률 계산 (30% 남음 = 70% 진행)
  const progress = 70;

  // 캐릭터 크기
  const CHARACTER_SIZE = Math.floor(SCREEN_WIDTH * 0.4);

  return (
    <LinearGradient
      colors={['#E5F5E5', '#FFE5E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 상단 상태 메시지 버블 */}
        <View style={styles.messageBubble}>
          <View style={styles.messageIcon}>
            <MaterialIcons name="local-fire-department" size={24} color="#FF6B35" />
          </View>
          <View style={styles.messageContent}>
            <Text style={styles.messageText1}>너무 더워서 힘들어요 😥</Text>
            <Text style={styles.messageText2}>온도 한 번만 확인해 주세요!</Text>
          </View>
        </View>

        {/* 중앙 캐릭터 */}
        <View style={styles.characterContainer}>
          <HanibiCharacter2D level="medium" animated={true} size={CHARACTER_SIZE} />
        </View>

        {/* 캐릭터 아래 버튼 및 진행바 */}
        <View style={styles.bottomSection}>
          {/* 버튼들 */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.hanibiButton}>
              <Text style={styles.hanibiButtonText}>한니비</Text>
              <MaterialIcons name="edit" size={16} color={colors.text} />
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('CharacterCustomize')}
              style={styles.customizeButton}
            >
              <View style={styles.customizeIconContainer}>
                <MaterialIcons name="palette" size={24} color={colors.primary} />
              </View>
              <Text style={styles.customizeButtonText}>꾸며주기</Text>
            </Pressable>
          </View>

          {/* 진행바 */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <LinearGradient
                colors={['#6BE092', '#FFD700']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>다 먹기까지 30% 남음</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bottomSection: {
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  characterContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  container: {
    flex: 1,
  },
  customizeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customizeButtonText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  customizeIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  hanibiButton: {
    alignItems: 'center',
    backgroundColor: colors.gray75,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  hanibiButtonText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  messageBubble: {
    backgroundColor: colors.gray75,
    borderRadius: 16,
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  messageContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  messageIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText1: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  messageText2: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  progressBarBackground: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    borderRadius: 8,
    height: '100%',
  },
  progressContainer: {
    marginBottom: spacing.xl,
    width: '100%',
  },
  progressText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
  },
});
