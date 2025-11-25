import React, { useEffect, useRef, useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import EditHanibiIcon from '@/assets/images/edit-hanibi.svg';
import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import { HomeStackParamList } from '@/navigation/types';
import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const DEFAULT_EDIT_ACTION_WIDTH = 64;

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const characterName = useAppState((s) => s.characterName);
  const setCharacterName = useAppState((s) => s.setCharacterName);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(characterName);
  const textInputRef = useRef<TextInput>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // characterName이 변경되면 editValue도 업데이트 (편집 중이 아닐 때만)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(characterName);
    }
  }, [characterName, isEditing]);

  // 진행률 계산 (30% 남음 = 70% 진행)
  const progress = 70;

  // 진행바 애니메이션
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false, // width는 native driver를 사용할 수 없음
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // 진행 중 애니메이션 (계속 흐르는 효과 - 끊김 없이)
  useEffect(() => {
    // 초기값을 0으로 설정
    waveAnim.setValue(0);

    // 끊김 없이 연속적으로 흐르도록 애니메이션 구성
    // 그라데이션 패턴이 반복되므로 한 패턴만 이동하고 즉시 다음 패턴으로 이어지도록
    const createSeamlessLoop = () => {
      return Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 0.5, // 패턴의 절반만 이동
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(waveAnim, {
          toValue: 0, // 즉시 리셋 (시각적으로는 끊기지 않음)
          duration: 0,
          useNativeDriver: false,
        }),
      ]);
    };

    const flowAnimation = Animated.loop(createSeamlessLoop(), { iterations: -1 });
    flowAnimation.start();

    return () => {
      flowAnimation.stop();
      waveAnim.setValue(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditPress = () => {
    setEditValue(characterName);
    setIsEditing(true);
    // TextInput이 렌더링된 후 포커스하여 키보드가 올라오도록 함
    setTimeout(() => {
      textInputRef.current?.focus();
      // 편집 시작 시 전체 텍스트 선택
      textInputRef.current?.setNativeProps({ selection: { start: 0, end: characterName.length } });
    }, 100);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      setCharacterName(editValue.trim());
    } else {
      // 빈 값이면 원래 이름으로 복원
      setEditValue(characterName);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(characterName);
    setIsEditing(false);
  };

  // 캐릭터 크기
  const CHARACTER_SIZE = Math.floor(SCREEN_WIDTH * 0.5);
  const NAME_CARD_WIDTH = Math.min(Math.max(SCREEN_WIDTH * 0.6, 220), 320);
  const editActionWidth = Math.min(Math.max(NAME_CARD_WIDTH * 0.2, 44), DEFAULT_EDIT_ACTION_WIDTH);
  const messageTopPadding = Math.max(insets.top - spacing.xxxl, spacing.xs);

  // 장식 요소 색상
  const YELLOW_RECTANGLE_COLOR = '#FFF9C4';
  const PROGRESS_TEXT_COLOR = '#4CAF70';

  return (
    <LinearGradient
      colors={['#E0F7E8', '#FFE5E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 배경 장식 요소 */}
        <View style={styles.decorativeElements}>
          {/* 왼쪽 상단 노란색 둥근 사각형 */}
          <View style={[styles.yellowRectangle, { backgroundColor: YELLOW_RECTANGLE_COLOR }]} />
          {/* 작은 흰색 점들 */}
          <View style={styles.whiteDot1} />
          <View style={styles.whiteDot2} />
          {/* 오른쪽 중앙 분홍색 별들 */}
          <View style={styles.pinkStar1}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                d="M12 2L14.09 8.26L20 9.27L15 13.14L16.18 19.02L12 15.77L7.82 19.02L9 13.14L4 9.27L9.91 8.26L12 2Z"
                fill="#FFB6C1"
              />
            </Svg>
          </View>
          <View style={styles.pinkStar2}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                d="M12 2L14.09 8.26L20 9.27L15 13.14L16.18 19.02L12 15.77L7.82 19.02L9 13.14L4 9.27L9.91 8.26L12 2Z"
                fill="#FFB6C1"
              />
            </Svg>
          </View>
        </View>

        {/* 상단 상태 메시지 버블 */}
        <View style={[styles.topSection, { paddingTop: messageTopPadding }]}>
          <View style={styles.messageBubble}>
            <View style={styles.messageIcon}>
              <MaterialIcons name="local-fire-department" size={24} color="#FF6B35" />
            </View>
            <View style={styles.messageContent}>
              <Text style={styles.messageText1}>너무 더워서 힘들어요 😩</Text>
              <Text style={styles.messageText2}>
                <Text style={styles.temperatureText}>온도</Text> 한 번만 확인해 주세요!
              </Text>
            </View>
          </View>
        </View>

        {/* 중앙 캐릭터 */}
        <View style={styles.characterContainer}>
          <HanibiCharacter2D level="medium" animated={true} size={CHARACTER_SIZE} />
        </View>

        {/* 캐릭터 아래 버튼 및 진행바 */}
        <View style={styles.bottomSection}>
          {/* 버튼들 */}
          <View style={styles.buttonRow}>
            <View style={styles.buttonRowLeft} />
            <View style={styles.buttonRowCenter}>
              <View style={[styles.nameCardWrapper, { width: NAME_CARD_WIDTH }]}>
                {isEditing ? (
                  <View style={[styles.hanibiButton, styles.editContainer]}>
                    <View style={[styles.editSideSpacer, { width: editActionWidth }]} />
                    <TextInput
                      ref={textInputRef}
                      style={[styles.nameInput, styles.nameInputEditing]}
                      value={editValue}
                      onChangeText={setEditValue}
                      placeholder="이름을 입력하세요"
                      placeholderTextColor={colors.mutedText}
                      maxLength={10}
                      autoFocus={true}
                      returnKeyType="done"
                      onSubmitEditing={handleSave}
                      selectionColor={colors.primary}
                    />
                    <View style={[styles.editActions, { width: editActionWidth }]}>
                      <Pressable onPress={handleSave} style={styles.saveIconButton}>
                        <MaterialIcons
                          name="check"
                          size={20}
                          color={editValue.trim() ? colors.primary : colors.mutedText}
                        />
                      </Pressable>
                      <Pressable onPress={handleCancel} style={styles.cancelIconButton}>
                        <MaterialIcons name="close" size={20} color={colors.mutedText} />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Pressable onPress={handleEditPress} style={styles.hanibiButton}>
                    <Text style={styles.hanibiButtonText}>{characterName}</Text>
                    <MaterialIcons
                      name="edit"
                      size={16}
                      color={colors.text}
                      style={styles.editIcon}
                    />
                  </Pressable>
                )}
              </View>
            </View>
            <View style={styles.buttonRowRight}>
              <Pressable
                onPress={() => navigation.navigate('CharacterCustomize')}
                style={styles.customizeButton}
              >
                <EditHanibiIcon width={48} height={48} />
                <Text style={styles.customizeButtonText}>꾸며주기</Text>
              </Pressable>
            </View>
          </View>

          {/* 진행바 */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressBarGradient,
                    {
                      left: waveAnim.interpolate({
                        inputRange: [0, 0.5],
                        outputRange: ['-50%', '0%'],
                      }),
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[
                      '#6BE092',
                      '#FFD700',
                      '#6BE092',
                      '#FFD700',
                      '#6BE092',
                      '#FFD700',
                      '#6BE092',
                      '#FFD700',
                      '#6BE092',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
              </Animated.View>
            </View>
            <Text style={[styles.progressText, { color: PROGRESS_TEXT_COLOR }]}>
              다 먹기까지 30% 남음
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bottomSection: {
    marginTop: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: 0,
    width: '100%',
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: 0,
    width: '100%',
  },
  buttonRowCenter: {
    alignItems: 'center',
    flex: 0,
    justifyContent: 'center',
  },
  buttonRowLeft: {
    flex: 1,
  },
  buttonRowRight: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
  },
  cancelIconButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  characterContainer: {
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 1,
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingTop: 70,
  },
  container: {
    flex: 1,
  },
  customizeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customizeButtonText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  decorativeElements: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  editActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DEFAULT_EDIT_ACTION_WIDTH,
  },
  editContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 3,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
  },
  editIcon: {
    marginLeft: spacing.xs,
    position: 'absolute',
    right: spacing.lg + 8,
  },
  editSideSpacer: {
    width: DEFAULT_EDIT_ACTION_WIDTH,
  },
  hanibiButton: {
    alignItems: 'center',
    backgroundColor: colors.gray75,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    position: 'relative',
    width: '100%',
  },
  hanibiButtonText: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    width: '100%',
  },
  messageBubble: {
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    padding: spacing.md,
    width: '100%',
    zIndex: 1,
  },
  messageContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  messageIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText1: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  messageText2: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  nameCardWrapper: {
    alignSelf: 'center',
    width: '100%',
  },
  nameInput: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    minHeight: 24,
    paddingHorizontal: spacing.xs,
    paddingVertical: 0,
    textAlign: 'center',
    width: '100%',
  },
  nameInputEditing: {
    paddingHorizontal: spacing.lg,
  },
  pinkStar1: {
    position: 'absolute',
    right: '15%',
    top: '40%',
    zIndex: 0,
  },
  pinkStar2: {
    position: 'absolute',
    right: '12%',
    top: '45%',
    zIndex: 0,
  },
  progressBarBackground: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 28,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    borderRadius: 12,
    height: '100%',
    overflow: 'hidden',
  },
  progressBarGradient: {
    borderRadius: 12,
    height: '100%',
    position: 'absolute',
    width: '200%',
  },
  progressContainer: {
    marginTop: spacing.lg,
    width: '100%',
  },
  progressText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  saveIconButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  temperatureText: {
    color: colors.danger,
  },
  topSection: {
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  whiteDot1: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 8,
    left: spacing.xl,
    position: 'absolute',
    top: '25%',
    width: 8,
    zIndex: 0,
  },
  whiteDot2: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 8,
    position: 'absolute',
    right: '18%',
    top: '55%',
    width: 8,
    zIndex: 0,
  },
  yellowRectangle: {
    borderRadius: 20,
    height: 40,
    left: spacing.xl,
    position: 'absolute',
    top: spacing.lg,
    width: 120,
    zIndex: 0,
  },
});
