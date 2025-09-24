import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Shadows } from '../../constants/DesignSystem';

export default function SettingsTabScreen() {
  const settingsItems = [
    { title: '알림 설정', icon: '🔔', onPress: () => router.push('/notify-permission') },
    { title: '캐릭터 꾸미기', icon: '🎨', onPress: () => router.push('/character-customize') },
    { title: '대시보드', icon: '📊', onPress: () => router.push('/dashboard') },
    { title: '리포트', icon: '📈', onPress: () => router.push('/report') },
    { title: '계정 설정', icon: '👤', onPress: () => {} },
    { title: '앱 정보', icon: 'ℹ️', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsList}>
          {settingsItems.map((item, index) => (
            <Pressable
              key={index}
              style={styles.settingItem}
              onPress={item.onPress}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <Text style={styles.settingTitle}>{item.title}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appName}>한니비</Text>
          <Text style={styles.appVersion}>버전 1.0.0</Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
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
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333333',
  },
  chevron: {
    fontSize: 20,
    color: '#CCCCCC',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: Spacing.xs,
  },
  appVersion: {
    fontSize: 14,
    color: '#666666',
  },
});
