
import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useEffect, useState, } from 'react';
import { NoteType, NoteSchema, NoteDTOSchema, NoteDTOType } from '@/utils/interface';
import { Button } from '@react-navigation/elements';
import { TextInput } from 'react-native';
import { getNotes, editNote } from '@/utils/queries'
import { useLocalSearchParams, Stack } from 'expo-router';
import { useRouter } from "expo-router"
import { useCounterStore } from '@/utils/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function EditNote() {
	const countState = useCounterStore()
	const params = useLocalSearchParams<{ id: string; title: string; body: string; created_at: string }>()
	const router = useRouter()

	const [title, setTitle] = useState(params.title)
	const [body, setBody] = useState(params.body)

	// update note query
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
					<Button style={{}} onPress={() => {
						const note = {
							title,
							body,
							created_at: params.created_at,
							id: params.id,
						}

						editNote(note).then((result) => {
							if (result) {
								countState.increment()
								alert("Notat Redigert!")
							}
						})
					}}>Lagre</Button>
				</KeyboardAwareScrollView>
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
		color: "white"
	},
});
