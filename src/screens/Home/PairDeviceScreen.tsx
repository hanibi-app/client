import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import InputField from '@/components/common/InputField';
import KeyboardAwareContainer from '@/components/common/KeyboardAwareContainer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PrimaryButton from '@/components/common/PrimaryButton';
import ToastMessage from '@/components/common/ToastMessage';
import { HOME_STACK_ROUTES } from '@/constants/routes';
import { usePairDeviceMutation } from '@/hooks/useDevices';
import { HomeStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type PairDeviceScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  typeof HOME_STACK_ROUTES.PAIR_DEVICE
>;

export default function PairDeviceScreen({ navigation }: PairDeviceScreenProps) {
  const insets = useSafeAreaInsets();
  const pairDeviceMutation = usePairDeviceMutation();
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('주방 음식물 처리기');
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handlePairDevice = async () => {
    if (!deviceId.trim()) {
      setToastMessage({
        message: '기기 ID를 입력해주세요.',
        type: 'error',
      });
      return;
    }

    if (!deviceName.trim()) {
      setToastMessage({
        message: '기기 이름을 입력해주세요.',
        type: 'error',
      });
      return;
    }

    try {
      await pairDeviceMutation.mutateAsync({
        deviceId: deviceId.trim(),
        deviceName: deviceName.trim(),
      });

      // 성공 시 토스트 메시지 표시
      setToastMessage({
        message: '기기 페어링이 완료되었습니다.',
        type: 'success',
      });

      // 토스트 메시지 표시 후 화면 이동
      setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate(HOME_STACK_ROUTES.HOME);
        }
      }, 1500);
    } catch (error) {
      // 에러 처리
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? error.message
          : '페어링에 실패했습니다.';
      const statusCode =
        error && typeof error === 'object' && 'status' in error && typeof error.status === 'number'
          ? error.status
          : null;

      const fullErrorMessage = statusCode ? `${errorMessage} (code: ${statusCode})` : errorMessage;

      setToastMessage({
        message: fullErrorMessage,
        type: 'error',
      });
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="기기 페어링" onBack={handleBack} />
      <KeyboardAwareContainer contentPadding="lg">
        <View style={styles.content}>
          {/* 상단 설명 */}
          <Text style={styles.description}>
            한니비 기기를 연결하려면 기기 ID를 입력하거나 스캔하세요.
          </Text>

          {/* 입력 영역 */}
          <View style={styles.inputContainer}>
            <InputField
              label="기기 ID"
              value={deviceId}
              onChangeText={setDeviceId}
              placeholder="기기 ID를 입력하세요"
              keyboardType="default"
              testID="device-id-input"
            />
          </View>

          <View style={styles.inputContainer}>
            <InputField
              label="기기 이름"
              value={deviceName}
              onChangeText={setDeviceName}
              placeholder="주방 음식물 처리기"
              keyboardType="default"
              testID="device-name-input"
            />
          </View>

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              label={pairDeviceMutation.isPending ? '페어링 중...' : '기기 페어링'}
              onPress={handlePairDevice}
              disabled={pairDeviceMutation.isPending}
            />
          </View>

          {/* 로딩 스피너 */}
          {pairDeviceMutation.isPending && (
            <View style={styles.loadingContainer}>
              <LoadingSpinner message="기기를 페어링하는 중..." />
            </View>
          )}
        </View>
      </KeyboardAwareContainer>

      {/* 토스트 메시지 */}
      {toastMessage && (
        <View style={[styles.toastContainer, { bottom: insets.bottom + spacing.lg }]}>
          <ToastMessage
            message={toastMessage.message}
            type={toastMessage.type}
            testID="pair-device-toast"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: spacing.xl,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  description: {
    color: colors.text,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.5,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    marginTop: spacing.lg,
  },
  toastContainer: {
    left: spacing.xl,
    position: 'absolute',
    right: spacing.xl,
  },
});
