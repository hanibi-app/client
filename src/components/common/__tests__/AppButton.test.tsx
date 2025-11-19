import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import AppButton from '@/components/common/AppButton';

describe('AppButton', () => {
  it('renders label and calls onPress', () => {
    const onPress = jest.fn();
    const { getByLabelText, getByText } = render(<AppButton label="확인" onPress={onPress} />);
    expect(getByText('확인')).toBeTruthy();
    fireEvent.press(getByLabelText('확인'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<AppButton label="비활성" onPress={onPress} disabled />);
    fireEvent.press(getByLabelText('비활성'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('supports accessibilityLabel override', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <AppButton label="레이블" accessibilityLabel="액세스" onPress={onPress} />,
    );
    expect(getByLabelText('액세스')).toBeTruthy();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByLabelText, rerender } = render(
      <AppButton label="로드" onPress={onPress} accessibilityLabel="로드" />,
    );
    fireEvent.press(getByLabelText('로드'));
    expect(onPress).toHaveBeenCalledTimes(1);

    rerender(<AppButton label="로드" onPress={onPress} accessibilityLabel="로드" loading />);
    fireEvent.press(getByLabelText('로드'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders left and right icons', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppButton
        label="아이콘"
        onPress={onPress}
        leftIcon={
          <React.Fragment>
            <></>
          </React.Fragment>
        }
        rightIcon={
          <React.Fragment>
            <></>
          </React.Fragment>
        }
      />,
    );
    expect(getByText('아이콘')).toBeTruthy();
  });
});
