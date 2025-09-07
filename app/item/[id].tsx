import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ItemDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Item Detail: {id}</Text>
		</View>
	);
}
