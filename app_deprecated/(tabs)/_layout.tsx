import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			initialRouteName="home"
			screenOptions={{
				tabBarActiveTintColor: '#4CAF50',
				tabBarInactiveTintColor: '#999999',
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: {
					backgroundColor: '#FFFFFF',
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					height: 80,
					paddingBottom: 20,
					paddingTop: 10,
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: -2,
					},
					shadowOpacity: 0.1,
					shadowRadius: 4,
					elevation: 5,
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
					marginTop: 4,
				},
			}}>
			<Tabs.Screen
				name="home"
				options={{
					title: '홈',
					tabBarIcon: ({ color, focused }) => (
						<IconSymbol 
							size={24} 
							name="house.fill" 
							color={color} 
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: '대시보드',
					tabBarIcon: ({ color, focused }) => (
						<IconSymbol 
							size={24} 
							name="chart.bar.fill" 
							color={color} 
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: '설정',
					tabBarIcon: ({ color, focused }) => (
						<IconSymbol 
							size={24} 
							name="gearshape.fill" 
							color={color} 
						/>
					),
				}}
			/>
		</Tabs>
	);
}
