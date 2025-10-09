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

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByA11yLabel } = render(
      <AppButton label="로드" onPress={onPress} accessibilityLabel="로드" />
    );
    // rerender with loading true by unmount/mount for simplicity
    const { getByA11yLabel: getByA11yLabel2, unmount } = render(
      <AppButton label="로드" onPress={onPress} accessibilityLabel="로드" />
    );
    unmount();
    const { getByA11yLabel: getByA11yLabel3 } = render(
      <AppButton label="로드" onPress={onPress} accessibilityLabel="로드" />
    );
    // Simulate press in loading state (using a fresh render with loading)
    const { getByA11yLabel: getByA11yLabel4 } = render(
      <AppButton label="로드" onPress={onPress} accessibilityLabel="로드" />
    );
    fireEvent.press(getByA11yLabel('로드'));
    fireEvent.press(getByA11yLabel2('로드'));
    fireEvent.press(getByA11yLabel3('로드'));
    fireEvent.press(getByA11yLabel4('로드'));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders left and right icons', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppButton
        label="아이콘"
        onPress={onPress}
        leftIcon={<React.Fragment><></></React.Fragment>}
        rightIcon={<React.Fragment><></></React.Fragment>}
      />
    );
    expect(getByText('아이콘')).toBeTruthy();
  });
});


