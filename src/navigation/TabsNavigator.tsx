import React from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ColorSchemeName, Pressable, StyleSheet } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import TabOneScreen from '@/screens/TabOneScreen';
import TabTwoScreen from '@/screens/TabTwoScreen';

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
              style={styles.headerButton}
            >
              {({ pressed }) => (
                <FontAwesome
                  name="info-circle"
                  size={24}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={[styles.icon, pressed && styles.pressed]}
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

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
  },
  icon: {
    // Base icon styles
  },
  pressed: {
    opacity: 0.5,
  },
});
