import React, { useState } from 'react';

import { Dimensions, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PagerView } from 'react-native-pager-view';

import { useTheme } from '@/theme';
import { AuthStackScreenProps } from '@/types/navigation';

const { width: _width } = Dimensions.get('window');

type OnboardingWarningPagerScreenProps = AuthStackScreenProps<'OnboardingWarningPager'>;

const warningPages = [
  {
    id: 1,
    title: '주의사항 1',
    description: '센서를 물에 직접 닿지 않도록 주의하세요.',
    icon: '💧',
  },
  {
    id: 2,
    title: '주의사항 2',
    description: '고온 환경에서 사용하지 마세요.',
    icon: '🔥',
  },
  {
    id: 3,
    title: '주의사항 3',
    description: '정기적으로 센서를 청소해주세요.',
    icon: '🧽',
  },
];

export default function OnboardingWarningPagerScreen({
  navigation,
  route,
}: OnboardingWarningPagerScreenProps) {
  const [currentPage, setCurrentPage] = useState(route.params?.initialIndex || 0);
  const { tokens } = useTheme();

  const handleNext = () => {
    if (currentPage < warningPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // 마지막 페이지에서 캐릭터 꾸미기로 이동
      navigation.navigate('OnboardingCharacter');
    }
  };

  const handleSkip = () => {
    // 주의사항 건너뛰기
    navigation.navigate('OnboardingCharacter');
  };

  const dynamicStyles = StyleSheet.create({
    activeDot: {
      backgroundColor: tokens.brand.primary,
      borderRadius: 4,
      height: 8,
      marginHorizontal: 4,
      width: 8,
    },
    container: {
      backgroundColor: tokens.surface.background,
      flex: 1,
    },
    dot: {
      backgroundColor: tokens.text.muted,
      borderRadius: 4,
      height: 8,
      marginHorizontal: 4,
      width: 8,
    },
    nextButton: {
      backgroundColor: tokens.brand.primary,
      borderRadius: 12,
      marginBottom: 16,
      paddingVertical: 16,
    },
    nextButtonText: {
      color: tokens.text.inverse,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    pageDescription: {
      color: tokens.text.muted,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
    },
    pageTitle: {
      color: tokens.text.primary,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    skipButton: {
      backgroundColor: tokens.surface.card,
      borderRadius: 12,
      paddingVertical: 16,
    },
    skipButtonText: {
      color: tokens.text.muted,
      fontSize: 16,
      textAlign: 'center',
    },
  });

  const renderPage = (page: (typeof warningPages)[0], _index: number) => (
    <View key={page.id} style={styles.pageContainer}>
      <View style={styles.content}>
        <Text style={styles.icon}>{page.icon}</Text>
        <Text style={dynamicStyles.pageTitle}>{page.title}</Text>
        <Text style={dynamicStyles.pageDescription}>{page.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={currentPage}
        onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
      >
        {warningPages.map((page, index) => renderPage(page, index))}
      </PagerView>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {warningPages.map((_, index) => (
            <View
              key={index}
              style={[dynamicStyles.dot, index === currentPage && dynamicStyles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={dynamicStyles.nextButton} onPress={handleNext}>
            <Text style={dynamicStyles.nextButtonText}>
              {currentPage === warningPages.length - 1 ? '시작하기' : '다음'}
            </Text>
          </Pressable>

          <Pressable style={dynamicStyles.skipButton} onPress={handleSkip}>
            <Text style={dynamicStyles.skipButtonText}>건너뛰기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    gap: 12,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  pageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  pagerView: {
    flex: 1,
  },
});
