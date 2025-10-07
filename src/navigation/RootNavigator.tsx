import TabsNavigator from '@/navigation/TabsNavigator';
import ModalScreen from '@/screens/ModalScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Tabs: undefined;
  Modal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Modal" component={ModalScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}


