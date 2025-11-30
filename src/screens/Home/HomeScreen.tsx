import React, { useEffect, useRef, useState } from 'react';

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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EditHanibiIcon from '@/assets/images/edit-hanibi.svg';
import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import { DecorativeBackground } from '@/components/home/DecorativeBackground';
import { HomeMessageCard } from '@/components/home/HomeMessageCard';
import { NameCard } from '@/components/home/NameCard';
import { ProgressBar } from '@/components/home/ProgressBar';
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

  // characterName이 변경되면 editValue도 업데이트 (편집 중이 아닐 때만)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(characterName);
    }
  }, [characterName, isEditing]);

  // 진행률 계산 (30% 남음 = 70% 진행)
  const progress = 70;

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
  const CHARACTER_SIZE = Math.floor(SCREEN_WIDTH * 0.65);
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
        <DecorativeBackground rectangleColor={YELLOW_RECTANGLE_COLOR} />

        <HomeMessageCard
          paddingTop={messageTopPadding}
          icon={<MaterialIcons name="local-fire-department" size={24} color="#FF6B35" />}
          title="너무 더워서 힘들어요 😩"
          description={
            <Text>
              <Text style={styles.temperatureHighlight}>온도</Text> 한 번만 확인해 주세요!
            </Text>
          }
        />

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
                <NameCard
                  isEditing={isEditing}
                  autoFocus={isEditing}
                  characterName={characterName}
                  editValue={editValue}
                  onEditPress={handleEditPress}
                  onChangeText={setEditValue}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  editActionWidth={editActionWidth}
                  textInputRef={textInputRef}
                />
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

          <ProgressBar
            progress={progress}
            description="다 먹기까지 30% 남음"
            textColor={PROGRESS_TEXT_COLOR}
          />
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
  nameCardWrapper: {
    alignSelf: 'center',
    width: '100%',
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  temperatureHighlight: {
    color: colors.danger,
  },
});
