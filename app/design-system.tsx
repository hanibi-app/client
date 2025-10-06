import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Button } from '../shared/ui/Button';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  ColorPalette,
  FontSize,
  FontWeight,
} from '../constants/DesignSystem';

export default function DesignSystemScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>한니비 디자인 시스템</Text>
          <Text style={styles.headerSubtitle}>컬러, 타이포그래피, 스페이싱, 그림자 시스템</Text>
        </View>

        {/* 컬러 시스템 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 컬러 시스템</Text>
          
          {/* 브랜드 컬러 */}
          <View style={styles.colorGroup}>
            <Text style={styles.colorGroupTitle}>브랜드 컬러</Text>
            <View style={styles.colorGrid}>
              <View style={styles.colorItem}>
                <View style={[styles.colorSwatch, { backgroundColor: ColorPalette.primary.lightGreen }]} />
                <Text style={styles.colorName}>연두</Text>
                <Text style={styles.colorCode}>#90C695</Text>
              </View>
              <View style={styles.colorItem}>
                <View style={[styles.colorSwatch, { backgroundColor: ColorPalette.primary.lightBlue }]} />
                <Text style={styles.colorName}>옅은 파랑</Text>
                <Text style={styles.colorCode}>#A8D8EA</Text>
              </View>
              <View style={styles.colorItem}>
                <View style={[styles.colorSwatch, { backgroundColor: ColorPalette.primary.mint }]} />
                <Text style={styles.colorName}>민트</Text>
                <Text style={styles.colorCode}>#7BC8A4</Text>
              </View>
            </View>
          </View>

          {/* 중성 컬러 */}
          <View style={styles.colorGroup}>
            <Text style={styles.colorGroupTitle}>중성 컬러</Text>
            <View style={styles.colorGrid}>
              <View style={styles.colorItem}>
                <View style={[styles.colorSwatch, { backgroundColor: ColorPalette.neutral.lightBeige }]} />
                <Text style={styles.colorName}>라이트베이지</Text>
                <Text style={styles.colorCode}>#F5F1EB</Text>
              </View>
              <View style={styles.colorItem}>
                <View style={[styles.colorSwatch, { backgroundColor: ColorPalette.neutral.cream }]} />
                <Text style={styles.colorName}>크림</Text>
                <Text style={styles.colorCode}>#FFF8F0</Text>
              </View>
              <View style={styles.colorItem}>
                <View style={[styles.colorSwatch, { backgroundColor: ColorPalette.neutral.midGray }]} />
                <Text style={styles.colorName}>미드 그레이</Text>
                <Text style={styles.colorCode}>#636E72</Text>
              </View>
              <View style={styles.colorItem}>
                <View style={[styles.colorSwatch, { backgroundColor: ColorPalette.neutral.darkGray }]} />
                <Text style={styles.colorName}>다크 그레이</Text>
                <Text style={styles.colorCode}>#2D3436</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 타이포그래피 시스템 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 타이포그래피 시스템</Text>
          
          <View style={styles.typographyGroup}>
            <Text style={styles.typographyItem} style={Typography.h1}>
              Heading 1 - 메인 타이틀 (32px)
            </Text>
            <Text style={styles.typographyItem} style={Typography.h2}>
              Heading 2 - 섹션 제목 (24px)
            </Text>
            <Text style={styles.typographyItem} style={Typography.h3}>
              Heading 3 - 카드 제목 (20px)
            </Text>
            <Text style={styles.typographyItem} style={Typography.bodyLarge}>
              Body Large - 중요한 텍스트 (18px)
            </Text>
            <Text style={styles.typographyItem} style={Typography.bodyRegular}>
              Body Regular - 일반 텍스트 (16px)
            </Text>
            <Text style={styles.typographyItem} style={Typography.bodySmall}>
              Body Small - 보조 텍스트 (14px)
            </Text>
            <Text style={styles.typographyItem} style={Typography.caption}>
              Caption - 설명 텍스트 (12px)
            </Text>
          </View>

          {/* 폰트 굵기 예시 */}
          <View style={styles.typographyGroup}>
            <Text style={styles.typographyItem} style={[Typography.bodyRegular, { fontWeight: FontWeight.thin }]}>
              Thin (100) - 매우 얇은 폰트
            </Text>
            <Text style={styles.typographyItem} style={[Typography.bodyRegular, { fontWeight: FontWeight.light }]}>
              Light (300) - 얇은 폰트
            </Text>
            <Text style={styles.typographyItem} style={[Typography.bodyRegular, { fontWeight: FontWeight.regular }]}>
              Regular (400) - 일반 폰트
            </Text>
            <Text style={styles.typographyItem} style={[Typography.bodyRegular, { fontWeight: FontWeight.medium }]}>
              Medium (500) - 중간 굵기 폰트
            </Text>
            <Text style={styles.typographyItem} style={[Typography.bodyRegular, { fontWeight: FontWeight.semibold }]}>
              Semibold (600) - 반굵은 폰트
            </Text>
            <Text style={styles.typographyItem} style={[Typography.bodyRegular, { fontWeight: FontWeight.bold }]}>
              Bold (700) - 굵은 폰트
            </Text>
          </View>
        </View>

        {/* 스페이싱 시스템 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📏 스페이싱 시스템</Text>
          
          <View style={styles.spacingGroup}>
            <View style={styles.spacingItem}>
              <View style={[styles.spacingBar, { width: Spacing.xs }]} />
              <Text style={styles.spacingLabel}>XS: {Spacing.xs}px</Text>
            </View>
            <View style={styles.spacingItem}>
              <View style={[styles.spacingBar, { width: Spacing.sm }]} />
              <Text style={styles.spacingLabel}>SM: {Spacing.sm}px</Text>
            </View>
            <View style={styles.spacingItem}>
              <View style={[styles.spacingBar, { width: Spacing.md }]} />
              <Text style={styles.spacingLabel}>MD: {Spacing.md}px</Text>
            </View>
            <View style={styles.spacingItem}>
              <View style={[styles.spacingBar, { width: Spacing.lg }]} />
              <Text style={styles.spacingLabel}>LG: {Spacing.lg}px</Text>
            </View>
            <View style={styles.spacingItem}>
              <View style={[styles.spacingBar, { width: Spacing.xl }]} />
              <Text style={styles.spacingLabel}>XL: {Spacing.xl}px</Text>
            </View>
            <View style={styles.spacingItem}>
              <View style={[styles.spacingBar, { width: Spacing.xxl }]} />
              <Text style={styles.spacingLabel}>XXL: {Spacing.xxl}px</Text>
            </View>
          </View>
        </View>

        {/* 그림자 시스템 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 그림자 시스템</Text>
          
          <View style={styles.shadowGroup}>
            <View style={[styles.shadowCard, Shadows.none]}>
              <Text style={styles.shadowLabel}>No Shadow</Text>
            </View>
            <View style={[styles.shadowCard, Shadows.xs]}>
              <Text style={styles.shadowLabel}>XS Shadow</Text>
            </View>
            <View style={[styles.shadowCard, Shadows.sm]}>
              <Text style={styles.shadowLabel}>SM Shadow</Text>
            </View>
            <View style={[styles.shadowCard, Shadows.md]}>
              <Text style={styles.shadowLabel}>MD Shadow</Text>
            </View>
            <View style={[styles.shadowCard, Shadows.lg]}>
              <Text style={styles.shadowLabel}>LG Shadow</Text>
            </View>
            <View style={[styles.shadowCard, Shadows.xl]}>
              <Text style={styles.shadowLabel}>XL Shadow</Text>
            </View>
          </View>
        </View>

        {/* 컴포넌트 예시 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧩 컴포넌트 예시</Text>
          
          <View style={styles.componentGroup}>
            <Text style={styles.componentGroupTitle}>Button 컴포넌트</Text>
            
            <View style={styles.buttonRow}>
              <Button title="Primary" onPress={() => {}} variant="primary" />
              <Button title="Secondary" onPress={() => {}} variant="secondary" />
            </View>
            
            <View style={styles.buttonRow}>
              <Button title="Outline" onPress={() => {}} variant="outline" />
              <Button title="Ghost" onPress={() => {}} variant="ghost" />
            </View>
            
            <View style={styles.buttonRow}>
              <Button title="Small" onPress={() => {}} size="small" />
              <Button title="Medium" onPress={() => {}} size="medium" />
              <Button title="Large" onPress={() => {}} size="large" />
            </View>
            
            <View style={styles.buttonRow}>
              <Button title="Disabled" onPress={() => {}} disabled />
              <Button title="Loading" onPress={() => {}} loading />
              <Button title="Full Width" onPress={() => {}} fullWidth />
            </View>
          </View>
        </View>

        {/* 푸터 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            한니비 디자인 시스템 v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            일관되고 아름다운 UI를 위한 가이드라인
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Spacing.xl,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.light.background,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    ...Typography.bodyLarge,
    color: Colors.light.background,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  colorGroup: {
    marginBottom: Spacing.xl,
  },
  colorGroupTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: Spacing.sm,
    marginBottom: Spacing.xs,
    ...Shadows.sm,
  },
  colorName: {
    ...Typography.bodySmall,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  colorCode: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  typographyGroup: {
    marginBottom: Spacing.lg,
  },
  typographyItem: {
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  spacingGroup: {
    gap: Spacing.md,
  },
  spacingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  spacingBar: {
    height: 20,
    backgroundColor: Colors.light.primary,
    borderRadius: Spacing.xs,
  },
  spacingLabel: {
    ...Typography.bodyRegular,
    color: Colors.light.text,
  },
  shadowGroup: {
    gap: Spacing.md,
  },
  shadowCard: {
    backgroundColor: Colors.light.card,
    padding: Spacing.lg,
    borderRadius: Spacing.sm,
    alignItems: 'center',
  },
  shadowLabel: {
    ...Typography.bodyRegular,
    color: Colors.light.text,
  },
  componentGroup: {
    gap: Spacing.lg,
  },
  componentGroupTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  footer: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
  },
  footerText: {
    ...Typography.bodyLarge,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  footerSubtext: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
  },
});

