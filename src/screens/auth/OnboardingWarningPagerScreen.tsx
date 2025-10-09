import React, { useState } from 'react';

import { View, Text, StyleSheet, Pressable, SafeAreaView, Dimensions } from 'react-native';
import { PagerView } from 'react-native-pager-view';

import { AuthStackScreenProps } from '@/types/navigation';

const { width } = Dimensions.get('window');

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

export default function OnboardingWarningPagerScreen({ navigation, route }: OnboardingWarningPagerScreenProps) {
  const [currentPage, setCurrentPage] = useState(route.params?.initialIndex || 0);

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

  const renderPage = (page: typeof warningPages[0], index: number) => (
    <View key={page.id} style={styles.pageContainer}>
      <View style={styles.content}>
        <Text style={styles.icon}>{page.icon}</Text>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.description}>{page.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={currentPage}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {warningPages.map((page, index) => renderPage(page, index))}
      </PagerView>
      
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {warningPages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentPage && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentPage === warningPages.length - 1 ? '시작하기' : '다음'}
            </Text>
          </Pressable>
          
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>건너뛰기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeIndicator: {
    backgroundColor: '#007AFF',
  },
  buttonContainer: {
    gap: 12,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  description: {
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  indicator: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    height: 8,
    marginHorizontal: 4,
    width: 8,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  skipButton: {
    paddingVertical: 16,
  },
  skipButtonText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
