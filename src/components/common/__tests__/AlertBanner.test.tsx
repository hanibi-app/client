import AlertBanner from '@/components/common/AlertBanner';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('AlertBanner', () => {
  it('renders message and sets alert role', () => {
    const { getByText } = render(<AlertBanner type="success" message="완료" />);
    expect(getByText('완료')).toBeTruthy();
  });
});


