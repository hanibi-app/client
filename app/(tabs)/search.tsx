import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Shadows } from '../../constants/DesignSystem';

export default function DashboardTabScreen() {
  const healthData = [
    { title: '체온 (온도)', value: '32', unit: '°C', color: '#4CAF50', icon: '🌡️' },
    { title: '수분컨디션 (습도)', value: '58', unit: '%', color: '#FF5722', icon: '💧' },
    { title: '급식량 (무게)', value: '1.2', unit: 'kg', color: '#4CAF50', icon: '🍽️' },
    { title: '향기지수 (VOC)', value: '120', unit: 'ppb', color: '#4CAF50', icon: '🌸' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>대시보드</Text>
        <Pressable style={styles.cameraButton}>
          <Text style={styles.cameraIcon}>📷</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>한니비의 건강 분석 결과예요</Text>
        </View>

        <View style={styles.lifeScoreSection}>
          <Text style={styles.lifeScoreTitle}>생명점수</Text>
          <Text style={styles.lifeScoreDescription}>
            총 36점으로 주의 상태에 속해 있어요
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, { backgroundColor: '#4CAF50' }]} />
              <View style={[styles.progressSegment, { backgroundColor: '#FFC107' }]} />
              <View style={[styles.progressSegment, { backgroundColor: '#FF9800' }]} />
              <View style={[styles.progressSegment, { backgroundColor: '#F44336' }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>안전</Text>
              <Text style={styles.progressLabel}>주의</Text>
              <Text style={styles.progressLabel}>경고</Text>
              <Text style={styles.progressLabel}>위험</Text>
            </View>
            <View style={[styles.progressIndicator, { left: '25%' }]} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          {healthData.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                <Text style={styles.statTitle}>{item.title}</Text>
              </View>
              <View style={styles.statValueContainer}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statUnit}>{item.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.tipSection}>
          <Text style={styles.tipText}>
            건강 점수를 올리려면 어떤 부분을 바꿔야 하는지 확인해 보세요!
          </Text>
          <Text style={styles.arrowIcon}>↓</Text>
        </View>

        <View style={styles.reportSection}>
          <Pressable 
            style={styles.reportButton}
            onPress={() => router.push('/report')}
          >
            <Text style={styles.reportButtonText}>리포트보기</Text>
          </Pressable>
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
  cameraButton: {
    padding: Spacing.sm,
  },
  cameraIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  titleSection: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  lifeScoreSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  lifeScoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: Spacing.sm,
  },
  lifeScoreDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: Spacing.lg,
  },
  progressBarContainer: {
    position: 'relative',
  },
  progressBar: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressSegment: {
    flex: 1,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666666',
  },
  progressIndicator: {
    position: 'absolute',
    top: -5,
    width: 10,
    height: 30,
    backgroundColor: '#333333',
    borderRadius: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  statTitle: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginRight: Spacing.xs,
  },
  statUnit: {
    fontSize: 12,
    color: '#666666',
  },
  tipSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  tipText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#666666',
  },
  reportSection: {
    marginBottom: Spacing.xl,
  },
  reportButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
