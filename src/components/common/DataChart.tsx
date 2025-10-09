import React from 'react';

import { Text, View } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';

export type DataPoint = { x: Date | number; y: number };

export type DataChartProps = {
  data: DataPoint[];
  testID?: string;
};

function formatTick(value: Date | number): string {
  const d = value instanceof Date ? value : new Date(value);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  return `${mm}/${dd}`;
}

export default function DataChart({ data, testID = 'data-chart' }: DataChartProps) {
  if (!data || data.length === 0) {
    return (
      <View testID={testID} accessibilityLabel="데이터 없음">
        <Text>데이터 없음</Text>
      </View>
    );
  }

  return (
    <VictoryChart testID={testID}>
      <VictoryAxis tickFormat={(t) => formatTick(t as Date | number)} />
      <VictoryAxis dependentAxis />
      <VictoryLine data={data} interpolation="monotoneX" />
    </VictoryChart>
  );
}
