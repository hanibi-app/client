import SwitchRow from '@/components/common/SwitchRow';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('SwitchRow', () => {
  it('toggles switch', () => {
    const onToggle = jest.fn();
    const { getByA11yLabel } = render(
      <SwitchRow label="알림" value={false} onToggle={onToggle} />
    );
    fireEvent(getByA11yLabel('알림'), 'valueChange', true);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('toggles by pressing the row', () => {
    const onToggle = jest.fn();
    const { getByA11yLabel } = render(
      <SwitchRow label="푸시" value={false} onToggle={onToggle} />
    );
    fireEvent.press(getByA11yLabel('푸시'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});


