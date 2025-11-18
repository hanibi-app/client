import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/Colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type MessageBubbleProps = {
  sender: string;
  time: string;
  message: string;
  align?: 'left' | 'right';
};

export default function MessageBubble({
  sender,
  time,
  message,
  align = 'left',
}: MessageBubbleProps) {
  return (
    <View style={[styles.container, align === 'right' && styles.rightAlign]}>
      <View style={styles.icon} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.sender}>{sender}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray75,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: spacing.md,
    padding: spacing.md,
    width: '100%',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  icon: {
    backgroundColor: colors.gray100,
    borderRadius: 4,
    height: 40,
    width: 40,
  },
  message: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  rightAlign: {
    alignSelf: 'flex-end',
  },
  sender: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  time: {
    color: colors.mutedText,
    fontSize: typography.sizes.xs,
    marginLeft: 'auto',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
