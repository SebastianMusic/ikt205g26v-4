import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { parse, z } from 'zod';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { getNotes, createNote } from '@/utils/queries'
import { NoteSchema, NoteDTOSchema, NoteType, NoteDTOType } from '@/utils/interface';
import { Button } from '@react-navigation/elements';
import { NoteCard } from '@/components/note-card';
import { useCounterStore } from '@/utils/store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { JwtPayload } from '@supabase/supabase-js'
import Auth from '@/components/Auth'
import 'react-native-url-polyfill/auto'

export default function HomeScreen() {
	const [claims, setClaims] = useState<JwtPayload | null>(null)
	const loggedInStr = "Logget inn som"
	const nonLoggedInStr = "Du er ikke logget inn"

	useEffect(() => {
		supabase.auth.getClaims().then(({ data, error }) => {
			
			if (error) {
				console.error(error.message)
				return
			}
			if (data) setClaims(data.claims)
		})


		supabase.auth.onAuthStateChange(() => {
			
			supabase.auth.getClaims().then(({ data, error }) => {
				if (error) {
					console.error(error.message)
					return
				}
				
				if (data) setClaims(data.claims)

			})

		})
	}, [])

	async function signOut() {
		const { error } = await supabase.auth.signOut()
		if (error) {
			console.error(error.message)
			return
		}
		
		setClaims(null)

	}

	// if claims are valid redirct user to homescreen
	useEffect(() => {
		
		if (claims != null) {
			
			
			
			router.navigate("/home")
		} else {
			console.warn("claims are null")
		}
	}, [claims])
	return (

		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ flex: 1, justifyContent: "center" }}>
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<View style={{ justifyContent: "center" }}>
						<Text style={{ fontSize: 30 }}>{claims && loggedInStr || nonLoggedInStr}</Text>
						<Text style={{ fontSize: 30 }}>{claims && claims.email}</Text>
						{claims && <Button style={{ margin: 20 }} onPressIn={signOut}>Logg ut</Button>}
					</View>
				</View >
				{!claims && <View style={{ flex: 4 }}>
					<Auth />
				</View>}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
});
