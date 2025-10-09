import React from 'react';

import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';

import { ReportStackScreenProps, Metric } from '@/types/navigation';

type ReportIndexScreenProps = ReportStackScreenProps<'ReportIndex'>;

const reportMetrics: Array<{ key: Metric; name: string; icon: string; description: string }> = [
  { 
    key: 'temperature', 
    name: '온도 리포트', 
    icon: '🌡️', 
    description: '온도 변화 추이를 확인하세요' 
  },
  { 
    key: 'humidity', 
    name: '습도 리포트', 
    icon: '💧', 
    description: '습도 변화 추이를 확인하세요' 
  },
  { 
    key: 'metal', 
    name: '금속 리포트', 
    icon: '⚡', 
    description: '금속 함량 변화를 확인하세요' 
  },
  { 
    key: 'voc', 
    name: 'VOC 리포트', 
    icon: '🌬️', 
    description: 'VOC 농도 변화를 확인하세요' 
  },
];

export default function ReportIndexScreen({ navigation }: ReportIndexScreenProps) {
  const handleMetricPress = (metric: Metric) => {
    navigation.navigate('ReportMetric', { metric });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>리포트</Text>
          <Text style={styles.subtitle}>
            과거 데이터를 통해 패턴을 분석해보세요.
          </Text>
        </View>

        <View style={styles.metricsList}>
          {reportMetrics.map((metric) => (
            <Pressable
              key={metric.key}
              style={styles.metricCard}
              onPress={() => handleMetricPress(metric.key)}
            >
              <View style={styles.metricContent}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricName}>{metric.name}</Text>
                  <Text style={styles.metricDescription}>{metric.description}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>최근 분석 결과</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>전체 트렌드</Text>
            <Text style={styles.summaryDescription}>
              지난 7일간의 데이터를 분석한 결과, 전반적으로 안정적인 상태를 유지하고 있습니다.
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>7일</Text>
                <Text style={styles.statLabel}>분석 기간</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>95%</Text>
                <Text style={styles.statLabel}>정상 범위</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>알림 발생</Text>
              </View>
            </View>
          </View>
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
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  metricContent: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  metricDescription: {
    color: '#666',
    fontSize: 14,
  },
  metricIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  metricInfo: {
    flex: 1,
  },
  metricName: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricsList: {
    marginBottom: 24,
    paddingHorizontal: 20,
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
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  statValue: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  summarySection: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
