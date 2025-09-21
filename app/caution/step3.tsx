import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Shadows } from '../../constants/DesignSystem';

export default function CautionStep3Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.headerMuted}>주의사항 3</Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.headerLabel}>주의사항</Text>
        <View style={styles.square}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>캐릭터 디자인 필요</Text>
          </View>
        </View>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
      </View>

      <View style={styles.contentArea}>
        <Text style={styles.title}>원격 조종은 이렇게 해 주세요</Text>
        <Text style={styles.body}>
          전원 버튼을 누르면 전원 켜지고,{"\n"}
          정지 버튼을 누르면 바로 멈춰요.{"\n"}
          교반 버튼을 누르면 음식물이 잘 섞이도록 세게 회전하고,{"\n"}
          탈취 버튼을 누르면 냄새 제거 기능이 작동합니다.{"\n"}
          또, 상태 확인 버튼을 누르면 지금 제 소화 상태와 점수를 확인하실 수 있어요.{"\n"}
          (임시 문구, 변경 해야함)
        </Text>
      </View>

      <View style={styles.footerRow}>
        <Pressable onPress={() => router.back()} style={styles.ghostPill}>
          <Text style={styles.ghostText}>뒤로 가기</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/(tabs)/home')} style={styles.startPill}>
          <Text style={styles.startText}>시작하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  headerArea: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
  headerMuted: { ...Typography.h3, color: '#D3D3D3' },
  heroCard: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, alignItems: 'center' },
  headerLabel: { ...Typography.bodySmall, color: Colors.light.textSecondary, marginBottom: Spacing.sm },
  square: {
    width: '100%',
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
  body: { ...Typography.bodySmall, color: Colors.light.textSecondary, marginTop: Spacing.sm, lineHeight: 20, textAlign: 'center' },
  footerRow: {
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
  startPill: {
    paddingHorizontal: Spacing.lg,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: { ...Typography.button, color: Colors.light.primary },
});


