import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function RootIndex() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
			<Text>Welcome</Text>
			<Link href="/(tabs)/home">Go to Home</Link>
		</View>
	);
}
