import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import TabOneScreen from '@/screens/TabOneScreen';
import TabTwoScreen from '@/screens/TabTwoScreen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

type TabsParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

function getActiveTint(colorScheme: ColorSchemeName) {
  return Colors[colorScheme ?? 'light'].tint;
}

export default function TabsNavigator() {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: getActiveTint(colorScheme),
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <FontAwesome name="code" size={24} color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal' as never)}
              style={{ marginRight: 15 }}
            >
              {({ pressed }) => (
                <FontAwesome
                  name="info-circle"
                  size={24}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        })}
      />
      <Tab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <FontAwesome name="code" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}


