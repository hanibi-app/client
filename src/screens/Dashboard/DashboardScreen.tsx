import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import { Spacing, Shadows } from '@/styles/DesignSystem';

type DashboardScreenNavigationProp = NavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  
  const healthData = [
    { title: '생명 점수', value: '85', unit: '점', color: '#4CAF50', icon: '💚' },
    { title: '체온', value: '24.5', unit: '°C', color: '#FF9800', icon: '🌡️' },
    { title: '습도', value: '65', unit: '%', color: '#2196F3', icon: '💧' },
    { title: '급식량', value: '120', unit: 'g', color: '#9C27B0', icon: '🍽️' },
    { title: '향기 지수', value: '78', unit: '점', color: '#E91E63', icon: '🌸' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('CharacterCustomize')} style={styles.customizeButton}>
            <Text style={styles.customizeText}>캐릭터 꾸미기</Text>
          </Pressable>
        </View>
        <Text style={styles.headerTitle}>한니비의 건강 분석 결과</Text>
        <Text style={styles.headerSubtitle}>실시간 모니터링 데이터</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {healthData.map((item, index) => (
            <View key={index} style={[styles.statCard, { borderLeftColor: item.color }]}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>{item.icon}</Text>
                <Text style={styles.statTitle}>{item.title}</Text>
              </View>
              <View style={styles.statValueContainer}>
                <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.statUnit}>{item.unit}</Text>
              </View>
              <View style={styles.statProgress}>
                <View style={[styles.progressBar, { backgroundColor: item.color, width: `${parseInt(item.value)}%` }]} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>전체 상태 요약</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>건강 상태</Text>
              <Text style={styles.summaryValue}>양호</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>마지막 업데이트</Text>
              <Text style={styles.summaryValue}>2분 전</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>다음 급식 시간</Text>
              <Text style={styles.summaryValue}>3시간 후</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>💡 관리 팁</Text>
            <Text style={styles.actionText}>
              현재 습도가 조금 낮습니다. 물을 조금 더 주시면 좋겠어요!
            </Text>
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
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backText: {
    fontSize: 24,
    color: '#333333',
  },
  customizeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
  },
  customizeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  statsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    ...Shadows.sm,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  statTitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginRight: Spacing.xs,
  },
  statUnit: {
    fontSize: 14,
    color: '#666666',
  },
  statProgress: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  summarySection: {
    marginBottom: Spacing.xl,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: Spacing.md,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  actionSection: {
    marginBottom: Spacing.xl,
  },
  actionCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});
