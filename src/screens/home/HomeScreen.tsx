import React from 'react';

import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';

import { useSensorQuery } from '@/hooks/useSensorQuery';
import { HomeStackScreenProps } from '@/types/navigation';

type HomeScreenProps = HomeStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { data: sensorData, isLoading } = useSensorQuery();

  const handleNavigateToAlerts = () => {
    navigation.navigate('Alerts');
  };

  const handleNavigateToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const handleNavigateToCamera = () => {
    navigation.navigate('CameraScreen', { connected: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#34C759';
      case 'warning': return '#FF9500';
      case 'danger': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '정상';
      case 'warning': return '주의';
      case 'danger': return '위험';
      default: return '알 수 없음';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.greeting}>안녕하세요! 👋</Text>
          <Text style={styles.subtitle}>한니비가 현재 상태를 알려드릴게요</Text>
        </View>

        {/* 캐릭터 섹션 */}
        <View style={styles.characterSection}>
          <View style={styles.characterContainer}>
            <Text style={styles.character}>🤖</Text>
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>한니비</Text>
              <Text style={styles.characterStatus}>
                {isLoading ? '데이터 확인 중...' : getStatusText(sensorData?.status || 'normal')}
              </Text>
            </View>
          </View>
        </View>

        {/* 센서 요약 카드 */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>현재 상태</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>🌡️</Text>
              <Text style={styles.summaryLabel}>온도</Text>
              <Text style={styles.summaryValue}>
                {isLoading ? '--' : `${sensorData?.temperature}°C`}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>💧</Text>
              <Text style={styles.summaryLabel}>습도</Text>
              <Text style={styles.summaryValue}>
                {isLoading ? '--' : `${sensorData?.humidity}%`}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>⚡</Text>
              <Text style={styles.summaryLabel}>금속</Text>
              <Text style={styles.summaryValue}>
                {isLoading ? '--' : `${sensorData?.metal} mg/kg`}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>🌬️</Text>
              <Text style={styles.summaryLabel}>VOC</Text>
              <Text style={styles.summaryValue}>
                {isLoading ? '--' : `${sensorData?.voc} ppb`}
              </Text>
            </View>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionSection}>
          <Pressable style={styles.actionButton} onPress={handleNavigateToDashboard}>
            <Text style={styles.actionButtonIcon}>📊</Text>
            <Text style={styles.actionButtonText}>상세 대시보드</Text>
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={handleNavigateToAlerts}>
            <Text style={styles.actionButtonIcon}>🔔</Text>
            <Text style={styles.actionButtonText}>알림 내역</Text>
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={handleNavigateToCamera}>
            <Text style={styles.actionButtonIcon}>📹</Text>
            <Text style={styles.actionButtonText}>카메라 보기</Text>
          </Pressable>
        </View>

        {/* 상태 표시 */}
        <View style={styles.statusSection}>
          <View style={styles.statusCard}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(sensorData?.status || 'normal') }
            ]} />
            <Text style={styles.statusText}>
              전체 상태: {isLoading ? '확인 중...' : getStatusText(sensorData?.status || 'normal')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  actionSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  character: {
    fontSize: 60,
    marginRight: 16,
  },
  characterContainer: {
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
  characterInfo: {
    flex: 1,
  },
  characterName: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  characterSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  characterStatus: {
    color: '#666',
    fontSize: 14,
  },
  container: {
    backgroundColor: '#F2F2F7',
    flex: 1,
  },
  greeting: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    flexDirection: 'row',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statusIndicator: {
    borderRadius: 6,
    height: 12,
    marginRight: 12,
    width: 12,
  },
  statusSection: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  statusText: {
    color: '#333',
    flex: 1,
    fontSize: 14,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: '48%',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  summarySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  summaryValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
