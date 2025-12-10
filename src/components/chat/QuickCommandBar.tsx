/**
 * 빠른 명령 바 컴포넌트
 * 채팅 화면 하단에 표시되는 빠른 명령 버튼 리스트입니다.
 */

import React, { useMemo } from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { type ChatMessage, type DeviceStatus } from '@/api/chat';
import { type QuickCommand, type QuickCommandAction } from '@/api/chatQuickCommands';
import { useExecuteQuickCommand, useQuickCommands } from '@/hooks/useQuickCommands';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export interface QuickCommandBarProps {
  deviceId: string;
  deviceStatus?: DeviceStatus;
  onAppendMessage: (message: ChatMessage) => void;
}

/**
 * 액션 타입에 따른 아이콘과 색상 매핑
 */
function getActionIcon(action: QuickCommandAction): {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
} {
  switch (action) {
    case 'device:start':
      return { name: 'play-arrow', color: colors.success };
    case 'device:stop':
      return { name: 'stop', color: colors.danger };
    case 'device:pause':
      return { name: 'pause', color: colors.warning };
    case 'device:resume':
      return { name: 'play-arrow', color: colors.success };
    case 'device:set_temperature':
      return { name: 'thermostat', color: colors.info };
    case 'device:update_interval':
      return { name: 'timer', color: colors.primary };
    default:
      return { name: 'settings', color: colors.mutedText };
  }
}

/**
 * 디바이스 상태에 따른 명령 비활성화 여부 판단
 */
function isCommandDisabled(
  command: QuickCommand,
  deviceStatus?: DeviceStatus,
  isExecuting: boolean,
): boolean {
  // 실행 중이면 비활성화
  if (isExecuting) {
    return true;
  }

  // 디바이스 상태가 없으면 비활성화
  if (!deviceStatus) {
    return false; // 상태가 없어도 일단 활성화 (백엔드에서 검증)
  }

  const { action } = command;

  // OFFLINE 또는 ERROR 상태면 모든 명령 비활성화
  if (deviceStatus === 'OFFLINE' || deviceStatus === 'ERROR') {
    return true;
  }

  // PROCESSING 상태
  if (deviceStatus === 'PROCESSING') {
    if (action === 'device:start') {
      return true; // 이미 처리 중이므로 시작 불가
    }
    // pause, stop, resume, set_temperature, update_interval은 가능
    return false;
  }

  // IDLE 상태
  if (deviceStatus === 'IDLE') {
    if (action === 'device:pause' || action === 'device:resume') {
      return true; // 대기 중에는 일시정지/재개 불가
    }
    // start, stop, set_temperature, update_interval은 가능
    return false;
  }

  // PAUSED 상태
  if (deviceStatus === 'PAUSED') {
    if (action === 'device:start') {
      return true; // 일시정지 상태에서는 시작 불가 (resume 사용)
    }
    // resume, stop, set_temperature, update_interval은 가능
    return false;
  }

  // 기타 상태는 일단 활성화 (백엔드에서 검증)
  return false;
}

/**
 * 빠른 명령 칩 컴포넌트
 */
function QuickCommandChip({
  command,
  disabled,
  isLoading,
  onPress,
}: {
  command: QuickCommand;
  disabled: boolean;
  isLoading: boolean;
  onPress: () => void;
}) {
  const { name: iconName, color: iconColor } = getActionIcon(command.action);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[styles.chip, disabled && styles.chipDisabled, isLoading && styles.chipLoading]}
      accessibilityRole="button"
      accessibilityLabel={command.label}
      accessibilityState={{ disabled: disabled || isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <MaterialIcons name={iconName} size={18} color={iconColor} />
      )}
      <Text
        style={[
          styles.chipText,
          disabled && styles.chipTextDisabled,
          isLoading && styles.chipTextDisabled,
        ]}
      >
        {command.label}
      </Text>
    </Pressable>
  );
}

/**
 * 빠른 명령 바 컴포넌트
 */
export default function QuickCommandBar({
  deviceId,
  deviceStatus,
  onAppendMessage,
}: QuickCommandBarProps) {
  const { data: commands, isLoading: _isLoadingCommands, isError } = useQuickCommands();

  const { mutateAsync: executeCommand } = useExecuteQuickCommand(
    {
      deviceId,
      onSuccessAppendMessage: onAppendMessage,
    },
    {
      onError: (error) => {
        console.error('[QuickCommandBar] 빠른 명령 실행 실패:', error);
        // TODO: Toast/Snackbar로 에러 표시
      },
    },
  );

  // 현재 실행 중인 명령 ID 추적 (단일 명령만 실행 가능하다고 가정)
  const [executingCommandId, setExecutingCommandId] = React.useState<string | null>(null);

  const handleCommandPress = async (command: QuickCommand) => {
    if (isCommandDisabled(command, deviceStatus, executingCommandId !== null)) {
      return;
    }

    setExecutingCommandId(command.id);
    try {
      await executeCommand({ commandId: command.id });
    } catch (error) {
      // 에러는 이미 useExecuteQuickCommand의 onError에서 처리됨
      console.error('[QuickCommandBar] 명령 실행 중 에러:', error);
    } finally {
      setExecutingCommandId(null);
    }
  };

  // 명령별 비활성화 여부 메모이제이션
  const commandDisabledMap = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!commands) return map;

    commands.forEach((cmd) => {
      map.set(cmd.id, isCommandDisabled(cmd, deviceStatus, executingCommandId === cmd.id));
    });
    return map;
  }, [commands, deviceStatus, executingCommandId]);

  // 로딩 상태
  // if (isLoadingCommands) {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="small" color={colors.mutedText} />
  //         <Text style={styles.loadingText}>빠른 명령을 불러오는 중...</Text>
  //       </View>
  //     </View>
  //   );
  // }

  // 에러 상태
  if (isError || !commands || commands.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>빠른 명령을 불러오지 못했어요</Text>
      </View>
    );
  }

  // 명령 리스트 표시
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {commands.map((command) => {
          const isDisabled = commandDisabledMap.get(command.id) ?? false;
          const isLoading = executingCommandId === command.id;

          return (
            <QuickCommandChip
              key={command.id}
              command={command}
              disabled={isDisabled}
              isLoading={isLoading}
              onPress={() => handleCommandPress(command)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 20,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipDisabled: {
    backgroundColor: colors.gray100,
    opacity: 0.5,
  },
  chipLoading: {
    opacity: 0.7,
  },
  chipText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  chipTextDisabled: {
    color: colors.mutedTextLight,
  },
  container: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: colors.mutedTextLight,
    fontSize: typography.sizes.sm,
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
