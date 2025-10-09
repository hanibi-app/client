import React from 'react';

import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';

import { SettingsStackScreenProps } from '@/types/navigation';

type SettingsIndexScreenProps = SettingsStackScreenProps<'SettingsIndex'>;

const settingsSections = [
  {
    title: '계정',
    items: [
      { 
        title: '프로필 및 계정', 
        subtitle: '개인정보 및 계정 설정',
        icon: '👤',
        screen: 'SettingsProfile' as const
      },
    ]
  },
  {
    title: '앱 설정',
    items: [
      { 
        title: '캐릭터 제어', 
        subtitle: '한니비 캐릭터 설정',
        icon: '🤖',
        screen: 'SettingsControl' as const
      },
      { 
        title: '대시보드 표시', 
        subtitle: '화면에 표시할 지표 선택',
        icon: '📊',
        screen: 'SettingsDisplay' as const
      },
      { 
        title: '알림 설정', 
        subtitle: '푸시 알림 및 알림음 설정',
        icon: '🔔',
        screen: 'SettingsAlert' as const
      },
    ]
  },
  {
    title: '기타',
    items: [
      { 
        title: '기타', 
        subtitle: '앱 정보, 버전, 문의하기',
        icon: 'ℹ️',
        screen: 'SettingsEtc' as const
      },
    ]
  },
];

export default function SettingsIndexScreen({ navigation }: SettingsIndexScreenProps) {
  const handleSettingPress = (screen: keyof typeof settingsSections[0]['items'][0]) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>설정</Text>
          <Text style={styles.subtitle}>
            앱을 원하는 대로 맞춤 설정하세요.
          </Text>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  style={styles.settingItem}
                  onPress={() => handleSettingPress(item.screen)}
                >
                  <View style={styles.settingContent}>
                    <Text style={styles.settingIcon}>{item.icon}</Text>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>한니비 v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with ❤️ for smart food waste management</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chevron: {
    color: '#C7C7CC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#F2F2F7',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerSubtext: {
    color: '#C7C7CC',
    fontSize: 12,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 4,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  settingContent: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingItem: {
    borderBottomColor: '#F2F2F7',
    borderBottomWidth: 1,
  },
  settingSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  settingTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
