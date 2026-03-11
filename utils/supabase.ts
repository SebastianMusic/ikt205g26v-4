import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'
import { AppState, Platform } from 'react-native'

import * as SecureStore from 'expo-secure-store'
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY

if (supabaseUrl == null) {
	console.error("supabaseUrl is null")
	process.exit()
}
if (supabaseKey == null) {
	console.error("supabaseAnonKey is null")
	process.exit()
}



const nativeStorageAdapter = {
	getItem: (key: string) => SecureStore.getItemAsync(key),
	setItem: (key: string, value: string) => {
		if (value.length > 2048) {
			console.warn('Value > 2048 bytes may not be stored successfully.')
		}
		return SecureStore.setItemAsync(key, value)
	},
	removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}
export const supabase = createClient(
	supabaseUrl,
	supabaseKey,
	{
		auth: {
			storage: nativeStorageAdapter,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
			lock: processLock,
		},
	})


if (Platform.OS !== 'web') {

	AppState.addEventListener('change', (state) => {

		if (state === 'active') {

			supabase.auth.startAutoRefresh()

		} else {

			supabase.auth.stopAutoRefresh()

		}

	})

}
