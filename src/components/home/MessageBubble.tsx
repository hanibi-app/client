import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type MessageBubbleProps = {
  paddingTop: number;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
};

export const MessageBubble = ({ paddingTop, icon, title, description }: MessageBubbleProps) => {
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
