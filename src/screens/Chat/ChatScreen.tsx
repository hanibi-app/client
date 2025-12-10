/**
 * 채팅 화면
 * 기기와의 채팅 인터페이스를 제공합니다.
 * 상단에 기기 상태 바, 중간에 메시지 리스트, 하단에 입력창이 있습니다.
 */

import React, { useCallback, useRef, useState } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatMessage, DeviceSummary } from '@/api/chat';
import { HOME_STACK_ROUTES } from '@/constants/routes';
import { useChatSendMessage } from '@/hooks/useChatSendMessage';
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
  const insets = useSafeAreaInsets();

  // 메시지 리스트 상태
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // 현재 기기 정보 (마지막 메시지의 device 필드에서 가져옴)
  const [currentDevice, setCurrentDevice] = useState<DeviceSummary | null>(null);

  // 채팅 뱃지 스토어
  const { clearBadge, setHasNewChat } = useChatBadgeStore();

  // 채팅 메시지 전송 훅
  const { mutate: sendMessage, isPending } = useChatSendMessage(deviceId, {
    onSuccess: (data) => {
      // 성공 시 메시지 리스트에 추가
      setMessages((prev) => [...prev, data]);
      // 기기 정보 업데이트
      setCurrentDevice(data.device);
      // 입력창 초기화
      setInputText('');
      // 메시지 전송 성공 시 뱃지 설정 (다른 기기에서 확인할 수 있도록)
      setHasNewChat(deviceId, true);
      // 스크롤을 맨 아래로
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    onError: (error) => {
      console.error('[ChatScreen] 메시지 전송 실패:', error);
      // TODO: UI에서 Snackbar/Toast로 에러 표시
    },
  });

  // 화면 포커스 시 뱃지 초기화
  useFocusEffect(
    useCallback(() => {
      clearBadge(deviceId);
    }, [deviceId, clearBadge]),
  );

  // 메시지 전송 핸들러
  const handleSend = () => {
    const trimmedText = inputText.trim();
    if (!trimmedText || isPending) {
      return;
    }

    sendMessage({
      content: trimmedText,
      metadata: {
        intent: 'FREE_CHAT', // 기본값, 향후 퀵커맨드 버튼에서는 'STATUS_QUERY' 등으로 변경 가능
      },
    });
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    navigation.goBack();
  };

  // 기기 이름 결정 (초기값 또는 마지막 메시지의 device.deviceName)
  const displayDeviceName = currentDevice?.deviceName || initialDeviceName || deviceId;

  // 기기 상태 정보
  const connectionStatus = currentDevice?.connectionStatus || null;
  const deviceStatus = currentDevice?.deviceStatus || null;

  // TODO: device.rtspUrl를 활용한 라이브 스트리밍/스냅샷 UI는 추후 Camera 모듈과 함께 구현
  // const rtspUrl = currentDevice?.rtspUrl;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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
                기기와 대화를 시작해보세요!{'\n'}메시지를 입력하고 전송 버튼을 눌러주세요.
              </Text>
            </View>
          }
          onContentSizeChange={() => {
            // 메시지가 추가될 때마다 맨 아래로 스크롤
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {/* 하단 입력 영역 */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요..."
            placeholderTextColor={colors.mutedTextLight}
            multiline
            maxLength={500}
            editable={!isPending}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim() || isPending}
            style={[
              styles.sendButton,
              (!inputText.trim() || isPending) && styles.sendButtonDisabled,
            ]}
          >
            <MaterialIcons
              name="send"
              size={24}
              color={!inputText.trim() || isPending ? colors.mutedTextLight : colors.white}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  input: {
    backgroundColor: colors.gray50,
    borderRadius: 20,
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.md,
    maxHeight: 100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loadingText: {
    color: colors.mutedTextLight,
    fontSize: typography.sizes.sm,
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
  sendButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginLeft: spacing.sm,
    width: 40,
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray100,
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
