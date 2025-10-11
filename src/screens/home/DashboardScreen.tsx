import React from 'react';

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSensorQuery } from '@/hooks/useSensorQuery';
import { useTheme } from '@/theme';
import { HomeStackScreenProps, Metric } from '@/types/navigation';

type DashboardScreenProps = HomeStackScreenProps<'Dashboard'>;

const metrics: Array<{
  key: Metric;
  name: string;
  icon: string;
  unit: string;
}> = [
  { key: 'temperature', name: '온도', icon: '🌡️', unit: '°C' },
  { key: 'humidity', name: '습도', icon: '💧', unit: '%' },
  { key: 'metal', name: '금속', icon: '⚡', unit: 'mg/kg' },
  { key: 'voc', name: 'VOC', icon: '🌬️', unit: 'ppb' },
];

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { data: sensorData, isLoading } = useSensorQuery();
  const { tokens } = useTheme();

  const handleMetricPress = (metric: Metric) => {
    navigation.navigate('MetricTabs', { initial: metric });
  };

  const getMetricValue = (metric: Metric) => {
    if (!sensorData) return '--';
    switch (metric) {
      case 'temperature':
        return sensorData.temperature;
      case 'humidity':
        return sensorData.humidity;
      case 'metal':
        return sensorData.metal;
      case 'voc':
        return sensorData.voc;
      default:
        return '--';
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      normal: tokens.state.success,
      warning: tokens.state.warning,
      danger: tokens.state.danger,
    };
    return statusMap[status] || tokens.text.muted;
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: tokens.surface.background,
      flex: 1,
    },
    metricCard: {
      backgroundColor: tokens.surface.card,
      borderRadius: 16,
      elevation: 2,
      marginBottom: 16,
      padding: 20,
      shadowColor: tokens.surface.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    metricName: {
      color: tokens.text.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    metricValue: {
      color: tokens.brand.primary,
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    sectionTitle: {
      color: tokens.text.primary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    statusText: {
      color: tokens.text.muted,
      fontSize: 14,
    },
    subtitle: {
      color: tokens.text.muted,
      fontSize: 14,
      lineHeight: 20,
    },
    summaryCard: {
      backgroundColor: tokens.surface.card,
      borderRadius: 16,
      elevation: 2,
      padding: 20,
      shadowColor: tokens.surface.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    summaryDescription: {
      color: tokens.text.muted,
      fontSize: 14,
      lineHeight: 20,
    },
    summaryStatusText: {
      color: tokens.text.inverse,
      fontSize: 12,
      fontWeight: 'bold',
    },
    summaryTitle: {
      color: tokens.text.primary,
      fontSize: 16,
      fontWeight: 'bold',
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
          <Text style={dynamicStyles.title}>대시보드</Text>
          <Text style={dynamicStyles.subtitle}>각 지표를 클릭하면 상세 정보를 볼 수 있습니다.</Text>
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map(metric => (
            <Pressable
              key={metric.key}
              style={dynamicStyles.metricCard}
              onPress={() => handleMetricPress(metric.key)}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={dynamicStyles.metricName}>{metric.name}</Text>
              </View>
              <Text style={dynamicStyles.metricValue}>
                {isLoading ? '--' : `${getMetricValue(metric.key)}${metric.unit}`}
              </Text>
              <View style={styles.metricStatus}>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor: getStatusColor(sensorData?.status || 'normal'),
                    },
                  ]}
                />
                <Text style={dynamicStyles.statusText}>
                  {isLoading
                    ? '확인 중...'
                    : sensorData?.status === 'normal'
                      ? '정상'
                      : sensorData?.status === 'warning'
                        ? '주의'
                        : sensorData?.status === 'danger'
                          ? '위험'
                          : '알 수 없음'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.summarySection}>
          <Text style={dynamicStyles.sectionTitle}>전체 상태 요약</Text>
          <View style={dynamicStyles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={dynamicStyles.summaryTitle}>현재 상태</Text>
              <View
                style={[
                  styles.summaryStatus,
                  {
                    backgroundColor: getStatusColor(sensorData?.status || 'normal'),
                  },
                ]}
              >
                <Text style={dynamicStyles.summaryStatusText}>
                  {isLoading
                    ? '확인 중...'
                    : sensorData?.status === 'normal'
                      ? '정상'
                      : sensorData?.status === 'warning'
                        ? '주의'
                        : sensorData?.status === 'danger'
                          ? '위험'
                          : '알 수 없음'}
                </Text>
              </View>
            </View>
            <Text style={dynamicStyles.summaryDescription}>
              {isLoading
                ? '센서 데이터를 확인하고 있습니다...'
                : sensorData?.status === 'normal'
                  ? '모든 센서가 정상 범위 내에 있습니다.'
                  : sensorData?.status === 'warning'
                    ? '일부 센서에서 주의가 필요한 수치가 감지되었습니다.'
                    : sensorData?.status === 'danger'
                      ? '위험한 수치가 감지되었습니다. 즉시 확인이 필요합니다.'
                      : '센서 상태를 확인할 수 없습니다.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  metricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  metricIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  metricStatus: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  metricsGrid: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  statusIndicator: {
    borderRadius: 4,
    height: 8,
    marginRight: 8,
    width: 8,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summarySection: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  summaryStatus: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
