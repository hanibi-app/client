import InputField from '@/components/common/InputField';
import KeyboardAwareContainer from '@/components/common/KeyboardAwareContainer';
import React from 'react';
import { Text, View } from 'react-native';

export default function SampleKeyboardScreen() {
  const [value, setValue] = React.useState('');
  return (
    <KeyboardAwareContainer contentContainerStyle={{ padding: 16 }}>
      <View style={{ gap: 12 }}>
        <Text>샘플 입력</Text>
        <InputField value={value} onChangeText={setValue} placeholder="텍스트 입력" />
      </View>
    </KeyboardAwareContainer>
  );
}


