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

  it('shows helper and error text and applies a11y state', () => {
    const { getByText, rerender } = render(
      <InputField value="" onChangeText={() => {}} label="이메일" helperText="예: user@mail.com" />
    );
    expect(getByText('예: user@mail.com')).toBeTruthy();

    rerender(<InputField value="" onChangeText={() => {}} label="이메일" errorText="형식이 올바르지 않습니다" />);
    expect(getByText('형식이 올바르지 않습니다')).toBeTruthy();
  });
});


