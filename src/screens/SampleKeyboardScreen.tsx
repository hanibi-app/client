import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import InputField from '@/components/common/InputField';
import KeyboardAwareContainer from '@/components/common/KeyboardAwareContainer';

export default function SampleKeyboardScreen() {
  const [value, setValue] = React.useState('');
  return (
    <KeyboardAwareContainer contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text>샘플 입력</Text>
        <InputField value={value} onChangeText={setValue} placeholder="텍스트 입력" />
      </View>
    </KeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    gap: 12,
  },
});
