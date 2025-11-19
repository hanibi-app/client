import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import SwitchRow from '@/components/common/SwitchRow';

describe('SwitchRow', () => {
  it('toggles switch', () => {
    const onToggle = jest.fn();
    const { getByLabelText } = render(<SwitchRow label="알림" value={false} onToggle={onToggle} />);
    fireEvent(getByLabelText('알림'), 'valueChange', true);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('toggles by pressing the row', () => {
    const onToggle = jest.fn();
    const { getByLabelText } = render(<SwitchRow label="푸시" value={false} onToggle={onToggle} />);
    fireEvent.press(getByLabelText('푸시'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
