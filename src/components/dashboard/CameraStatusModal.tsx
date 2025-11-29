import React from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { CameraConnectionStatus } from '@/hooks/useCameraStatus';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type CameraStatusModalProps = {
  visible: boolean;
  status: CameraConnectionStatus;
  isChecking: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onPrimaryAction: () => void;
  onLinkPress: () => void;
};

const MODAL_OVERLAY_BACKGROUND = 'rgba(0, 0, 0, 0.35)';

export const CameraStatusModal = ({
  visible,
  status,
  isChecking,
  errorMessage,
  onClose,
  onPrimaryAction,
  onLinkPress,
}: CameraStatusModalProps) => {
  const title = status.connected ? '연결된 CCTV가 있습니다' : '연결된 CCTV가 없습니다';
  const description = status.connected
    ? `${status.cameraId} 스트리밍을 확인해 주세요.`
    : `${status.cameraId}에 연결된 CCTV 스트리밍이 없습니다.`;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalCard}>
          <Pressable style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseIcon}>×</Text>
          </Pressable>
          <View style={styles.modalBadgeRow}>
            <View style={styles.modalBadgeDot} />
            <Text style={styles.modalBadgeText}>처리 현황을 확인하세요</Text>
          </View>
          <View style={styles.modalIconWrapper}>
            <FontAwesome name="video-camera" size={48} color={colors.mutedText} />
            <View style={styles.modalIconSlash} />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalDescription}>{description}</Text>
          {errorMessage ? (
            <Text style={styles.modalErrorText}>{errorMessage}</Text>
          ) : (
            isChecking && <ActivityIndicator color={colors.primary} style={styles.modalLoader} />
          )}
          <Pressable style={styles.modalPrimaryButton} onPress={onPrimaryAction}>
            <FontAwesome name="refresh" size={16} color={colors.white} />
            <Text style={styles.modalPrimaryButtonText}>리포트보기</Text>
          </Pressable>
          <Pressable onPress={onLinkPress}>
            <Text style={styles.modalLinkText}>CCTV 연결 설정</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalBadgeDot: {
    backgroundColor: colors.danger,
    borderRadius: 4,
    height: 8,
    marginRight: spacing.xs,
    width: 8,
  },
  modalBadgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  modalBadgeText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  modalCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 28,
    marginHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    width: '90%',
  },
  modalCloseButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: colors.gray75,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  modalCloseIcon: {
    color: colors.text,
    fontSize: typography.sizes.lg,
  },
  modalDescription: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  modalErrorText: {
    color: colors.danger,
    fontSize: typography.sizes.xs,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  modalIconSlash: {
    backgroundColor: colors.white,
    height: 2,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    width: 52,
  },
  modalIconWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 64,
    justifyContent: 'center',
    marginTop: spacing.lg,
    width: 64,
  },
  modalLinkText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.lg,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  modalLoader: {
    marginTop: spacing.sm,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: MODAL_OVERLAY_BACKGROUND,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalPrimaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  modalPrimaryButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
