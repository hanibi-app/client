import React from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type NameCardProps = {
  isEditing: boolean;
  characterName: string;
  editValue: string;
  autoFocus?: boolean;
  onEditPress: () => void;
  onChangeText: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editActionWidth: number;
  textInputRef: React.RefObject<TextInput | null>;
};

export const NameCard = ({
  isEditing,
  characterName,
  editValue,
  autoFocus = false,
  onEditPress,
  onChangeText,
  onSave,
  onCancel,
  editActionWidth,
  textInputRef,
}: NameCardProps) => {
  if (!isEditing) {
    return (
      <Pressable onPress={onEditPress} style={styles.hanibiButton}>
        <Text style={styles.hanibiButtonText}>{characterName}</Text>
        <MaterialIcons name="edit" size={16} color={colors.text} style={styles.editIcon} />
      </Pressable>
    );
  }

  return (
    <View style={[styles.hanibiButton, styles.editContainer]}>
      <View style={[styles.editSideSpacer, { width: editActionWidth }]} />
      <TextInput
        ref={textInputRef}
        style={[styles.nameInput, styles.nameInputEditing]}
        value={editValue}
        onChangeText={onChangeText}
        placeholder="이름을 입력하세요"
        placeholderTextColor={colors.mutedText}
        maxLength={10}
        autoFocus={autoFocus}
        returnKeyType="done"
        onSubmitEditing={onSave}
        selectionColor={colors.primary}
      />
      <View style={[styles.editActions, { width: editActionWidth }]}>
        <Pressable onPress={onSave} style={styles.iconButton}>
          <MaterialIcons
            name="check"
            size={20}
            color={editValue.trim() ? colors.primary : colors.mutedText}
          />
        </Pressable>
        <Pressable onPress={onCancel} style={styles.iconButton}>
          <MaterialIcons name="close" size={20} color={colors.mutedText} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 3,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
  },
  editIcon: {
    marginLeft: spacing.xs,
    position: 'absolute',
    right: spacing.lg + 8,
  },
  editSideSpacer: {
    width: 64,
  },
  hanibiButton: {
    alignItems: 'center',
    backgroundColor: colors.gray75,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    position: 'relative',
    width: '100%',
  },
  hanibiButtonText: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    width: '100%',
  },
  iconButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  nameInput: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    minHeight: 24,
    paddingHorizontal: spacing.xs,
    paddingVertical: 0,
    textAlign: 'center',
    width: '100%',
  },
  nameInputEditing: {
    paddingHorizontal: spacing.lg,
  },
});
