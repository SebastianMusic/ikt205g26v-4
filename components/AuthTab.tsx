import React from 'react';

import { TouchableOpacity } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export default function AuthTab({ children, path, ...props }: any) {
	const router = useRouter()
	const handlePress = () => {
		supabase.auth.getClaims().then(({ data, error }) => {
			if (data == null || error) {
				console.log(`data is: ${data}`)
				alert(`Du har ikke tilgang til ${path}. Logg inn først`)
				return false
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
