import AppButton from '@/components/common/AppButton';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('AppButton', () => {
  it('renders label and calls onPress', () => {
    const onPress = jest.fn();
    const { getByA11yLabel, getByText } = render(
      <AppButton label="확인" onPress={onPress} />
    );
    expect(getByText('확인')).toBeTruthy();
    fireEvent.press(getByA11yLabel('확인'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByA11yLabel } = render(
      <AppButton label="비활성" onPress={onPress} disabled />
    );
    fireEvent.press(getByA11yLabel('비활성'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('supports accessibilityLabel override', () => {
    const onPress = jest.fn();
    const { getByA11yLabel } = render(
      <AppButton label="레이블" accessibilityLabel="액세스" onPress={onPress} />
    );
    expect(getByA11yLabel('액세스')).toBeTruthy();
  });
});


