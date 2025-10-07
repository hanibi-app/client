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
});


