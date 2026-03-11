import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Keyboard, Modal, Alert, Text } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { NoteType, NoteSchema, NoteDTOSchema, NoteDTOType } from '@/utils/interface';
import { Button, TextInput, ActivityIndicator } from 'react-native';
import { getNotes, createNote } from '@/utils/queries'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCounterStore, usePictureStore } from '@/utils/store';
import { KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';
import { ScrollView } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import LoadingIndicator from '@/components/loadingIndicator';
import * as ImagePicker from 'expo-image-picker'

export default function HomeScreen() {
	const pictureStore = usePictureStore()
	const router = useRouter()
	const counterState = useCounterStore()
	const [notes, setNotes] = useState<NoteType[]>([])
	const [title, setTitle] = useState("")
	const [body, setBody] = useState("")
	const [showImageUploadingIndicator,
		setShowImageUploadingIndicator]
		= useState<boolean>(false)
	const [imageConfirmationModalvisible, setImageConfirmationModalvisible] = useState(false)


	async function pickImage() {

		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (!permissionResult.granted) {
			Alert.alert("Tillatelse for å bruke galleriet er nødvendig")
			return
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			aspect: [4, 3],
			quality: 1

		})

		if (!result.canceled) {
			const image = result.assets[0]
			console.log(`image picked: ${image}`)
			pictureStore.setPictureRef(image)
		}


	}

	async function takeImage() {
		const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

		if (!permissionResult.granted) {
			alert("Tillatelse for å bruke kameraet er nødvendig")
			return
		}
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ['images'],
			aspect: [4, 3],
			quality: 1

		})
		if (!result.canceled) {
			const image = result.assets[0]
			pictureStore.setPictureRef(image)
		}
	}


	// useEffect(() => {
	// 	console.log("inside use effect")
	// 	getNotes().then(notes => {
	// 		const parsedNotes = NoteSchema.array().safeParse(notes)
	// 		if (parsedNotes.error) {
	// 			console.error("getNotes returned null")
	// 			return
	// 		}
	// 		setNotes(parsedNotes.data)
	// 	})
	// 	console.log(" after")
	// }, []);


	useEffect(() => {
		supabase.auth.getClaims().then(({ data, error }) => {
			if (error || data == null) {
				router.navigate("/")
			}
		});
	})


	async function createNoteWrapper() {
		const pictureExists = pictureStore.pictureRef != null

		const note: NoteDTOType = {
			title,
			body,
			image_id: null,
		}



		if (pictureExists) setShowImageUploadingIndicator(true)

		createNote(note).then((result) => {
			if (result) {
				console.log('incremented counterstate')
				counterState.incGetNotes()
				// clear input fields
				setTitle("")
				setBody("")
				alert("Notat opprettet!")
			}
			if (pictureExists) setShowImageUploadingIndicator(false)
		})
		router.navigate('/home')

	}



	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<KeyboardAwareScrollView
					bottomOffset={62}
					contentContainerStyle={{ flex: 1 }}
					style={{ flex: 1 }}
				>

					{
						// Text input
					}
					<TextInput
						style={{ height: 70, fontSize: 40, borderColor: "black", borderTopWidth: 1, borderBottomWidth: 1 }}
						multiline
						value={title}
						numberOfLines={3}
						onChangeText={setTitle}
						placeholder='Tittel'
						placeholderTextColor="#00000222"
					></TextInput>

					<TextInput
						multiline
						value={body}
						style={{
							flex: 1, fontSize: 20, borderColor: "black", borderTopWidth: 1, borderBottomWidth: 1, marginVertical: 20, textAlignVertical: "top"
						}}
						onChangeText={setBody}
						placeholder='Innhold'
						placeholderTextColor="#00000222"
					></TextInput>
					{pictureStore.pictureRef &&
						<Image source={{ uri: pictureStore.pictureRef.uri }}
							style={{ flex: 1 }} />
					}

					<View style={{ flexDirection: "row", justifyContent: "center", gap: "10%", margin: 10 }}>
						<Button title="Kamera" onPress={takeImage} />
						<Button title="Galleri" onPress={pickImage} />
						<Button title="Fjern Bilde" onPress={() => pictureStore.setPictureRef(null)} />
					</View>
					{showImageUploadingIndicator &&
						<LoadingIndicator testID="imageUploadingIndicatorId" body="Bildet lastes opp. Vær tålmodig" />
					}

					<Button testID='saveButton' disabled={showImageUploadingIndicator} title="lagre" onPress={() => {
						if (pictureStore.pictureRef == null) {
							createNoteWrapper()
						} else {
							setImageConfirmationModalvisible(true)
						}
					}}

					/>
				</KeyboardAwareScrollView>
				<Modal visible={imageConfirmationModalvisible}>
					<SafeAreaView style={{ flex: 1 }}>
						<View>
							<Text style={{ fontSize: 30 }}>Notatet innheolder et bilde. </Text>
							<Text style={{ fontSize: 30 }}>Ønsker du å fortsette?</Text>
						</View>
						{pictureStore.pictureRef && <Image source={{ uri: pictureStore.pictureRef.uri }}
							style={{ flex: 1 }} />
						}

						<View style={{ paddingVertical: 5 }}>
							<Button title="Bekreft lagring" onPress={() => {
								setImageConfirmationModalvisible(false)
								createNoteWrapper()

							}} />
							<Button title="avbryt" onPress={() => setImageConfirmationModalvisible(false)} />
						</View>
					</SafeAreaView>

				</Modal>

			</SafeAreaView>
		</SafeAreaProvider >
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
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
});
