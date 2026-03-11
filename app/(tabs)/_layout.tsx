import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import { supabase } from '@/utils/supabase';

export default function TabLayout() {
	const router = useRouter()
	// const colorScheme = useColorScheme();
	const colorScheme = "light"


	function AuthTab({ children, path, ...props }: any) {
		const handlePress = () => {
			supabase.auth.getClaims().then(({ data, error }) => {
				if (data == null || error) {
					alert(`Du har ikke tilgang til ${path}. Logg inn først`)
					return
				}
				router.navigate(path)

			})

		}
		return (
			<TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }} onPress={handlePress}>
				{children}
			</TouchableOpacity>

		)
	}


	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Jobb Notater',
					tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
					tabBarButton: (props) => <AuthTab {...props} path="/home" />
				}}
			/>
			<Tabs.Screen
				name="create_note"
				options={{
					title: 'Create note',
					tabBarIcon: ({ color }) => <MaterialIcons size={28} name="add" color={color} />,
					tabBarButton: (props) => <AuthTab {...props} path="/create_note" />
				}}
			/>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Profil',
					tabBarIcon: ({ color }) => <MaterialIcons size={28} name="person" color={color} />,
				}}
			/>
		</Tabs>
	);
}
