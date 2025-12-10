import React, { useCallback, useEffect, useRef, useState } from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
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
    useWindowDimensions,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EditHanibiIcon from '@/assets/images/edit-hanibi.svg';
import HanibiCharacter2D from '@/components/common/HanibiCharacter2D';
import ModalPopup from '@/components/common/ModalPopup';
import DeviceControlModal from '@/components/DeviceControlModal';
import DeviceListModal from '@/components/DeviceListModal';
import { DecorativeBackground } from '@/components/home/DecorativeBackground';
import { HomeMessageCard } from '@/components/home/HomeMessageCard';
import { NameCard } from '@/components/home/NameCard';
import { ProgressBar } from '@/components/home/ProgressBar';
import { HOME_STACK_ROUTES } from '@/constants/routes';
import { useDevice, useDevices, usePairDevice } from '@/features/devices/hooks';
import { useMe, useUpdateProfile } from '@/features/user/hooks';
import { useFoodSessions } from '@/hooks/useFoodSessions';
import { HomeStackParamList } from '@/navigation/types';
import { getPairedDevice, setPairedDevice } from '@/services/storage/deviceStorage';
import { useAppState } from '@/state/useAppState';
import { useChatBadgeStore } from '@/store/chatBadgeStore';
import { useLoadingStore } from '@/store/loadingStore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { calculateProcessingProgress } from '@/utils/processingProgress';

const DEFAULT_EDIT_ACTION_WIDTH = 64;

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const characterName = useAppState((s) => s.characterName);
  const setCharacterName = useAppState((s) => s.setCharacterName);
  const { data: me, isLoading } = useMe();
  const { data: devices, refetch: refetchDevices, isLoading: isDevicesLoading } = useDevices();
  const updateProfile = useUpdateProfile();
  const pairDevice = usePairDevice();

  const [localPairedDevice, setLocalPairedDevice] = useState<{
    deviceId: string;
    deviceName: string;
  } | null>(null);

  const isFocused = useIsFocused(); // 화면 포커스 상태 확인

  // 첫 번째 기기 정보 조회 (연결 상태, 마지막 신호 등)
  const firstDeviceId = devices && devices.length > 0 ? devices[0].deviceId : null;

  // 페어링된 기기의 실시간 상태 조회
  // 로컬에 페어링 정보가 있고, 서버에도 등록되어 있는 기기만 조회
  const pairedDeviceId = localPairedDevice?.deviceId;
  const isPairedDeviceRegistered = pairedDeviceId
    ? devices?.some((d) => d.deviceId === pairedDeviceId)
    : false;

  // 서버에 등록된 기기만 조회
  // 우선순위: 1) 로컬 페어링 기기 (서버에 등록된 경우만), 2) 서버의 첫 번째 기기
  const targetDeviceId =
    (pairedDeviceId && isPairedDeviceRegistered ? pairedDeviceId : null) || firstDeviceId || '';
  
  // 기기 상태 조회 - 진행률 바를 위해 빠르게 갱신
  // 서버에 등록된 기기가 있을 때만 조회
  const { data: deviceDetail } = useDevice(targetDeviceId, {
    refetchInterval: isFocused && targetDeviceId ? 15000 : false, // 포커스되어 있고 기기가 있을 때만 15초마다 폴링
    enabled: !!targetDeviceId, // deviceId가 있을 때만 조회
  });

  // pairedDeviceDetail은 deviceDetail과 동일 (중복 조회 방지)
  const pairedDeviceDetail = deviceDetail;

  const { startLoading, stopLoading } = useLoadingStore();
  const { getHasNewChat } = useChatBadgeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(characterName);
  const [isPairingModalVisible, setIsPairingModalVisible] = useState(false);
  const [isDeviceListModalVisible, setIsDeviceListModalVisible] = useState(false);
  const [isDeviceControlModalVisible, setIsDeviceControlModalVisible] = useState(false);
  const [selectedDeviceForModal, setSelectedDeviceForModal] = useState<{
    deviceId: string;
    deviceName: string;
    connectionStatus?: string;
    lastHeartbeat?: string | null;
  } | null>(null);
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

  // 로컬 페어링 정보 로드 (앱 시작 시 및 화면 포커스 시)
  const loadLocalDevice = async () => {
    const localDevice = await getPairedDevice();
    setLocalPairedDevice(localDevice);
    return localDevice;
  };

  useEffect(() => {
    loadLocalDevice();
  }, []);

  // 페어링 모달이 닫힐 때 로컬 페어링 정보 다시 로드
  useEffect(() => {
    if (!isPairingModalVisible) {
      loadLocalDevice();
    }
  }, [isPairingModalVisible]);

  // 앱 시작 시 자동 탐색 제거 (React Query가 자동으로 데이터를 가져오므로 불필요)
  // 사용자가 명시적으로 새로고침하거나 화면 포커스 시에만 refetch되도록 함

  // 서버에서 기기 목록이 로드되면 로컬 페어링 정보와 동기화
  useEffect(() => {
    if (!isDevicesLoading && devices && localPairedDevice) {
      // 로컬에 페어링 정보가 있지만 서버에 해당 기기가 없으면 동기화 시도는 하지 않음
      // (오프라인 모드 지원을 위해 로컬 정보를 유지)
      const serverHasDevice = devices.some((d) => d.deviceId === localPairedDevice.deviceId);
      if (!serverHasDevice) {
        console.log(
          '[HomeScreen] 로컬 페어링 정보는 있지만 서버에 기기가 없음. 로컬 정보를 유지합니다.',
        );
      }
    }
  }, [devices, isDevicesLoading, localPairedDevice]);

  // 페어링 상태 확인: 로컬 스토리지를 우선으로 확인
  // 로컬에 페어링 정보가 있으면 페어링된 것으로 간주 (오프라인 모드 지원)
  // 서버에서 기기 목록을 불러오는 동안에도 로컬 정보를 사용하여 페어링 상태 유지
  const isPaired = localPairedDevice !== null;

  // 채팅 뱃지 상태 확인
  const currentDeviceIdForChat = localPairedDevice?.deviceId || firstDeviceId || '';
  const hasNewChat = currentDeviceIdForChat ? getHasNewChat(currentDeviceIdForChat) : false;

  // 채팅 화면으로 이동 핸들러
  const handleOpenChat = () => {
    if (!currentDeviceIdForChat) {
      // 기기가 없으면 페어링 모달 열기
      handleOpenPairingModal();
      return;
    }
    navigation.navigate(HOME_STACK_ROUTES.CHAT, {
      deviceId: currentDeviceIdForChat,
      deviceName: localPairedDevice?.deviceName || deviceDetail?.deviceName || undefined,
    });
  };

  // 페어링된 기기의 연결 상태 확인
  // 우선순위: 1) pairedDeviceDetail (실시간 조회), 2) devices 배열, 3) null
  const pairedDeviceStatus = localPairedDevice
    ? pairedDeviceDetail?.connectionStatus ||
      devices?.find((d) => d.deviceId === localPairedDevice.deviceId)?.connectionStatus ||
      null
    : null;
  const isPairedDeviceOnline = pairedDeviceStatus === 'ONLINE';

  // 음식 투입 세션 조회 (최근 1개만) - 진행률 바를 위해 빠르게 갱신
  const targetDeviceIdForSession = localPairedDevice?.deviceId || firstDeviceId || '';
  const { data: sessions } = useFoodSessions(targetDeviceIdForSession, {
    refetchInterval: isFocused ? 10000 : false, // 포커스되어 있을 때만 10초마다 폴링 (진행률 바 빠른 업데이트)
    enabled: !!targetDeviceIdForSession,
  });
  const latestSession = sessions && sessions.length > 0 ? sessions[0] : null;

  // 화면 포커스 시 기기 상태 갱신 (최적화: staleTime 체크 후 필요시에만 refetch)
  useFocusEffect(
    useCallback(() => {
      // React Query가 자동으로 staleTime을 체크하여 필요시에만 refetch하도록 함
      // 명시적 refetch는 제거하여 불필요한 요청 방지
      // 데이터가 stale하지 않으면 자동으로 캐시된 데이터를 사용
    }, []),
  );

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

  // 진행률 계산 - 실시간 업데이트를 위한 상태
  const isProcessing = pairedDeviceDetail?.deviceStatus === 'PROCESSING';
  const isInputInProgress = latestSession?.status === 'in_progress';

  // 진행률을 실시간으로 업데이트하기 위한 상태
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentRemainingPercent, setCurrentRemainingPercent] = useState(0);

  // 진행률 계산 및 실시간 업데이트
  useEffect(() => {
    if (isProcessing) {
      const calculateProgress = () => {
        // 세션이 있으면 세션 사용, 없으면 deviceDetail의 updatedAt을 fallback으로 사용
        const fallbackStartTime = pairedDeviceDetail?.updatedAt;
        const progressData = calculateProcessingProgress(latestSession, fallbackStartTime);
        if (progressData) {
          setCurrentProgress(progressData.progress);
          setCurrentRemainingPercent(progressData.remainingPercent);
        } else {
          setCurrentProgress(0);
          setCurrentRemainingPercent(0);
        }
      };

      // 즉시 계산
      calculateProgress();

      // 1초마다 실시간 업데이트 (진행률 바 빠른 업데이트)
      const interval = setInterval(calculateProgress, 1000);

      return () => clearInterval(interval);
    } else {
      setCurrentProgress(0);
      setCurrentRemainingPercent(0);
    }
  }, [isProcessing, latestSession, pairedDeviceDetail?.updatedAt]);

  const progress = currentProgress;
  const remainingPercent = currentRemainingPercent;

  // 진행률 설명 텍스트
  // 우선순위: 1) 투입 중, 2) 처리 중 (진행률 표시 또는 처리 중), 3) 대기 중
  const progressDescription = isInputInProgress
    ? '투입 중'
    : isProcessing
      ? progress > 0
        ? `다 먹기까지 ${Math.round(remainingPercent)}% 남음`
        : '처리 중' // 진행률 계산이 안되도 처리 중 표시
      : '대기 중';

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

  // 기기 목록 모달 열기 (캐릭터 클릭 시)
  const handleOpenDeviceListModal = async () => {
    // 기기 목록을 먼저 최신화 (백그라운드에서)
    try {
      await refetchDevices();
    } catch (error) {
      console.error('[HomeScreen] 기기 목록 불러오기 실패:', error);
      // 에러가 발생해도 기기 목록 모달은 열기 (로컬 정보 사용)
    }
    setIsDeviceListModalVisible(true);
  };

  // 기기 목록 모달 닫기
  const handleCloseDeviceListModal = () => {
    setIsDeviceListModalVisible(false);
  };

  // 기기 목록에서 기기 선택 시 기기 제어 모달 열기
  const handleDeviceSelect = (device: {
    deviceId: string;
    deviceName: string;
    connectionStatus?: string;
    lastHeartbeat?: string | null;
  }) => {
    setSelectedDeviceForModal(device);
    setIsDeviceListModalVisible(false);
    setIsDeviceControlModalVisible(true);
  };

  // 로컬 페어링 정보로 기기 제어 모달 열기 (기기 목록 없이도 가능)
  const _handleOpenDeviceControlFromLocal = () => {
    if (localPairedDevice) {
      setSelectedDeviceForModal({
        deviceId: localPairedDevice.deviceId,
        deviceName: localPairedDevice.deviceName,
        connectionStatus: devices?.find((d) => d.deviceId === localPairedDevice.deviceId)
          ?.connectionStatus,
        lastHeartbeat: devices?.find((d) => d.deviceId === localPairedDevice.deviceId)
          ?.lastHeartbeat,
      });
      setIsDeviceControlModalVisible(true);
    }
  };

  // 기기 제어 모달 닫기
  const handleCloseDeviceControlModal = () => {
    setIsDeviceControlModalVisible(false);
    setSelectedDeviceForModal(null);
  };

  // 랭킹 화면으로 이동
  const handleViewRanking = () => {
    navigation.navigate('Ranking');
  };

  // 페어링 확인
  const handleConfirmPairing = async () => {
    try {
      // TODO: 실제 기기 ID와 이름을 가져오는 로직 필요
      // 임시로 테스트용 데이터 사용
      const device = await pairDevice.mutateAsync({
        deviceId: 'DEVICE_001',
        deviceName: '한니비 기기',
      });

      // 페어링 성공 시 로컬 저장소에 저장
      await setPairedDevice({
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        apiSynced: true,
        syncedAt: new Date().toISOString(),
      });

      // 로컬 상태 업데이트
      setLocalPairedDevice({
        deviceId: device.deviceId,
        deviceName: device.deviceName,
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
              isPairedDeviceOnline ? (
                <MaterialIcons name="local-fire-department" size={24} color="#FF6B35" />
              ) : (
                <MaterialIcons name="bluetooth-disabled" size={24} color="#ED5B5B" />
              )
            ) : (
              <MaterialIcons name="bluetooth-disabled" size={24} color="#ED5B5B" />
            )
          }
          title={
            isPaired
              ? isPairedDeviceRegistered
                ? isPairedDeviceOnline
                  ? '너무 더워서 힘들어요 😩'
                  : '네트워크 문제가 발생했어요'
                : '기기를 서버에 등록해주세요'
              : '기기를 페어링해주세요'
          }
          description={
            isPaired ? (
              isPairedDeviceRegistered ? (
                isPairedDeviceOnline ? (
                  <Text>
                    <Text style={styles.temperatureHighlight}>온도</Text> 한 번만 확인해 주세요!
                  </Text>
                ) : (
                  <Text>전원과 네트워크를 확인한 뒤{'\n'}다시 시도해 주세요</Text>
                )
              ) : (
                <Text>설정에서 서버 동기화를{'\n'}진행해주세요</Text>
              )
            ) : (
              <Text>기기를 페어링하려면{'\n'}네트워크 연결이 필요해요</Text>
            )
          }
        />

        {/* 중앙 캐릭터 */}
        <View style={styles.characterContainer}>
          <Pressable onPress={handleOpenDeviceListModal} style={styles.characterPressable}>
            <HanibiCharacter2D level="medium" animated={true} size={CHARACTER_SIZE} />
          </Pressable>
          {/* 채팅 아이콘 버튼 - 캐릭터 우측 상단 */}
          {isPaired && (
            <Pressable
              onPress={handleOpenChat}
              style={[
                styles.chatButton,
                {
                  top: CHARACTER_SIZE / 2 - 40,
                  right: SCREEN_WIDTH / 2 - CHARACTER_SIZE / 2 - 20,
                },
              ]}
            >
              <MaterialIcons name="chat-bubble" size={28} color={colors.primary} />
              {/* 새 메시지 뱃지 */}
              {hasNewChat && <View style={styles.chatBadge} />}
            </Pressable>
          )}
          {/* 상태 태그들 - 캐릭터 위에 배치 */}
          {isPaired && latestSession && (
            <View
              style={[
                styles.statusTagsContainer,
                {
                  top: -CHARACTER_SIZE / 2 - 80,
                },
              ]}
            >
              <View
                style={[
                  styles.statusTag,
                  latestSession.status === 'in_progress'
                    ? styles.sessionTagInProgress
                    : styles.sessionTagCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.statusTagText,
                    {
                      color:
                        latestSession.status === 'in_progress' ? colors.warning : colors.success,
                    },
                  ]}
                >
                  {latestSession.status === 'in_progress' ? '투입 중' : '투입 완료'}
                </Text>
              </View>
              {pairedDeviceDetail?.deviceStatus && (
                <View
                  style={[
                    styles.statusTag,
                    {
                      backgroundColor:
                        pairedDeviceDetail.deviceStatus === 'PROCESSING'
                          ? colors.primary + '20'
                          : colors.gray100,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusTagText,
                      {
                        color:
                          pairedDeviceDetail.deviceStatus === 'PROCESSING'
                            ? colors.primary
                            : colors.text,
                      },
                    ]}
                  >
                    {pairedDeviceDetail.deviceStatus === 'PROCESSING'
                      ? '처리 중'
                      : pairedDeviceDetail.deviceStatus === 'IDLE'
                        ? '대기 중'
                        : pairedDeviceDetail.deviceStatus}
                  </Text>
                </View>
              )}
            </View>
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
            description={progressDescription}
            textColor={PROGRESS_TEXT_COLOR}
            isWaiting={!isProcessing && !isInputInProgress}
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

      {/* 기기 목록 모달 */}
      <DeviceListModal
        visible={isDeviceListModalVisible}
        onClose={handleCloseDeviceListModal}
        onDeviceSelect={handleDeviceSelect}
      />

      {/* 기기 제어 모달 */}
      {/* 로컬 페어링 정보가 있으면 서버 기기 목록과 관계없이 모달 표시 가능 */}
      {isDeviceControlModalVisible && (selectedDeviceForModal || localPairedDevice) && (
        <DeviceControlModal
          visible={isDeviceControlModalVisible}
          deviceId={selectedDeviceForModal?.deviceId || localPairedDevice?.deviceId || null}
          deviceName={selectedDeviceForModal?.deviceName || localPairedDevice?.deviceName}
          connectionStatus={
            deviceDetail?.connectionStatus ||
            selectedDeviceForModal?.connectionStatus ||
            devices?.find(
              (d) =>
                d.deviceId === (selectedDeviceForModal?.deviceId || localPairedDevice?.deviceId),
            )?.connectionStatus ||
            'OFFLINE'
          }
          lastHeartbeat={
            deviceDetail?.lastHeartbeat ||
            selectedDeviceForModal?.lastHeartbeat ||
            devices?.find(
              (d) =>
                d.deviceId === (selectedDeviceForModal?.deviceId || localPairedDevice?.deviceId),
            )?.lastHeartbeat ||
            null
          }
          onClose={handleCloseDeviceControlModal}
        />
      )}

      {/* 랭킹 버튼 (우측 하단) */}
      <View style={[styles.rankingButtonContainer, { bottom: insets.bottom }]}>
        <Pressable onPress={handleViewRanking} style={styles.rankingButton}>
          <FontAwesome name="trophy" size={24} color={colors.white} />
        </Pressable>
      </View>
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
  chatBadge: {
    backgroundColor: colors.danger,
    borderRadius: 6,
    height: 12,
    position: 'absolute',
    right: 4,
    top: 4,
    width: 12,
    // TODO: 추후 unreadCount를 받으면 숫자 뱃지로 확장 가능
  },
  chatButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    elevation: 4,
    height: 48,
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 48,
    zIndex: 10,
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
  rankingButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 28,
    elevation: 6,
    height: 56,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 56,
  },
  rankingButtonContainer: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 10,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  sessionTagCompleted: {
    backgroundColor: colors.success + '20',
  },
  sessionTagInProgress: {
    backgroundColor: colors.warning + '20',
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
  statusTag: {
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusTagText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  statusTagsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  temperatureHighlight: {
    color: colors.danger,
  },
});
