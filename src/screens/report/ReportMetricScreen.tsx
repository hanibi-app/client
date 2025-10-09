import React from 'react';

import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import { useReportData } from '@/hooks/useReportQuery';
import { ReportStackScreenProps } from '@/types/navigation';

type ReportMetricScreenProps = ReportStackScreenProps<'ReportMetric'>;

export default function ReportMetricScreen({ route }: ReportMetricScreenProps) {
  const { metric } = route.params;
  const { data: reportData, isLoading } = useReportData(metric);

  const getMetricName = (metric: string) => {
    switch (metric) {
      case 'temperature': return '온도';
      case 'humidity': return '습도';
      case 'metal': return '금속';
      case 'voc': return 'VOC';
      default: return metric;
    }
  };

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'temperature': return '°C';
      case 'humidity': return '%';
      case 'metal': return 'mg/kg';
      case 'voc': return 'ppb';
      default: return '';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up': return '상승';
      case 'down': return '하락';
      case 'stable': return '안정';
      default: return '알 수 없음';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>리포트를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{getMetricName(metric)} 리포트</Text>
          <Text style={styles.subtitle}>
            최근 24시간 데이터 기준
          </Text>
        </View>

        {reportData && (
          <>
            <View style={styles.summarySection}>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>현재 값</Text>
                  <Text style={styles.summaryValue}>
                    {reportData.current}{getMetricUnit(metric)}
                  </Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>평균</Text>
                  <Text style={styles.summaryValue}>
                    {reportData.average}{getMetricUnit(metric)}
                  </Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>최소</Text>
                  <Text style={styles.summaryValue}>
                    {reportData.min}{getMetricUnit(metric)}
                  </Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>최대</Text>
                  <Text style={styles.summaryValue}>
                    {reportData.max}{getMetricUnit(metric)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.trendSection}>
              <Text style={styles.sectionTitle}>트렌드 분석</Text>
              <View style={styles.trendCard}>
                <View style={styles.trendHeader}>
                  <Text style={styles.trendIcon}>{getTrendIcon(reportData.trend)}</Text>
                  <Text style={styles.trendText}>
                    {getTrendText(reportData.trend)} 추세
                  </Text>
                </View>
                <Text style={styles.trendDescription}>
                  {reportData.trend === 'up' ? '값이 상승하고 있습니다.' :
                   reportData.trend === 'down' ? '값이 하락하고 있습니다.' :
                   '값이 안정적으로 유지되고 있습니다.'}
                </Text>
              </View>
            </View>

            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>시간별 변화</Text>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartText}>📊</Text>
                <Text style={styles.chartDescription}>
                  차트 데이터: {reportData.chartData.length}개 데이터 포인트
                </Text>
                <Text style={styles.chartNote}>
                  TODO: 실제 차트 라이브러리 연동 필요
                </Text>
              </View>
            </View>

            <View style={styles.statusSection}>
              <Text style={styles.sectionTitle}>상태 분석</Text>
              <View style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <Text style={styles.statusTitle}>현재 상태</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: 
                      reportData.status === 'normal' ? '#34C759' :
                      reportData.status === 'warning' ? '#FF9500' :
                      reportData.status === 'danger' ? '#FF3B30' : '#8E8E93'
                    }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {reportData.status === 'normal' ? '정상' :
                       reportData.status === 'warning' ? '주의' :
                       reportData.status === 'danger' ? '위험' : '알 수 없음'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.statusDescription}>
                  {reportData.status === 'normal' ? 
                    '모든 수치가 정상 범위 내에 있습니다.' :
                   reportData.status === 'warning' ? 
                    '일부 수치가 주의 범위에 있습니다.' :
                   reportData.status === 'danger' ? 
                    '위험한 수치가 감지되었습니다.' :
                    '상태를 확인할 수 없습니다.'}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chartDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  chartNote: {
    color: '#8E8E93',
    fontSize: 12,
    fontStyle: 'italic',
  },
  chartPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  chartText: {
    fontSize: 48,
    marginBottom: 16,
  },
  container: {
    backgroundColor: '#F2F2F7',
    flex: 1,
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
  sectionTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  statusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusSection: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  statusTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
  },
  summaryCard: {
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trendCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trendDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  trendHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  trendIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  trendSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  trendText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
