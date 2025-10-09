import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabsNavigator from '@/navigation/TabsNavigator';
import ModalScreen from '@/screens/ModalScreen';
import SampleKeyboardScreen from '@/screens/SampleKeyboardScreen';
import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="Modal"
        component={ModalScreen}
        options={{
          presentation: 'modal',
          title: 'Modal',
        }}
      />
      <Stack.Screen
        name="SampleKeyboard"
        component={SampleKeyboardScreen}
        options={{
          title: 'Keyboard Sample',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}
