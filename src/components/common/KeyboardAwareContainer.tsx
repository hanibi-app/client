import { getContentPadding, useKeyboardOffsets } from '@/utils/layout';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps } from 'react-native';

export type KeyboardAwareContainerProps = Omit<ScrollViewProps, 'keyboardShouldPersistTaps'> & {
  children: React.ReactNode;
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  extraKeyboardOffset?: number;
};

export default function KeyboardAwareContainer({ children, contentContainerStyle, contentPadding = 'md', extraKeyboardOffset = 0, ...rest }: KeyboardAwareContainerProps) {
  const { keyboardVerticalOffset } = useKeyboardOffsets({ includeBottomInset: true, extraOffset: extraKeyboardOffset });
  const paddingBottom = getContentPadding(contentPadding);
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={keyboardVerticalOffset} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[{ paddingBottom }, contentContainerStyle]}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        {...rest}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


