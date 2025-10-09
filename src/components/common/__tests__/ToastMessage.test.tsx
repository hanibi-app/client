import ToastMessage from '@/components/common/ToastMessage';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('ToastMessage', () => {
  it('renders info toast by default', () => {
    const { getByText } = render(<ToastMessage message="정보" />);
    expect(getByText('정보')).toBeTruthy();
  });
});


