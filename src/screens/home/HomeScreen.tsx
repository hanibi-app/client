import React from 'react';

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSensorQuery } from '@/hooks/useSensorQuery';
import { useTheme } from '@/theme';
import { HomeStackScreenProps } from '@/types/navigation';

type HomeScreenProps = HomeStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { data: sensorData, isLoading } = useSensorQuery();
  const { tokens } = useTheme();

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
    const statusMap: Record<string, string> = {
      normal: tokens.state.success,
      warning: tokens.state.warning,
      danger: tokens.state.danger,
    };
    return statusMap[status] || tokens.text.muted;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '정상';
      case 'warning':
        return '주의';
      case 'danger':
        return '위험';
      default:
        return '알 수 없음';
    }
  };

  const dynamicStyles = StyleSheet.create({
    actionButton: {
      alignItems: 'center',
      backgroundColor: tokens.surface.card,
      borderRadius: 12,
      elevation: 1,
      flexDirection: 'row',
      marginBottom: 12,
      padding: 16,
      shadowColor: tokens.surface.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    actionButtonText: {
      color: tokens.text.primary,
      fontSize: 16,
      fontWeight: '500',
    },
    characterContainer: {
      alignItems: 'center',
      backgroundColor: tokens.surface.card,
      borderRadius: 16,
      elevation: 2,
      flexDirection: 'row',
      padding: 20,
      shadowColor: tokens.surface.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    characterName: {
      color: tokens.text.primary,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    characterStatus: {
      color: tokens.text.muted,
      fontSize: 14,
    },
    container: {
      backgroundColor: tokens.surface.background,
      flex: 1,
    },
    greeting: {
      color: tokens.text.primary,
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    sectionTitle: {
      color: tokens.text.primary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    statusCard: {
      alignItems: 'center',
      backgroundColor: tokens.surface.card,
      borderRadius: 12,
      elevation: 1,
      flexDirection: 'row',
      padding: 16,
      shadowColor: tokens.surface.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    statusText: {
      color: tokens.text.primary,
      flex: 1,
      fontSize: 14,
    },
    subtitle: {
      color: tokens.text.muted,
      fontSize: 16,
    },
    summaryCard: {
      alignItems: 'center',
      backgroundColor: tokens.surface.card,
      borderRadius: 12,
      elevation: 1,
      marginBottom: 12,
      padding: 16,
      shadowColor: tokens.surface.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      width: '48%',
    },
    summaryLabel: {
      color: tokens.text.muted,
      fontSize: 12,
      marginBottom: 4,
    },
    summaryValue: {
      color: tokens.text.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={dynamicStyles.greeting}>안녕하세요! 👋</Text>
          <Text style={dynamicStyles.subtitle}>한니비가 현재 상태를 알려드릴게요</Text>
        </View>

        {/* 캐릭터 섹션 */}
        <View style={styles.characterSection}>
          <View style={dynamicStyles.characterContainer}>
            <Text style={styles.character}>🤖</Text>
            <View style={styles.characterInfo}>
              <Text style={dynamicStyles.characterName}>한니비</Text>
              <Text style={dynamicStyles.characterStatus}>
                {isLoading ? '데이터 확인 중...' : getStatusText(sensorData?.status || 'normal')}
              </Text>
            </View>
          </View>
        </View>

        {/* 센서 요약 카드 */}
        <View style={styles.summarySection}>
          <Text style={dynamicStyles.sectionTitle}>현재 상태</Text>
          <View style={styles.summaryGrid}>
            <View style={dynamicStyles.summaryCard}>
              <Text style={styles.summaryIcon}>🌡️</Text>
              <Text style={dynamicStyles.summaryLabel}>온도</Text>
              <Text style={dynamicStyles.summaryValue}>
                {isLoading ? '--' : `${sensorData?.temperature}°C`}
              </Text>
            </View>
            <View style={dynamicStyles.summaryCard}>
              <Text style={styles.summaryIcon}>💧</Text>
              <Text style={dynamicStyles.summaryLabel}>습도</Text>
              <Text style={dynamicStyles.summaryValue}>
                {isLoading ? '--' : `${sensorData?.humidity}%`}
              </Text>
            </View>
            <View style={dynamicStyles.summaryCard}>
              <Text style={styles.summaryIcon}>⚡</Text>
              <Text style={dynamicStyles.summaryLabel}>금속</Text>
              <Text style={dynamicStyles.summaryValue}>
                {isLoading ? '--' : `${sensorData?.metal} mg/kg`}
              </Text>
            </View>
            <View style={dynamicStyles.summaryCard}>
              <Text style={styles.summaryIcon}>🌬️</Text>
              <Text style={dynamicStyles.summaryLabel}>VOC</Text>
              <Text style={dynamicStyles.summaryValue}>
                {isLoading ? '--' : `${sensorData?.voc} ppb`}
              </Text>
            </View>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionSection}>
          <Pressable style={dynamicStyles.actionButton} onPress={handleNavigateToDashboard}>
            <Text style={styles.actionButtonIcon}>📊</Text>
            <Text style={dynamicStyles.actionButtonText}>상세 대시보드</Text>
          </Pressable>

          <Pressable style={dynamicStyles.actionButton} onPress={handleNavigateToAlerts}>
            <Text style={styles.actionButtonIcon}>🔔</Text>
            <Text style={dynamicStyles.actionButtonText}>알림 내역</Text>
          </Pressable>

          <Pressable style={dynamicStyles.actionButton} onPress={handleNavigateToCamera}>
            <Text style={styles.actionButtonIcon}>📹</Text>
            <Text style={dynamicStyles.actionButtonText}>카메라 보기</Text>
          </Pressable>
        </View>

        {/* 상태 표시 */}
        <View style={styles.statusSection}>
          <View style={dynamicStyles.statusCard}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: getStatusColor(sensorData?.status || 'normal'),
                },
              ]}
            />
            <Text style={dynamicStyles.statusText}>
              전체 상태: {isLoading ? '확인 중...' : getStatusText(sensorData?.status || 'normal')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  character: {
    fontSize: 60,
    marginRight: 16,
  },
  characterInfo: {
    flex: 1,
  },
  characterSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summarySection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
});
