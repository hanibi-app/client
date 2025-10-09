import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ReportIndexScreen from '@/screens/report/ReportIndexScreen';
import ReportMetricScreen from '@/screens/report/ReportMetricScreen';
import { ReportStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<ReportStackParamList>();

export default function ReportNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="ReportIndex"
        component={ReportIndexScreen}
        options={{
          title: '리포트',
          headerShown: false, // 리포트 메인 화면은 헤더 숨김
        }}
      />
      <Stack.Screen
        name="ReportMetric"
        component={ReportMetricScreen}
        options={({ route }) => ({
          title: getMetricTitle(route.params.metric),
          headerBackTitle: '리포트',
        })}
      />
    </Stack.Navigator>
  );
}

// 지표별 제목 반환 함수
function getMetricTitle(metric: string): string {
  const titles: Record<string, string> = {
    temperature: '온도 리포트',
    humidity: '습도 리포트',
    metal: '금속 리포트',
    voc: 'VOC 리포트',
  };
  return titles[metric] || '리포트';
}
