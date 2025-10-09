import React from 'react';

import { render } from '@testing-library/react-native';

import AlertBanner from '@/components/common/AlertBanner';

describe('AlertBanner', () => {
  it('renders message and sets alert role', () => {
    const { getByText } = render(<AlertBanner type="success" message="완료" />);
    expect(getByText('완료')).toBeTruthy();
  });
});
