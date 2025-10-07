import { useKeyboardOffsets } from '@/utils/layout';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps } from 'react-native';

export type KeyboardAwareContainerProps = Omit<ScrollViewProps, 'keyboardShouldPersistTaps'> & {
  children: React.ReactNode;
};

export default function KeyboardAwareContainer({ children, contentContainerStyle, ...rest }: KeyboardAwareContainerProps) {
  const { keyboardVerticalOffset } = useKeyboardOffsets();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={keyboardVerticalOffset} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[{ paddingBottom: 24 }, contentContainerStyle]}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        {...rest}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


