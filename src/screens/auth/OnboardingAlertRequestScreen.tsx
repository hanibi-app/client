import React from 'react';

import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import { AuthStackScreenProps } from '@/types/navigation';

type OnboardingAlertRequestScreenProps = AuthStackScreenProps<'OnboardingAlertRequest'>;

export default function OnboardingAlertRequestScreen({ navigation }: OnboardingAlertRequestScreenProps) {
  const { tokens } = useTheme();

  const handleAllowNotifications = async () => {
    // TODO: 알림 권한 요청 구현
    console.log('알림 권한 요청');
    
    // 권한 승인 후 경고 화면으로 이동
    navigation.navigate('OnboardingWarningPager', { initialIndex: 0 });
  };

  const handleSkip = () => {
    // 알림 권한 건너뛰기
    navigation.navigate('OnboardingWarningPager', { initialIndex: 0 });
  };

  const dynamicStyles = StyleSheet.create({
    allowButton: {
      backgroundColor: tokens.brand.primary,
      borderRadius: 12,
      marginBottom: 16,
      paddingVertical: 16,
    },
    allowButtonText: {
      color: tokens.text.inverse,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    container: {
      backgroundColor: tokens.surface.background,
      flex: 1,
    },
    description: {
      color: tokens.text.muted,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
    },
    featureText: {
      color: tokens.text.primary,
      flex: 1,
      fontSize: 16,
    },
    skipButtonText: {
      color: tokens.text.muted,
      fontSize: 16,
      textAlign: 'center',
    },
    title: {
      color: tokens.text.primary,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={dynamicStyles.title}>알림 권한이 필요해요</Text>
          <Text style={dynamicStyles.description}>
            음식물 쓰레기 상태 변화를 실시간으로 알려드릴게요
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🌡️</Text>
            <Text style={dynamicStyles.featureText}>온도/습도 이상 감지</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚠️</Text>
            <Text style={dynamicStyles.featureText}>금속/VOC 수치 알림</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={dynamicStyles.featureText}>캐릭터 상태 업데이트</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={dynamicStyles.allowButton} onPress={handleAllowNotifications}>
            <Text style={dynamicStyles.allowButtonText}>알림 허용</Text>
          </Pressable>
          
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={dynamicStyles.skipButtonText}>나중에 설정</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginVertical: 20,
  },
  icon: {
    fontSize: 80,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  skipButton: {
    paddingVertical: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
});
