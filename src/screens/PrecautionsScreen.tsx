import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import HanibiCharacter3D from '@/components/common/HanibiCharacter3D';
import { ONBOARDING_ROUTES } from '@/constants/routes';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';

export type PrecautionsScreenProps = NativeStackScreenProps<OnboardingStackParamList, typeof ONBOARDING_ROUTES.PRECAUTIONS> & {
  onComplete?: () => void;
};

type PrecautionsPage = {
  title: string;
  description: string[];
  characterDescription: string;
};

const PRECAUTIONS_PAGES: PrecautionsPage[] = [
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
    characterDescription: '배아파하는 디자인',
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
    characterDescription: '꼬질꼬질 디자인',
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
    characterDescription: '세 번째 디자인 필요',
  },
];

export default function PrecautionsScreen({ navigation, onComplete }: PrecautionsScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);

  const CARD_WIDTH = SCREEN_WIDTH - spacing.xl * 2;
  const CHARACTER_SIZE = Math.floor(CARD_WIDTH * 0.6);

  const handleNext = () => {
    if (currentPage < PRECAUTIONS_PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // 마지막 페이지에서 완료
      onComplete?.();
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
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>주의사항</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
        {/* 캐릭터 컨테이너 */}
        <View style={[styles.characterContainer, { width: CHARACTER_SIZE, height: CHARACTER_SIZE }]}>
          <HanibiCharacter3D level="medium" animated={true} size={CHARACTER_SIZE} />
        </View>

        {/* 주요 내용 제목 */}
        <Text style={styles.contentTitle}>{currentPageData.title}</Text>

        {/* 상세 설명 */}
        <View style={styles.descriptionContainer}>
          {currentPageData.description.map((line, index) => (
            <Text key={index} style={styles.descriptionText}>
              {line}
            </Text>
          ))}
        </View>

        {/* 페이지 인디케이터 */}
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
        </View>

      {/* 하단 버튼 (카드 밖) */}
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>
            {currentPage === 0 ? '뒤로 가기' : '이전'}
          </Text>
        </Pressable>
        <Pressable onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {isLastPage ? '시작하기' : '다음'}
          </Text>
          {!isLastPage && (
            <Text style={styles.nextButtonIcon}>→</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.md,
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonContainer: {
    bottom: spacing.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    position: 'absolute',
    width: '100%',
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingBottom: spacing.xl,
    paddingTop: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: '100%',
  },
  cardContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 120,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.xl,
    width: '100%',
  },
  headerTitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
  },
  characterContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    paddingHorizontal: spacing.xl,
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
    paddingHorizontal: spacing.lg,
  },
  descriptionText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    lineHeight: 22,
    marginBottom: spacing.xs,
    textAlign: 'center',
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
    backgroundColor: '#d1d5db',
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  nextButtonIcon: {
    color: colors.primaryForeground,
    fontSize: typography.sizes.lg,
    marginLeft: spacing.sm,
  },
  nextButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
  },
});

