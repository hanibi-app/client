import HanibiState from '@/components/common/HanibiState';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('HanibiState', () => {
  it('renders with correct unit for temp', () => {
    const { getByA11yLabel } = render(<HanibiState metric="temp" value={23} progress={0.5} />);
    expect(getByA11yLabel(/현재 온도 23°C/)).toBeTruthy();
  });

  it('clamps progress within 0..1', () => {
    const { getByTestId, rerender } = render(<HanibiState metric="hum" value={40} progress={-1} />);
    expect(getByTestId('hanibi-state')).toBeTruthy();
    rerender(<HanibiState metric="hum" value={40} progress={2} />);
    expect(getByTestId('hanibi-state')).toBeTruthy();
  });

  it('calls onPress when provided', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<HanibiState metric="index" value={5} progress={0.3} onPress={onPress} />);
    fireEvent.press(getByTestId('hanibi-state'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});


