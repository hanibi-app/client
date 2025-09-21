import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';

export default function RootIndex() {
	return <Redirect href="/welcome" />;
}
