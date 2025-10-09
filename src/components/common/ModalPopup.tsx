import React from 'react';

import { Modal, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/common/AppButton';
import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type ModalPopupProps = {
  visible: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
};

export default function ModalPopup({
  visible,
  title,
  description,
  onConfirm,
  onCancel,
  testID = 'modal-popup',
}: ModalPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View
          style={styles.card}
          accessibilityRole="dialog"
          accessibilityLabel={title}
          testID={testID}
        >
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          <View style={styles.row}>
            <AppButton label="취소" variant="secondary" onPress={onCancel} testID="modal-cancel" />
            <AppButton label="확인" variant="primary" onPress={onConfirm} testID="modal-confirm" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: colors.text + '59', // 35% opacity
    flex: 1,
    justifyContent: 'center',
  },
  card: { backgroundColor: colors.background, borderRadius: 12, padding: spacing.lg, width: '86%' },
  description: { fontSize: typography.sizes.md, marginBottom: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-end' },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
});
