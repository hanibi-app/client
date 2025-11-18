import React from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>대시보드</Text>
        <Text style={styles.subtitle}>오늘의 요약</Text>

        {/* 카드 3개 */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>처리 횟수</Text>
            <Text style={styles.cardValue}>32</Text>
            <Text style={styles.cardUnit}>회</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>평균 습도</Text>
            <Text style={styles.cardValue}>42</Text>
            <Text style={styles.cardUnit}>%</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>VOC</Text>
            <Text style={styles.cardValue}>120</Text>
            <Text style={styles.cardUnit}>ppm</Text>
          </View>
        </View>

        {/* CTA 버튼 */}
        <Pressable onPress={() => console.log('센서 연결')} style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>센서 연결/검사하기</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    marginBottom: spacing.md,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
  },
  cardLabel: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
  },
  cardUnit: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  cardValue: {
    color: colors.text,
    fontSize: 48,
    fontWeight: typography.weights.bold,
  },
  cardsContainer: {
    marginTop: spacing.xl,
    width: '100%',
  },
  container: {
    backgroundColor: colors.gray50,
    flex: 1,
  },
  content: {
    padding: spacing.xl,
  },
  ctaButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    width: '100%',
  },
  ctaButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    marginTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
});
