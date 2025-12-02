import React, { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { pairDevice, unpairDevice } from '@/api/devices';
import AppHeader from '@/components/common/AppHeader';
import InputField from '@/components/common/InputField';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OutlinedButton from '@/components/common/OutlinedButton';
import PrimaryButton from '@/components/common/PrimaryButton';
import ToastMessage from '@/components/common/ToastMessage';
import { clearPairedDevice, setPairedDevice } from '@/services/storage/deviceStorage';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.5)';

type DevicePairingModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function DevicePairingModal({ visible, onClose }: DevicePairingModalProps) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [deviceId, setDeviceId] = useState('HANIBI-ESP32-001');
  const [deviceName, setDeviceName] = useState('주방 음식물 처리기');
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isUnpairing, setIsUnpairing] = useState(false);

  const unpairMutation = useMutation({
    mutationFn: unpairDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });

  const pairMutation = useMutation({
    mutationFn: pairDevice,
    onSuccess: async (device) => {
      await setPairedDevice({
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        apiSynced: true,
        syncedAt: new Date().toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setToastMessage({
        message: '기기 페어링이 완료되었습니다.',
        type: 'success',
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    },
    onError: async (error) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 409) {
          Alert.alert(
            '이미 페어링된 기기',
            '이 기기는 이미 다른 계정과 페어링되어 있습니다.\n기존 페어링을 해제하고 다시 페어링하시겠어요?',
            [
              {
                text: '취소',
                style: 'cancel',
                onPress: () => {
                  setToastMessage({
                    message: '페어링이 취소되었습니다.',
                    type: 'error',
                  });
                },
              },
              {
                text: '해제 후 페어링',
                onPress: async () => {
                  await handleUnpairAndRepair();
                },
              },
            ],
          );
          return;
        }
        if (status === 429) {
          const trimmedDeviceId = deviceId.trim();
          const trimmedDeviceName = deviceName.trim();
          try {
            await setPairedDevice({
              deviceId: trimmedDeviceId,
              deviceName: trimmedDeviceName,
              apiSynced: false,
              syncedAt: new Date().toISOString(),
            });
            queryClient.invalidateQueries({ queryKey: ['devices'] });
            setToastMessage({
              message: '기기 페어링이 완료되었습니다. (로컬 저장 - API 동기화 필요)',
              type: 'success',
            });
            setTimeout(() => {
              onClose();
            }, 1500);
            return;
          } catch (storageError) {
            console.warn('[DevicePairingModal] 로컬 저장 실패:', storageError);
          }
        }
      }

      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : '페어링에 실패했습니다. 기기 ID를 확인해주세요.';

      const statusCode = error instanceof AxiosError ? error.response?.status : null;
      const fullErrorMessage = statusCode ? `${errorMessage} (code: ${statusCode})` : errorMessage;

      setToastMessage({
        message: fullErrorMessage,
        type: 'error',
      });
    },
  });

  const handleUnpairAndRepair = async () => {
    const trimmedDeviceId = deviceId.trim();
    const trimmedDeviceName = deviceName.trim();

    setIsUnpairing(true);
    setToastMessage({
      message: '기존 페어링을 해제하는 중...',
      type: 'success',
    });

    try {
      await unpairMutation.mutateAsync({ deviceId: trimmedDeviceId });
      await clearPairedDevice();

      setToastMessage({
        message: '기존 페어링 해제 완료. 다시 페어링하는 중...',
        type: 'success',
      });

      await pairMutation.mutateAsync({
        deviceId: trimmedDeviceId,
        deviceName: trimmedDeviceName,
      });
    } catch (error) {
      setIsUnpairing(false);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 429) {
          console.warn('[DevicePairingModal] 언페어/페어링 429 에러 - Rate limit');
          setToastMessage({
            message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
            type: 'error',
          });
        } else {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            '페어링 해제 및 재페어링에 실패했습니다.';
          setToastMessage({
            message: errorMessage,
            type: 'error',
          });
        }
      } else {
        setToastMessage({
          message: '페어링 해제 및 재페어링에 실패했습니다.',
          type: 'error',
        });
      }
    } finally {
      setIsUnpairing(false);
    }
  };

  const handleSubmit = () => {
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

    pairMutation.mutate({
      deviceId: deviceId.trim(),
      deviceName: deviceName.trim(),
    });
  };

  const handleClose = () => {
    setToastMessage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={[styles.modalContent, { paddingBottom: insets.bottom }]}>
          <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
            <AppHeader title="기기 페어링" onBack={handleClose} />
          </View>

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
                label={
                  isUnpairing
                    ? '페어링 해제 중...'
                    : pairMutation.isPending
                      ? '페어링 중...'
                      : '페어링 시작'
                }
                onPress={handleSubmit}
                disabled={pairMutation.isPending || unpairMutation.isPending || isUnpairing}
              />
            </View>

            <View style={styles.cancelButtonContainer}>
              <OutlinedButton
                label="취소"
                onPress={handleClose}
                disabled={pairMutation.isPending || unpairMutation.isPending || isUnpairing}
              />
            </View>

            {(pairMutation.isPending || unpairMutation.isPending || isUnpairing) && (
              <View style={styles.loadingContainer}>
                <LoadingSpinner
                  message={
                    isUnpairing
                      ? '기존 페어링을 해제하고 다시 페어링하는 중...'
                      : '기기를 페어링하는 중...'
                  }
                />
              </View>
            )}
          </View>

          {toastMessage && (
            <View style={styles.toastContainer}>
              <ToastMessage
                message={toastMessage.message}
                type={toastMessage.type}
                testID="pair-device-toast"
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKDROP_COLOR,
  },
  buttonContainer: {
    marginTop: spacing.xl,
  },
  cancelButtonContainer: {
    marginTop: spacing.md,
  },
  content: {
    flex: 1,
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
  headerContainer: {
    backgroundColor: colors.background,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    marginTop: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    maxHeight: '90%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  toastContainer: {
    bottom: spacing.lg,
    left: spacing.xl,
    position: 'absolute',
    right: spacing.xl,
  },
});
