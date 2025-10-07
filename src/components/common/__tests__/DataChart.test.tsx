import DataChart from '@/components/common/DataChart';
import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('victory-native');

describe('DataChart', () => {
  it('renders empty state when no data', () => {
    const { getByText } = render(<DataChart data={[]} />);
    expect(getByText('데이터 없음')).toBeTruthy();
  });

  it('renders chart when data exists', () => {
    const { getByTestId } = render(
      <DataChart data={[{ x: new Date(), y: 1 }, { x: new Date(), y: 2 }]} />
    );
    expect(getByTestId('data-chart')).toBeTruthy();
  });
});


