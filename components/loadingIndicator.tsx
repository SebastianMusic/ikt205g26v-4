import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Keyboard, Modal, Alert, Text } from 'react-native';

import { Button, TextInput, ActivityIndicator } from 'react-native';

export default function LoadingIndicator({ body, testID }: { body: string, testID: string }) {
	return (
		<View testID={testID} style={{ ...StyleSheet.absoluteFillObject, flex: 1, justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
			<View style={{ backgroundColor: '#ffffffee', padding: 20, borderRadius: 20, }}>
				<ActivityIndicator size="large" style={{}} />
				<Text style={{ fontSize: 20 }}>{body}</Text>
			</View>
		</View>

	)
}
