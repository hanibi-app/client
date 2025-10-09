import React from 'react';

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
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
  const { tokens } = useTheme();

  const handleSettingPress = (screen: keyof typeof settingsSections[0]['items'][0]) => {
    navigation.navigate(screen);
  };

  const dynamicStyles = StyleSheet.create({
    chevron: {
      color: tokens.text.muted,
      fontSize: 16,
      fontWeight: 'bold',
    },
    container: {
      backgroundColor: tokens.surface.background,
      flex: 1,
    },
    sectionTitle: {
      color: tokens.text.primary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    settingItem: {
      backgroundColor: tokens.surface.card,
      borderRadius: 12,
      elevation: 1,
      marginBottom: 8,
      shadowColor: tokens.surface.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    settingSubtitle: {
      color: tokens.text.muted,
      fontSize: 14,
      lineHeight: 20,
    },
    settingTitle: {
      color: tokens.text.primary,
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    },
    subtitle: {
      color: tokens.text.muted,
      fontSize: 16,
      lineHeight: 24,
    },
    title: {
      color: tokens.text.primary,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={dynamicStyles.title}>설정</Text>
          <Text style={dynamicStyles.subtitle}>
            앱을 원하는 대로 맞춤 설정하세요.
          </Text>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={dynamicStyles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  style={dynamicStyles.settingItem}
                  onPress={() => handleSettingPress(item.screen)}
                >
                  <View style={styles.settingContent}>
                    <Text style={styles.settingIcon}>{item.icon}</Text>
                    <View style={styles.settingInfo}>
                      <Text style={dynamicStyles.settingTitle}>{item.title}</Text>
                      <Text style={dynamicStyles.settingSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Text style={dynamicStyles.chevron}>›</Text>
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
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerSubtext: {
    color: 'transparent', // 테마 토큰으로 대체
    fontSize: 12,
  },
  footerText: {
    color: 'transparent', // 테마 토큰으로 대체
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
    backgroundColor: 'transparent', // 테마 토큰으로 대체
    borderRadius: 12,
    elevation: 1,
    marginHorizontal: 20,
    shadowColor: 'transparent', // 테마 토큰으로 대체
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    borderBottomColor: 'transparent', // 테마 토큰으로 대체
    borderBottomWidth: 1,
  },
});
