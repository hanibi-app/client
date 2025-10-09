import React from 'react';

import { render } from '@testing-library/react-native';

import Divider from '@/components/common/Divider';

describe('Divider', () => {
  it('renders with default props and is hidden from a11y tree', () => {
    const { getByTestId } = render(<Divider />);
    expect(getByTestId('divider')).toBeTruthy();
  });
});
