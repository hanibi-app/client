import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Shadows } from '../../constants/DesignSystem';

export default function CautionStep1Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.headerLabel}>주의사항</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.square}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>벼마파하는 디자인</Text>
          </View>
        </View>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.contentArea}>
        <Text style={styles.title}>이런 음식은 먹을 수 없어요</Text>
        <Text style={styles.body}>
          닭이나 생선의 뼈, 조개나 게, 호두 같은 딱딱한 껍질, 튀김이나 국물 기름처럼 기름기가 많은 음식,
          그리고 비닐·플라스틱·금속 같은 이물질은 소화되지 않으니 넣지 말아주세요.{"\n"}(임시 문구, 변경 해야함)
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={() => router.back()} style={styles.ghostPill}>
          <Text style={styles.ghostText}>뒤로 가기</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/caution/step2')} style={styles.nextFab}>
          <Text style={styles.nextFabText}>→</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  headerArea: { alignItems: 'center', paddingTop: Spacing.md },
  headerLabel: { ...Typography.bodySmall, color: Colors.light.textSecondary },
  heroCard: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  square: {
    height: 260,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  circleText: { ...Typography.bodySmall, color: Colors.light.background },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: Spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D9D9D9' },
  dotActive: { backgroundColor: Colors.light.primary },
  contentArea: { paddingHorizontal: Spacing.xl },
  title: { ...Typography.h3, color: Colors.light.text, marginTop: Spacing.md },
  body: { ...Typography.bodySmall, color: Colors.light.textSecondary, marginTop: Spacing.sm, lineHeight: 20 },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ghostPill: {
    paddingHorizontal: Spacing.lg,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: { ...Typography.button, color: Colors.light.textSecondary },
  nextFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextFabText: { ...Typography.button, color: Colors.light.background },
});


