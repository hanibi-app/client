import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';

// Import design tokens
import { Colors, Spacing, Shadows } from '@/styles/DesignSystem';

type WelcomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>지금부터 음식물 쓰레기 고민 STOP!</Text>
        <Text style={styles.subtitle}>한니비와 함께 음식물 쓰레기 고민 해결해 봐요</Text>

        <View style={styles.circleWrap}>
          <View style={styles.circle}>
            <Text style={styles.circleLabel}>반가워하는 디자인</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => navigation.navigate('NotifyPermission')} style={styles.kakaoButton}>
          <Text style={styles.kakaoText}>카카오로 시작하기</Text>
        </Pressable>
        
        <View style={styles.navigationButtons}>
          <Pressable onPress={() => navigation.navigate('CharacterCustomize')} style={styles.navButton}>
            <Text style={styles.navButtonText}>캐릭터 꾸미기</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Dashboard')} style={styles.navButton}>
            <Text style={styles.navButtonText}>대시보드</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl * 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  circleWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  circleLabel: {
    fontSize: 16,
    color: Colors.light.background,
  },
  footer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  kakaoButton: {
    height: 52,
    borderRadius: Spacing.sm,
    backgroundColor: '#FEE500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181600',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    height: 48,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.background,
  },
});
