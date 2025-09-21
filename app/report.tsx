import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Shadows } from '../constants/DesignSystem';

export default function ReportScreen() {
  const [activeTab, setActiveTab] = useState('temperature');
  const [activeTimeRange, setActiveTimeRange] = useState('1일');

  const tabs = [
    { id: 'temperature', label: '체온 (온도)' },
    { id: 'humidity', label: '수분 컨디션 (습도)' },
    { id: 'feeding', label: '급식량 (무게)' },
    { id: 'voc', label: '향기지수 (VOC)' },
  ];

  const timeRanges = ['1일', '1주일', '1개월', '1년'];

  const temperatureData = {
    current: 27,
    max: { value: 33, time: '14시' },
    min: { value: 22, time: '03시' },
    average: 26,
    date: '2025.09.08',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>리포트</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>리포트 (과거 데이터)</Text>
        </View>

        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
              {activeTab === tab.id && <View style={styles.tabUnderline} />}
            </Pressable>
          ))}
        </View>

        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>온도 변화</Text>
              <Text style={styles.chartSubtitle}>시간대별 상태 리포트</Text>
            </View>
            <View style={styles.refreshSection}>
              <Text style={styles.refreshIcon}>🔄</Text>
              <Text style={styles.refreshText}>조금 전</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {/* 간단한 라인 그래프 시뮬레이션 */}
              <View style={styles.chartGrid}>
                <View style={styles.yAxis}>
                  <Text style={styles.yAxisLabel}>39°C</Text>
                  <Text style={styles.yAxisLabel}>36°C</Text>
                  <Text style={styles.yAxisLabel}>33°C</Text>
                  <Text style={styles.yAxisLabel}>30°C</Text>
                  <Text style={styles.yAxisLabel}>27°C</Text>
                  <Text style={styles.yAxisLabel}>24°C</Text>
                  <Text style={styles.yAxisLabel}>21°C</Text>
                  <Text style={styles.yAxisLabel}>18°C</Text>
                  <Text style={styles.yAxisLabel}>15°C</Text>
                </View>
                <View style={styles.chartArea}>
                  <View style={styles.chartLine} />
                </View>
              </View>
              <View style={styles.xAxis}>
                <Text style={styles.xAxisLabel}>오전 12시</Text>
                <Text style={styles.xAxisLabel}>오전 6시</Text>
                <Text style={styles.xAxisLabel}>오후 12시</Text>
                <Text style={styles.xAxisLabel}>오후 6시</Text>
              </View>
            </View>
          </View>

          <View style={styles.timeRangeContainer}>
            {timeRanges.map((range) => (
              <Pressable
                key={range}
                style={[
                  styles.timeRangeButton,
                  activeTimeRange === range && styles.activeTimeRangeButton
                ]}
                onPress={() => setActiveTimeRange(range)}
              >
                <Text style={[
                  styles.timeRangeText,
                  activeTimeRange === range && styles.activeTimeRangeText
                ]}>
                  {range}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>현재 온도</Text>
              <Text style={styles.summaryValue}>{temperatureData.current}°C</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>최고 온도</Text>
              <Text style={styles.summaryValue}>
                {temperatureData.max.value}°C 
                <Text style={styles.summaryTime}> ({temperatureData.max.time})</Text>
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>최저 온도</Text>
              <Text style={styles.summaryValue}>
                {temperatureData.min.value}°C 
                <Text style={styles.summaryTime}> ({temperatureData.min.time})</Text>
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>평균 온도</Text>
              <Text style={styles.summaryValue}>{temperatureData.average}°C</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>기준 일자</Text>
              <Text style={styles.summaryValue}>{temperatureData.date}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingBottom: 100, // 하단 탭바를 위한 여백
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: Spacing.sm,
  },
  backText: {
    fontSize: 24,
    color: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    backgroundColor: '#F0F0F0',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: 16,
    color: '#666666',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  tab: {
    marginRight: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  activeTab: {
    // 활성 탭 스타일
  },
  tabText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#4CAF50',
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    marginTop: Spacing.sm,
    padding: Spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: Spacing.xs,
  },
  refreshSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  refreshText: {
    fontSize: 12,
    color: '#999999',
  },
  chartContainer: {
    marginBottom: Spacing.lg,
  },
  chart: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chartGrid: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: Spacing.sm,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 2,
    // 간단한 곡선 시뮬레이션을 위한 스타일
    transform: [{ scaleY: 0.3 }],
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingLeft: 40,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#666666',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timeRangeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  activeTimeRangeButton: {
    backgroundColor: '#E0E0E0',
  },
  timeRangeText: {
    fontSize: 12,
    color: '#666666',
  },
  activeTimeRangeText: {
    color: '#333333',
    fontWeight: '600',
  },
  summarySection: {
    marginTop: Spacing.sm,
    padding: Spacing.lg,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  summaryTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
  },
});

