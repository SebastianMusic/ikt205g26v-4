import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { TextInput } from 'react-native';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>

			<KeyboardProvider>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
					<Stack.Screen name="index" options={{ headerShown: true }} />
					<Stack.Screen
						name="edit_note"
						options={{
							title: "Rediger notat"
						}}

					/>
				</Stack>
				<StatusBar style="auto" />
			</KeyboardProvider>
		</ThemeProvider>
	);
}
