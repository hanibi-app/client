import React from 'react';

import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';

import { AuthStackScreenProps } from '@/types/navigation';

type OnboardingAlertRequestScreenProps = AuthStackScreenProps<'OnboardingAlertRequest'>;

export default function OnboardingAlertRequestScreen({ navigation }: OnboardingAlertRequestScreenProps) {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>알림 권한이 필요해요</Text>
          <Text style={styles.description}>
            음식물 쓰레기 상태 변화를 실시간으로 알려드릴게요
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🌡️</Text>
            <Text style={styles.featureText}>온도/습도 이상 감지</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚠️</Text>
            <Text style={styles.featureText}>금속/VOC 수치 알림</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureText}>캐릭터 상태 업데이트</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.allowButton} onPress={handleAllowNotifications}>
            <Text style={styles.allowButtonText}>알림 허용</Text>
          </Pressable>
          
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>나중에 설정</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  allowButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 16,
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  description: {
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
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
  featureText: {
    color: '#333',
    flex: 1,
    fontSize: 16,
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
  skipButtonText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
