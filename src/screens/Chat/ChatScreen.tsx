/**
 * 채팅 화면
 * 기기와의 채팅 인터페이스를 제공합니다.
 * 상단에 기기 상태 바, 중간에 메시지 리스트, 하단에 빠른 명령 바가 있습니다.
 * 빠른 명령으로만 기기를 제어하고, 기기로부터 받은 알림 메시지를 확인할 수 있습니다.
 * WebSocket을 통해 실시간으로 새 메시지를 수신합니다.
 */

import React, { useCallback, useRef } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ChatMessage, DeviceStatus } from '@/api/chat';
import QuickCommandBar from '@/components/chat/QuickCommandBar';
import { HOME_STACK_ROUTES } from '@/constants/routes';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useDeviceDetail } from '@/hooks/useDeviceDetail';
import { HomeStackParamList } from '@/navigation/types';
import { useChatBadgeStore } from '@/store/chatBadgeStore';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ChatScreenProps = NativeStackScreenProps<HomeStackParamList, typeof HOME_STACK_ROUTES.CHAT>;

/**
 * 기기 연결 상태를 한글 라벨로 변환
 */
function getConnectionStatusLabel(status: string): string {
  switch (status) {
    case 'ONLINE':
      return '온라인';
    case 'OFFLINE':
      return '오프라인';
    default:
      return status;
  }
}

/**
 * 기기 상태를 한글 라벨로 변환
 */
function getDeviceStatusLabel(status: string): string {
  switch (status) {
    case 'IDLE':
      return '대기 중';
    case 'PROCESSING':
      return '처리 중';
    case 'PAUSED':
      return '일시정지';
    case 'ERROR':
      return '오류';
    default:
      return status;
  }
}

/**
 * 메시지 말풍선 컴포넌트
 */
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <View
      style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleOther]}
    >
      <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextOther]}>
        {message.content}
      </Text>
    </View>
  );
}

export default function ChatScreen({ navigation, route }: ChatScreenProps) {
  const { deviceId, deviceName: initialDeviceName } = route.params;
  const flatListRef = useRef<FlatList>(null);

  // 디바이스 상세 정보 조회
  const { data: deviceDetail } = useDeviceDetail(deviceId, {
    refetchInterval: 30000, // 30초마다 자동 갱신
  });

  // 채팅 메시지 조회
  const { data: messages = [], isLoading: isLoadingMessages } = useChatMessages({
    deviceId,
    limit: 50,
  });

  // WebSocket 구독 (실시간 메시지 수신)
  useChatSocket({ deviceId });

  // 채팅 뱃지 스토어
  const { clearBadge, setHasNewChat } = useChatBadgeStore();

  // 화면 포커스 시 뱃지 초기화
  useFocusEffect(
    useCallback(() => {
      clearBadge(deviceId);
    }, [deviceId, clearBadge]),
  );

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigation.goBack();
  };

  // 기기 이름 결정 (우선순위: deviceDetail > initialDeviceName > deviceId)
  const displayDeviceName =
    deviceDetail?.deviceName || deviceDetail?.name || initialDeviceName || deviceId;

  // 기기 상태 정보
  const connectionStatus = deviceDetail?.connectionStatus || null;
  const deviceStatus = (deviceDetail?.deviceStatus as DeviceStatus | undefined) || undefined;

  // 메시지 추가 핸들러 (퀵 커맨드 실행 후 메시지 추가용)
  const handleAppendMessage = useCallback(
    (_message: ChatMessage) => {
      // 메시지 전송 성공 시 뱃지 설정
      setHasNewChat(deviceId, true);
      // 스크롤을 맨 아래로
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    [deviceId, setHasNewChat],
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 (기기 상태 바) */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.deviceName}>{displayDeviceName}</Text>
          <View style={styles.statusRow}>
            {connectionStatus && (
              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    connectionStatus === 'ONLINE'
                      ? styles.statusDotOnline
                      : styles.statusDotOffline,
                  ]}
                />
                <Text style={styles.statusText}>
                  {getConnectionStatusLabel(connectionStatus)}
                </Text>
              </View>
            )}
            {deviceStatus && (
              <Text style={styles.deviceStatusText}>{getDeviceStatusLabel(deviceStatus)}</Text>
            )}
            {!connectionStatus && !deviceStatus && (
              <Text style={styles.loadingText}>로딩 중...</Text>
            )}
          </View>
        </View>

        <View style={styles.headerRight} />
      </View>

      {/* 메시지 리스트 */}
      {isLoadingMessages ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>메시지를 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={[
            styles.messagesContainer,
            messages.length === 0 && styles.messagesContainerEmpty,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                빠른 명령을 사용하여 기기를 제어하세요.{'\n'}기기로부터 받은 알림이 여기에 표시됩니다.
              </Text>
            </View>
          }
          onContentSizeChange={() => {
            // 메시지가 추가될 때마다 맨 아래로 스크롤
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />
      )}

      {/* 빠른 명령 바 */}
      <QuickCommandBar
        deviceId={deviceId}
        deviceStatus={deviceStatus}
        onAppendMessage={handleAppendMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  deviceName: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  deviceStatusText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    width: 44,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.mutedTextLight,
    fontSize: typography.sizes.sm,
    marginTop: spacing.sm,
  },
  messageBubble: {
    borderRadius: 16,
    marginBottom: spacing.sm,
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  messageBubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gray50,
  },
  messageBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  messageText: {
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.4,
  },
  messageTextOther: {
    color: colors.text,
  },
  messageTextUser: {
    color: colors.white,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  messagesContainerEmpty: {
    justifyContent: 'center',
  },
  statusBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  statusDotOffline: {
    backgroundColor: colors.mutedTextLight,
  },
  statusDotOnline: {
    backgroundColor: colors.success,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusText: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
});
