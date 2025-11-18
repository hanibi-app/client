import React, { useState } from 'react';

import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import OutlinedButton from '@/components/common/OutlinedButton';
import ScreenHeader from '@/components/common/ScreenHeader';
import { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type PrecautionsScreenProps = NativeStackScreenProps<RootStackParamList, 'CautionSlides'> & {
  onComplete?: () => void;
};

const PRECAUTIONS_PAGES: Array<{
  title: string;
  description: string[];
}> = [
  {
    title: '이런 음식은 먹을 수 없어요',
    description: [
      '닭이나 생선의 뼈, 조개나 게, 호두 같은',
      '딱딱한 껍질, 튀김이나 국물 기름처럼',
      '기름기가 많은 음식,',
      '그리고 비닐·플라스틱·금속 같은 이물질은',
      '소화되지 않으니 넣지 말아주세요.',
      '(임시 문구, 변경 해야함)',
    ],
  },
  {
    title: '냄새가 날 땐 이렇게 해 주세요',
    description: [
      '뚜껑을 꼭 닫아 주시고,',
      '내부가 가득 찼다면 음식물을 비워 주세요.',
      '필터를 교체하거나 청소해 주시면',
      '냄새가 줄어들어요.',
      '(임시 문구, 변경 해야함)',
    ],
  },
  {
    title: '원격 조종은 이렇게 해 주세요',
    description: [
      '전원 버튼을 누르면 제가 켜지고,',
      '정지 버튼을 누르면 바로 멈춰요.',
      '교반 버튼을 누르면 음식물이 잘 섞이도록 제가 회전하고,',
      '탈취 버튼을 누르면 냄새 제거 기능이 작동합니다.',
      '또, 상태 확인 버튼을 누르면',
      '지금 제 소화 상태와 점수를 확인하실 수 있어요.',
      '(임시 문구, 변경 해야함)',
    ],
  },
];

const HORIZONTAL_PADDING = spacing.xl;

export default function PrecautionsScreen({ navigation, onComplete }: PrecautionsScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);
  const insets = useSafeAreaInsets();

  const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
  const CHARACTER_SIZE = Math.floor(CARD_WIDTH * 0.6);

  const handleNext = () => {
    if (currentPage < PRECAUTIONS_PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // 마지막 페이지에서 완료 - MainTabs로 reset
      onComplete?.();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as never }],
        }),
      );
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      // 첫 페이지에서 뒤로가면 이전 화면으로
      navigation.goBack();
    }
  };

  const currentPageData = PRECAUTIONS_PAGES[currentPage];
  const isLastPage = currentPage === PRECAUTIONS_PAGES.length - 1;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="주의 사항"
        containerStyle={[styles.header, { paddingTop: insets.top + spacing.sm }]}
        titleStyle={styles.headerTitle}
      />

      <View style={styles.card}>
        <View style={styles.characterWrapper}>
          <View
            style={[
              styles.characterCircle,
              { width: CHARACTER_SIZE, height: CHARACTER_SIZE, borderRadius: CHARACTER_SIZE / 2 },
            ]}
          >
            <HanibiCharacter2D level="medium" animated size={Math.floor(CHARACTER_SIZE * 0.65)} />
          </View>
        </View>
      </View>

      <View style={styles.pageIndicator}>
        {PRECAUTIONS_PAGES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              index === currentPage ? styles.indicatorDotActive : styles.indicatorDotInactive,
            ]}
          />
        ))}
      </View>

      <View style={styles.textSection}>
        <Text style={styles.contentTitle}>{currentPageData.title}</Text>
        <View style={styles.descriptionContainer}>
          {currentPageData.description.map((line, index) => (
            <Text key={index} style={styles.descriptionText}>
              {line}
            </Text>
          ))}
        </View>
      </View>

      {/* 하단 버튼 (카드 밖) */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <OutlinedButton label={'뒤로 가기'} onPress={handleBack} style={styles.backButton} />
          <Pressable
            onPress={handleNext}
            style={styles.nextButton}
            accessibilityRole="button"
            accessibilityLabel={isLastPage ? '시작하기' : '다음'}
          >
            <Text style={styles.nextButtonIcon}>→</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    minWidth: 120,
  },
  buttonContainer: {
    alignItems: 'stretch',
    bottom: spacing.xxxl,
    paddingHorizontal: HORIZONTAL_PADDING,
    position: 'absolute',
    width: '100%',
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
  },
  card: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.gray50,
    borderRadius: 24,
    marginHorizontal: HORIZONTAL_PADDING,
    marginTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.xl,
  },
  characterCircle: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    justifyContent: 'center',
  },
  characterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  contentTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  descriptionContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  descriptionText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    lineHeight: 22,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    paddingBottom: spacing.md,
    paddingHorizontal: HORIZONTAL_PADDING,
    width: '100%',
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  indicatorDot: {
    borderRadius: 4,
    height: 8,
    marginHorizontal: 4,
    width: 8,
  },
  indicatorDotActive: {
    backgroundColor: colors.primary,
  },
  indicatorDotInactive: {
    backgroundColor: colors.gray100,
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 999,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  nextButtonIcon: {
    color: colors.white,
    fontSize: typography.sizes.lg + 15,
    fontWeight: typography.weights.bold,
  },
  pageIndicator: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  textSection: {
    alignItems: 'center',
    marginHorizontal: HORIZONTAL_PADDING,
    marginTop: spacing.xl,
  },
});
