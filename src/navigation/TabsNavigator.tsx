import React from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ColorSchemeName, Pressable, StyleSheet } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { ROOT_ROUTES, TAB_ROUTES } from '@/constants/routes';
import TabOneScreen from '@/screens/TabOneScreen';
import TabTwoScreen from '@/screens/TabTwoScreen';

type TabsParamList = {
  [TAB_ROUTES.TAB_ONE]: undefined;
  [TAB_ROUTES.TAB_TWO]: undefined;
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
        name={TAB_ROUTES.TAB_ONE}
        component={TabOneScreen}
        options={({ navigation }) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <FontAwesome name="code" size={24} color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate(ROOT_ROUTES.MODAL as never)}
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
        name={TAB_ROUTES.TAB_TWO}
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
