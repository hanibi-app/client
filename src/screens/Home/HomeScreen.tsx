import React, { useEffect, useRef, useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Animated,
  Easing,
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
import ModalPopup from '@/components/common/ModalPopup';
import { DecorativeBackground } from '@/components/home/DecorativeBackground';
import { HomeMessageCard } from '@/components/home/HomeMessageCard';
import { NameCard } from '@/components/home/NameCard';
import { ProgressBar } from '@/components/home/ProgressBar';
import { useDevices, usePairDevice } from '@/features/devices/hooks';
import { useMe, useUpdateProfile } from '@/features/user/hooks';
import { HomeStackParamList } from '@/navigation/types';
import { useAppState } from '@/state/useAppState';
import { useLoadingStore } from '@/store/loadingStore';
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
  const { data: me, isLoading } = useMe();
  const { data: devices } = useDevices();
  const updateProfile = useUpdateProfile();
  const pairDevice = usePairDevice();
  const { startLoading, stopLoading } = useLoadingStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(characterName);
  const [isPairingModalVisible, setIsPairingModalVisible] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  // 말풍선 애니메이션 (캐릭터와 동일한 둥실둥실 효과)
  const speechBubbleScaleAnim = useRef(new Animated.Value(1)).current;
  const speechBubbleTranslateYAnim = useRef(new Animated.Value(0)).current;

  // characterName이 변경되면 editValue도 업데이트 (편집 중이 아닐 때만)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(characterName);
    }
  }, [characterName, isEditing]);

  // 서버의 닉네임이 변경되면 characterName도 동기화 (초기 로드 시)
  useEffect(() => {
    if (me?.nickname && me.nickname !== characterName) {
      setCharacterName(me.nickname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.nickname]); // characterName 의존성 제외 (무한 루프 방지)

  // 페어링 상태 확인: 서버 기기 목록을 우선 확인
  // 서버에 기기가 있으면 페어링됨, 서버에 기기가 없으면 페어링 안됨 (로컬 저장소는 무시)
  const isPaired = devices && devices.length > 0;

  // React Query의 isLoading을 전역 로딩과 연동
  useEffect(() => {
    if (isLoading) {
      startLoading('홈 데이터를 불러오는 중...');
    } else {
      stopLoading();
    }
  }, [isLoading, startLoading, stopLoading]);

  // 말풍선 둥실둥실 애니메이션 (캐릭터와 동일하게 복사)
  useEffect(() => {
    if (!isPaired) {
      // 호흡 효과 (캐릭터와 동일)
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(speechBubbleScaleAnim, {
            toValue: 1.03,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(speechBubbleScaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      );

      // 둥둥 떠다니는 효과 (캐릭터와 동일)
      const translateYAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(speechBubbleTranslateYAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
          Animated.timing(speechBubbleTranslateYAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
        ]),
      );

      // 캐릭터와 동일하게 즉시 시작
      scaleAnimation.start();
      translateYAnimation.start();

      return () => {
        scaleAnimation.stop();
        translateYAnimation.stop();
        speechBubbleScaleAnim.stopAnimation();
        speechBubbleTranslateYAnim.stopAnimation();
      };
    }
  }, [isPaired, speechBubbleScaleAnim, speechBubbleTranslateYAnim]);

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

  const handleSave = async () => {
    const trimmedValue = editValue.trim();

    if (!trimmedValue) {
      // 빈 값이면 원래 이름으로 복원
      setEditValue(characterName);
      setIsEditing(false);
      return;
    }

    // 로컬 상태 업데이트
    setCharacterName(trimmedValue);
    setIsEditing(false);

    // 서버의 닉네임과 다르면 서버에도 업데이트
    if (me?.nickname !== trimmedValue) {
      try {
        await updateProfile.mutateAsync({ nickname: trimmedValue });
      } catch (error) {
        console.error('[HomeScreen] 닉네임 업데이트 실패:', error);
        // 에러가 발생해도 로컬 상태는 유지 (사용자 경험)
      }
    }
  };

  const handleCancel = () => {
    setEditValue(characterName);
    setIsEditing(false);
  };

  // 페어링 모달 열기
  const handleOpenPairingModal = () => {
    setIsPairingModalVisible(true);
  };

  // 페어링 모달 닫기
  const handleClosePairingModal = () => {
    setIsPairingModalVisible(false);
  };

  // 페어링 확인
  const handleConfirmPairing = async () => {
    try {
      // TODO: 실제 기기 ID와 이름을 가져오는 로직 필요
      // 임시로 테스트용 데이터 사용
      await pairDevice.mutateAsync({
        deviceId: 'DEVICE_001',
        deviceName: '한니비 기기',
      });
      setIsPairingModalVisible(false);
      // 성공 시 기기 목록이 자동으로 갱신됨
    } catch (error) {
      console.error('[HomeScreen] 페어링 실패:', error);
      // 에러 처리 (나중에 토스트 메시지 등 추가 가능)
    }
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
          icon={
            isPaired ? (
              <MaterialIcons name="local-fire-department" size={24} color="#FF6B35" />
            ) : (
              <MaterialIcons name="bluetooth-disabled" size={24} color="#ED5B5B" />
            )
          }
          title={isPaired ? '너무 더워서 힘들어요 😩' : '기기가 연결되지 않았어요'}
          description={
            isPaired ? (
              <Text>
                <Text style={styles.temperatureHighlight}>온도</Text> 한 번만 확인해 주세요!
              </Text>
            ) : (
              <Text>한니비 기기를 페어링하면{'\n'}실시간으로 건강 상태를 확인할 수 있어요</Text>
            )
          }
        />

        {/* 중앙 캐릭터 */}
        <View style={styles.characterContainer}>
          {!isPaired ? (
            <Pressable onPress={handleOpenPairingModal} style={styles.characterPressable}>
              <HanibiCharacter2D level="medium" animated={true} size={CHARACTER_SIZE} />
            </Pressable>
          ) : (
            <HanibiCharacter2D level="medium" animated={true} size={CHARACTER_SIZE} />
          )}
          {/* 페어링 안됨 표시 말풍선 - 캐릭터 위에 배치 */}
          {!isPaired && (
            <Pressable onPress={handleOpenPairingModal}>
              <Animated.View
                style={[
                  styles.speechBubbleContainer,
                  {
                    top: -CHARACTER_SIZE / 2 - 140,
                    transform: [
                      { scale: speechBubbleScaleAnim },
                      {
                        translateY: speechBubbleTranslateYAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-6, 6],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.speechBubble}>
                  <View style={styles.speechBubbleBody}>
                    <MaterialIcons name="close" size={20} color={colors.danger} />
                  </View>
                </View>
              </Animated.View>
            </Pressable>
          )}
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

      {/* 페어링 모달 */}
      <ModalPopup
        visible={isPairingModalVisible}
        title="페어링하시겠습니까?"
        description="한니비 기기를 페어링하면 실시간으로 건강 상태를 확인할 수 있어요."
        onConfirm={handleConfirmPairing}
        onCancel={handleClosePairingModal}
      />
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
    position: 'relative',
  },
  characterPressable: {
    alignItems: 'center',
    justifyContent: 'center',
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
  speechBubble: {
    alignItems: 'center',
    position: 'relative',
  },
  speechBubbleBody: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.danger,
    borderRadius: 12,
    borderWidth: 3,
    elevation: 4,
    height: 48,
    justifyContent: 'center',
    shadowColor: colors.danger,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: 48,
  },
  speechBubbleContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 10,
  },
  temperatureHighlight: {
    color: colors.danger,
  },
});
