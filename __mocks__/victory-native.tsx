import React from 'react';

import { View } from 'react-native';

interface VictoryProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

export const VictoryChart = ({ children, ...props }: VictoryProps) => (
  <View {...props}>{children}</View>
);
export const VictoryAxis = (props: VictoryProps) => <View {...props} />;
export const VictoryLine = (props: VictoryProps) => <View {...props} />;
