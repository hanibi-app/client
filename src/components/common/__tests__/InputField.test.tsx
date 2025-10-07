import InputField from '@/components/common/InputField';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('InputField', () => {
  it('renders placeholder and accepts input', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputField value="" onChangeText={onChangeText} placeholder="입력" />
    );
    const input = getByPlaceholderText('입력');
    fireEvent.changeText(input, 'abc');
    expect(onChangeText).toHaveBeenCalledWith('abc');
  });
});


