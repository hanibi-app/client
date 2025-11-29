import { useState } from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/common/AppButton';
import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import { HanibiLevel } from '@/constants/hanibiThresholds';
import { resetOnboardingProgress } from '@/services/storage/onboarding';
import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function TabOneScreen() {
  const [level, setLevel] = useState<HanibiLevel>('medium');
  const { setHasOnboarded } = useAppState();

  const handleLevelChange = (newLevel: HanibiLevel) => {
    setLevel(newLevel);
  };

  const handleResetOnboarding = async () => {
    try {
      await resetOnboardingProgress();
      // RootNavigator의 useEffect에서 자동으로 Login 화면으로 리셋됨
      setHasOnboarded(false);
    } catch (error) {
      console.error('온보딩 리셋 실패:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>한니비 캐릭터</Text>
      <Text style={styles.subtitle}>온습도 상태에 따라 캐릭터가 변합니다</Text>

      <View style={styles.characterContainer}>
        <HanibiCharacter2D level={level} animated={true} size={300} />
      </View>

      <View style={styles.controls}>
        <Text style={styles.controlLabel}>레벨 변경:</Text>
        <View style={styles.buttonRow}>
          <AppButton
            label="쾌적 (Low)"
            variant={level === 'low' ? 'primary' : 'secondary'}
            onPress={() => handleLevelChange('low')}
            size="sm"
          />
          <AppButton
            label="보통 (Medium)"
            variant={level === 'medium' ? 'primary' : 'secondary'}
            onPress={() => handleLevelChange('medium')}
            size="sm"
          />
          <AppButton
            label="주의 (High)"
            variant={level === 'high' ? 'primary' : 'secondary'}
            onPress={() => handleLevelChange('high')}
            size="sm"
          />
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>🎨 현재 상태: {getLevelText(level)}</Text>
        <Text style={styles.description}>
          한니비는 물방울 모양의 귀여운 캐릭터입니다. {'\n'}
          환경 상태에 따라 색상이 변화하며, 부드럽게 움직입니다.
        </Text>
      </View>

      {/* 개발용: 온보딩 다시보기 */}
      <View style={styles.devSection}>
        <AppButton
          label="🔄 온보딩 다시보기"
          variant="ghost"
          onPress={handleResetOnboarding}
          size="sm"
        />
      </View>
    </ScrollView>
  );
}

function getLevelText(level: HanibiLevel): string {
  switch (level) {
    case 'low':
      return '쾌적 😊 (파란색)';
    case 'medium':
      return '보통 😐 (주황색)';
    case 'high':
      return '주의 😰 (빨간색)';
  }
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  container: {
    alignItems: 'center',
    flexGrow: 1,
    padding: spacing.lg,
  },
  controlLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
  controls: {
    alignItems: 'center',
    marginTop: spacing.lg,
    width: '100%',
  },
  description: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  devSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingTop: spacing.xl,
    width: '100%',
  },
  info: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  infoText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginTop: spacing.lg,
  },
});
