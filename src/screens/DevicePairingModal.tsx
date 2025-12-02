import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '@/components/common/AppHeader';
import InputField from '@/components/common/InputField';
import KeyboardAwareContainer from '@/components/common/KeyboardAwareContainer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OutlinedButton from '@/components/common/OutlinedButton';
import PrimaryButton from '@/components/common/PrimaryButton';
import ToastMessage from '@/components/common/ToastMessage';
import { ROOT_ROUTES } from '@/constants/routes';
import { usePairDeviceMutation } from '@/hooks/useDevices';
import { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type DevicePairingModalProps = NativeStackScreenProps<
  RootStackParamList,
  typeof ROOT_ROUTES.DEVICE_PAIRING_MODAL
>;

export default function DevicePairingModal({ navigation }: DevicePairingModalProps) {
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

      setToastMessage({
        message: '기기 페어링이 완료되었습니다.',
        type: 'success',
      });

      setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }, 1500);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : '페어링에 실패했습니다. 기기 ID를 확인해주세요.';
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

  const handleCancel = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="기기 페어링" onBack={handleCancel} />
      <KeyboardAwareContainer contentPadding="lg">
        <View style={styles.content}>
          <Text style={styles.description}>
            한니비 기기를 연결하려면 기기 ID를 입력하거나 스캔하세요.
          </Text>

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

          <View style={styles.buttonContainer}>
            <PrimaryButton
              label={pairDeviceMutation.isPending ? '페어링 중...' : '페어링 시작'}
              onPress={handlePairDevice}
              disabled={pairDeviceMutation.isPending}
            />
          </View>

          <View style={styles.cancelButtonContainer}>
            <OutlinedButton
              label="취소"
              onPress={handleCancel}
              disabled={pairDeviceMutation.isPending}
            />
          </View>

          {pairDeviceMutation.isPending && (
            <View style={styles.loadingContainer}>
              <LoadingSpinner message="기기를 페어링하는 중..." />
            </View>
          )}
        </View>
      </KeyboardAwareContainer>

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
  cancelButtonContainer: {
    marginTop: spacing.md,
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
