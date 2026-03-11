import { Image } from 'expo-image';
import { Button, Platform, StyleSheet, View, Text, ScrollView } from 'react-native';
import { parse, z } from 'zod';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { getNotes, createNote } from '@/utils/queries'
import { NoteSchema, NoteDTOSchema, NoteType, NoteDTOType } from '@/utils/interface';
import { NoteCard } from '@/components/note-card';
import { useCounterStore } from '@/utils/store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { JwtPayload } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import { useRouter } from 'expo-router';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useNoteStore } from '@/utils/store';
import LoadingIndicator from '@/components/loadingIndicator';
import { generateNotes } from '@/utils/dummy';

export default function HomeScreen() {
	const router = useRouter()
	const counterStore = useCounterStore()
	const noteStore = useNoteStore()
	const notes = noteStore.notes
	const setNotes = noteStore.setNotes
	const FETCH_INCREMENT = 5
	const [refreshKey, setRefreshKey] = useState(0)
	const [showNoteLoadingIndicator, setShowNoteLoadingIndicator] = useState(false)
	function getNotesSyncWrapper() {
		setShowNoteLoadingIndicator(true)
		const noteCount = notes.length
		const fetchStart = noteCount
		const fetchEnd = noteCount + FETCH_INCREMENT - 1
		getNotes(fetchStart, fetchEnd).then(fetchedNotes => {
			console.log(`trying to fetch ${noteCount}, from ${fetchStart} to ${fetchEnd}`)
			const parsedNotes = NoteSchema.array().safeParse(fetchedNotes)
			if (!parsedNotes.success) {
				console.error("getNotes returned null")
				setShowNoteLoadingIndicator(false)
				return
			}
			console.log(`setting notes ${JSON.stringify(parsedNotes.data, null, 2)}`)
			if (!fetchedNotes) {
				return
			}
			console.log(`prev notes: ${JSON.stringify(notes, null, 2)}`)
			console.log(`new notes ${JSON.stringify(parsedNotes.data), null, 2}`)
			const newNotes = [...notes, ...parsedNotes.data]
			setNotes(newNotes)
			setShowNoteLoadingIndicator(false)
		})
	}
	useEffect(() => {
		console.log("Getting Notes")
		getNotesSyncWrapper()
		counterStore.incRender()
	}, [counterStore.getNotes]);

	useEffect(() => {
		supabase.auth.getClaims().then(({ data, error }) => {
			if (error || data == null) {
				router.navigate("/")
			}
		});
	})



	useEffect(() => {
		registerForPushNotificationsAsync()
	}, []);

	return (

		<SafeAreaView style={{ flex: 1 }}>
			{showNoteLoadingIndicator && <LoadingIndicator testID="noteLoadingIndicator" body='Henter notater fra databasen. vær tålmodig' />}
			<View style={{ flex: 1 }}>
				<View style={{ alignItems: "center" }}>
					<View>
						<Text style={{ fontSize: 60 }}>Cloudnotes </Text>
						<Text style={{ fontSize: 24 }}>Fra skaperne av sebbe.no</Text>
					</View>
				</View>

				<View style={{ flex: 1, paddingTop: 40 }}>
					<View style={{ alignItems: "center" }}>
						<Text style={{ fontSize: 30 }}>
							Dine notater
						</Text>
						{notes.length == 0 &&
							<Text style={{ fontSize: 20 }}> Du har ingen notater</Text>
						}
					</View>
					<View style={{ flex: 1, alignItems: "center" }}>
						<ScrollView style={{ flex: 1, width: "90%" }}>
							<View>
								{notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
									.map((note, i) => {
										return (
											<NoteCard note={note} key={note.id} ></NoteCard>
										)
									})}
							</View>
						</ScrollView>
					</View>
				</View>
			</View>
			<Button title='Last inn flere notater'
				onPress={() => {
					counterStore.incGetNotes()
				}} />

			{true && <Button title='debug'
				onPress={() => {
					counterStore.incGetNotes()
					generateNotes(40)
					setNotes([])
				}} />}
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

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: false,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});


async function uploadPushNotificationToken(pushToken: string) {
	if (!pushToken) {
		console.error("Push token is null")
		return
	}
	const { data, error } = await supabase.from("profile").upsert({ expo_push_token: pushToken })
	if (error) {
		console.error(`Error uploading pushtoken ${error.message}`)
		alert(`Error uploading pushtoken ${error.message} `)
	}
	console.log(`Successfull upload of pushtoken ${data}`)
}



async function registerForPushNotificationsAsync() {
	let token;

	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('myNotificationChannel', {
			name: 'A channel is needed for the permissions prompt to appear',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		// Learn more about projectId:
		// https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
		// EAS projectId is used here.
		try {
			const projectId =
				Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
			if (!projectId) {
				throw new Error('Project ID not found');
			}
			console.log(`Project ID is: ${projectId}`)
			token = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data;
			console.log(token);
		} catch (e) {
			token = `${e}`;
		}
	} else {
		alert('Must use physical device for Push Notifications');
	}

	if (token) {
		console.log(`got pushtoken ${token}`)
		uploadPushNotificationToken(token)
	}
	return token;
}
