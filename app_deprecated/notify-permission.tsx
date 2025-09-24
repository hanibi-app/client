import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Shadows } from '../constants/DesignSystem';

export default function NotifyPermissionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>알림 요청</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>알림 요청</Text>
        <Text style={styles.subtitle}>알림을 받으면 까먹지 않고 알 수 있어요</Text>
        <Text style={styles.subtitle2}>음식물 처리가 잘 되고 있는 지 알려줄게요</Text>

        <View style={styles.heroRow}>
          <View style={styles.largeCircle}>
            <View style={styles.characterContainer}>
              <Image 
                source={require('../assets/images/icon.png')} 
                style={styles.characterImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.circleText}>알려주는 느낌</Text>
          </View>
        </View>

        <View style={styles.notificationContainer}>
          <View style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <View style={styles.logoContainer}>
                <View style={styles.logo} />
              </View>
              <Text style={styles.appName}>한니비</Text>
              <Text style={styles.timeText}>2분전</Text>
            </View>
            <Text style={styles.notificationText}>[배양블록 필요] 소화가 안돼요 도와주세요 😅</Text>
          </View>

          <View style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <View style={styles.logoContainer}>
                <View style={styles.logo} />
              </View>
              <Text style={styles.appName}>한니비</Text>
              <Text style={styles.timeText}>17분전</Text>
            </View>
            <Text style={styles.notificationText}>[음식물 처리 완료] 오늘도 너무 맛있었어요! 좋은 하루 되세요:)</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => router.replace('/caution/step1')} style={styles.primaryButton}>
          <Text style={styles.primaryText}>알람을 켤래</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/(tabs)/home')} style={styles.ghostButton}>
          <Text style={styles.ghostText}>지금은 괜찮아</Text>
        </Pressable>
        
        <View style={styles.demoButtons}>
          <Pressable onPress={() => router.push('/character-customize')} style={styles.demoButton}>
            <Text style={styles.demoButtonText}>캐릭터 꾸미기 데모</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/dashboard')} style={styles.demoButton}>
            <Text style={styles.demoButtonText}>대시보드 데모</Text>
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  headerTitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: Spacing.xs,
  },
  subtitle2: {
    fontSize: 16,
    color: '#333333',
    marginBottom: Spacing.xl,
  },
  heroRow: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
  },
  largeCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4CAF50',
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
  circleText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  notificationContainer: {
    gap: Spacing.md,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  logoContainer: {
    marginRight: Spacing.sm,
  },
  logo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
  },
  appName: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#999999',
  },
  notificationText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.sm,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ghostButton: {
    height: 48,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    fontSize: 16,
    color: '#666666',
  },
  demoButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  demoButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
});


