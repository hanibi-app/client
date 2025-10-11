import React from 'react';

import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';

import { useAuthStore } from '@/store/useAuthStore';
import { SettingsStackScreenProps } from '@/types/navigation';

type SettingsProfileScreenProps = SettingsStackScreenProps<'SettingsProfile'>;

export default function SettingsProfileScreen({
  navigation: _navigation,
}: SettingsProfileScreenProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // RootNavigator에서 자동으로 Auth로 이동
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>👤</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || '사용자'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>계정 정보</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>이름</Text>
              <Text style={styles.settingValue}>{user?.name || '사용자'}</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>이메일</Text>
              <Text style={styles.settingValue}>{user?.email || 'user@example.com'}</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>가입일</Text>
              <Text style={styles.settingValue}>2024년 1월 1일</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>계정 관리</Text>
          <View style={styles.actionsList}>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionButtonText}>프로필 수정</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionButtonText}>비밀번호 변경</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionButtonText}>계정 삭제</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    borderBottomColor: '#F2F2F7',
    borderBottomWidth: 1,
    padding: 16,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  actionsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionsSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  avatar: {
    fontSize: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginRight: 16,
    width: 60,
  },
  container: {
    backgroundColor: '#F2F2F7',
    flex: 1,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutSection: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    flexDirection: 'row',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileEmail: {
    color: '#666',
    fontSize: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileSection: {
    padding: 20,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingItem: {
    alignItems: 'center',
    borderBottomColor: '#F2F2F7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabel: {
    color: '#333',
    fontSize: 16,
  },
  settingValue: {
    color: '#666',
    fontSize: 16,
  },
  settingsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingsSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
});
