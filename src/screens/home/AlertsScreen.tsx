import React from 'react';

import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';

import { useAlertsData } from '@/hooks/useReportQuery';
import { HomeStackScreenProps } from '@/types/navigation';

type AlertsScreenProps = HomeStackScreenProps<'Alerts'>;

export default function AlertsScreen({ navigation }: AlertsScreenProps) {
  const { data: alerts, isLoading } = useAlertsData();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#FFCC00';
      default: return '#8E8E93';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'temperature': return '🌡️';
      case 'humidity': return '💧';
      case 'metal': return '⚡';
      case 'voc': return '🌬️';
      default: return '⚠️';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>알림을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>알림 내역</Text>
          <Text style={styles.subtitle}>
            총 {alerts?.length || 0}개의 알림이 있습니다.
          </Text>
        </View>

        {alerts && alerts.length > 0 ? (
          <View style={styles.alertsList}>
            {alerts.map((alert) => (
              <Pressable key={alert.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertIcon}>{getTypeIcon(alert.type)}</Text>
                  <View style={styles.alertInfo}>
                    <Text style={styles.alertType}>
                      {alert.type === 'temperature' ? '온도' :
                       alert.type === 'humidity' ? '습도' :
                       alert.type === 'metal' ? '금속' :
                       alert.type === 'voc' ? 'VOC' : alert.type}
                    </Text>
                    <Text style={styles.alertTime}>
                      {new Date(alert.timestamp).toLocaleString('ko-KR')}
                    </Text>
                  </View>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(alert.severity) }
                  ]}>
                    <Text style={styles.severityText}>
                      {getSeverityText(alert.severity)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                {!alert.read && (
                  <View style={styles.unreadIndicator}>
                    <Text style={styles.unreadText}>새 알림</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>알림이 없습니다</Text>
            <Text style={styles.emptyDescription}>
              새로운 알림이 있으면 여기에 표시됩니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  alertHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertMessage: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  alertTime: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  alertType: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertsList: {
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#F2F2F7',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  emptyDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  severityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  unreadIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
