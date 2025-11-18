import React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

// 더미 데이터
const DUMMY_DATA = [
  { day: '월', value: 32 },
  { day: '화', value: 45 },
  { day: '수', value: 28 },
  { day: '목', value: 56 },
  { day: '금', value: 41 },
  { day: '토', value: 38 },
  { day: '일', value: 50 },
];

export default function ReportsScreen() {
  const maxValue = Math.max(...DUMMY_DATA.map((d) => d.value));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>운동 변화</Text>
        <Text style={styles.subtitle}>주간 리포트</Text>

        {/* 간단한 막대 그래프 */}
        <View style={styles.chartContainer}>
          {DUMMY_DATA.map((item, index) => {
            const height = (item.value / maxValue) * 150;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.bar, { height }]} />
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            );
          })}
        </View>

        {/* 하단 테이블 */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>평균</Text>
            <Text style={styles.tableValue}>
              {(DUMMY_DATA.reduce((sum, d) => sum + d.value, 0) / DUMMY_DATA.length).toFixed(1)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>최대</Text>
            <Text style={styles.tableValue}>{maxValue}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>최소</Text>
            <Text style={styles.tableValue}>{Math.min(...DUMMY_DATA.map((d) => d.value))}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    width: 30,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  barLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginTop: spacing.sm,
  },
  chartContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    flexDirection: 'row',
    height: 200,
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    backgroundColor: colors.gray50,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    marginTop: spacing.sm,
  },
  table: {
    backgroundColor: colors.background,
    borderRadius: 16,
    marginTop: spacing.xl,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
  },
  tableRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  tableValue: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
});
