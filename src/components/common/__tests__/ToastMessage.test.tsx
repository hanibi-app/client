import React from 'react';

import { render } from '@testing-library/react-native';

import ToastMessage from '@/components/common/ToastMessage';

describe('ToastMessage', () => {
  it('renders info toast by default', () => {
    const { getByText } = render(<ToastMessage message="정보" />);
    expect(getByText('정보')).toBeTruthy();
  });
});
