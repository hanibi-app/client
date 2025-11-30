import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/**
 * 홈 화면 메시지 카드 컴포넌트
 *
 * 홈 화면 상단에 표시되는 메시지 카드로, 아이콘, 제목, 설명을 포함합니다.
 */
type HomeMessageCardProps = {
  paddingTop: number;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
};

export const HomeMessageCard = ({ paddingTop, icon, title, description }: HomeMessageCardProps) => {
  return (
    <View style={[styles.topSection, { paddingTop }]}>
      <View style={styles.messageBubble}>
        <View style={styles.messageIcon}>{icon}</View>
        <View style={styles.messageContent}>
          <Text style={styles.messageText1}>{title}</Text>
          <Text style={styles.messageText2}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    padding: spacing.md,
    width: '100%',
    zIndex: 1,
  },
  messageContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  messageIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText1: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  messageText2: {
    color: colors.mutedText,
    fontSize: typography.sizes.sm,
  },
  topSection: {
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
});

