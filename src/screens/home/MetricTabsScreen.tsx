import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet } from 'react-native';

import { useSensorQuery } from '@/hooks/useSensorQuery';
import { HomeStackScreenProps, Metric } from '@/types/navigation';

const TopTab = createMaterialTopTabNavigator();

// 개별 지표 화면 컴포넌트들
function TemperatureScreen() {
  const { data, isLoading, error } = useSensorQuery();
  
  if (isLoading) return <Text style={styles.loading}>로딩 중...</Text>;
  if (error) return <Text style={styles.error}>데이터를 불러올 수 없습니다.</Text>;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>온도</Text>
      <Text style={styles.value}>{data?.temperature}°C</Text>
      <Text style={styles.status}>정상 범위</Text>
    </View>
  );
}

function HumidityScreen() {
  const { data, isLoading, error } = useSensorQuery();
  
  if (isLoading) return <Text style={styles.loading}>로딩 중...</Text>;
  if (error) return <Text style={styles.error}>데이터를 불러올 수 없습니다.</Text>;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>습도</Text>
      <Text style={styles.value}>{data?.humidity}%</Text>
      <Text style={styles.status}>정상 범위</Text>
    </View>
  );
}

function MetalScreen() {
  const { data, isLoading, error } = useSensorQuery();
  
  if (isLoading) return <Text style={styles.loading}>로딩 중...</Text>;
  if (error) return <Text style={styles.error}>데이터를 불러올 수 없습니다.</Text>;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>금속</Text>
      <Text style={styles.value}>{data?.metal} mg/kg</Text>
      <Text style={styles.status}>정상 범위</Text>
    </View>
  );
}

function VocScreen() {
  const { data, isLoading, error } = useSensorQuery();
  
  if (isLoading) return <Text style={styles.loading}>로딩 중...</Text>;
  if (error) return <Text style={styles.error}>데이터를 불러올 수 없습니다.</Text>;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VOC</Text>
      <Text style={styles.value}>{data?.voc} ppb</Text>
      <Text style={styles.status}>정상 범위</Text>
    </View>
  );
}

type MetricTabsScreenProps = HomeStackScreenProps<'MetricTabs'>;

export default function MetricTabsScreen({ route }: MetricTabsScreenProps) {
  const initialRoute = route.params?.initial || 'temperature';
  
  return (
    <TopTab.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarIndicatorStyle: {
          backgroundColor: '#007AFF',
          height: 2,
        },
      }}
    >
      <TopTab.Screen
        name="temperature"
        component={TemperatureScreen}
        options={{
          title: '온도',
        }}
      />
      <TopTab.Screen
        name="humidity"
        component={HumidityScreen}
        options={{
          title: '습도',
        }}
      />
      <TopTab.Screen
        name="metal"
        component={MetalScreen}
        options={{
          title: '금속',
        }}
      />
      <TopTab.Screen
        name="voc"
        component={VocScreen}
        options={{
          title: 'VOC',
        }}
      />
    </TopTab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  error: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  loading: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  status: {
    color: '#666',
    fontSize: 16,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  value: {
    color: '#007AFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
