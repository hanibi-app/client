import Divider from '@/components/common/Divider';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('Divider', () => {
  it('renders with default props and is hidden from a11y tree', () => {
    const { getByTestId } = render(<Divider />);
    expect(getByTestId('divider')).toBeTruthy();
  });
});


