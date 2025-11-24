import React, { useRef, useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import EditHanibiIcon from '@/assets/images/edit-hanibi.svg';
import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import { HomeStackParamList } from '@/navigation/types';
import { useAppState } from '@/state/useAppState';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const characterName = useAppState((s) => s.characterName);
  const setCharacterName = useAppState((s) => s.setCharacterName);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(characterName);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);
  const textInputRef = useRef<TextInput>(null);

  // 진행률 계산 (30% 남음 = 70% 진행)
  const progress = 70;

  const handleEditPress = () => {
    setEditValue(characterName);
    setIsEditing(true);
    // TextInput이 렌더링된 후 포커스하여 키보드가 올라오도록 함
    setTimeout(() => {
      textInputRef.current?.focus();
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
              {isEditing ? (
                <View
                  style={[
                    styles.editContainer,
                    buttonWidth ? { minWidth: buttonWidth } : undefined,
                  ]}
                >
                  <TextInput
                    ref={textInputRef}
                    style={styles.nameInput}
                    value={editValue}
                    onChangeText={setEditValue}
                    placeholder="이름을 입력하세요"
                    placeholderTextColor={colors.mutedText}
                    maxLength={10}
                    autoFocus={true}
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                    editable={true}
                    selectTextOnFocus={false}
                  />
                  <Pressable onPress={handleSave} style={styles.saveIconButton}>
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  </Pressable>
                  <Pressable onPress={handleCancel} style={styles.cancelIconButton}>
                    <MaterialIcons name="close" size={20} color={colors.mutedText} />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setButtonWidth(width);
                  }}
                  onPress={handleEditPress}
                  style={styles.hanibiButton}
                >
                  <Text style={styles.hanibiButtonText}>{characterName}</Text>
                  <MaterialIcons name="edit" size={16} color={colors.text} />
                </Pressable>
              )}
            </View>
            <View style={styles.buttonGap} />
            <Pressable
              onPress={() => navigation.navigate('CharacterCustomize')}
              style={styles.customizeButton}
            >
              <EditHanibiIcon width={48} height={48} />
              <Text style={styles.customizeButtonText}>꾸며주기</Text>
            </Pressable>
            <View style={styles.buttonRowRight} />
          </View>

          {/* 진행바 */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <LinearGradient
                colors={['#6BE092', '#FFD700']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progress}%` }]}
              />
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
  buttonGap: {
    width: spacing.lg,
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: 0,
  },
  buttonRowCenter: {
    alignItems: 'center',
  },
  buttonRowLeft: {
    flex: 1,
  },
  buttonRowRight: {
    flex: 1,
  },
  cancelIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
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
  editContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  hanibiButton: {
    alignItems: 'center',
    backgroundColor: colors.gray75,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  hanibiButtonText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  messageBubble: {
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    padding: spacing.md,
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
  nameInput: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    minHeight: 20,
    padding: 0,
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
  },
  progressContainer: {
    marginTop: spacing.sm,
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
    justifyContent: 'center',
    padding: spacing.xs,
  },
  temperatureText: {
    color: colors.danger,
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
