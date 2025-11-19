import React from 'react';

import { Text, View } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';

export type DataPoint = { x: Date | number | string; y: number };

export type DataChartProps = {
  data: DataPoint[];
  testID?: string;
};

function toDate(value: Date | number | string): Date {
  if (value instanceof Date) return value;
  return new Date(value);
}

function formatTick(value: Date | number | string): string {
  const d = toDate(value);
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
    <View testID={testID} accessible={false}>
      <VictoryChart>
        <VictoryAxis tickFormat={(t: Date | number | string) => formatTick(t)} />
        <VictoryAxis dependentAxis />
        <VictoryLine data={data} interpolation="monotoneX" />
      </VictoryChart>
    </View>
  );
}
