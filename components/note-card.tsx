import { useNavigation } from "@react-navigation/native"
import { Pressable, View, Button, Modal, ScrollView } from "react-native"
import { Text } from "@react-navigation/elements"
import { NoteType } from "@/utils/interface"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { deleteNote, getNoteImage } from "@/utils/queries"
import { Image } from "expo-image"
import base64 from "react-native-base64"
import { useWindowDimensions } from 'react-native';
import { useCounterStore } from "@/utils/store"



export function NoteCard({ note }: { note: NoteType }) {
	const router = useRouter()
	const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)
	const [noteImage, setNoteImage] = useState<string | null>(null)
	const [noteDetailsVisible, setNoteDetailsVisible] = useState(false)
	const { height, width } = useWindowDimensions();
	const counterStore = useCounterStore()




	function goToeditNote() {
		console.log("logging note")
		console.log(note.title)
		console.log(note.body)
		console.log("navigating to note")
		router.push({
			pathname: "/edit_note",
			params: note
		})

	}

	useEffect(() => {
		if (!note.image_id) {
			return
		}
		console.log(`note image id to fetch is: ${note.image_id}, for note with id ${note.id}`)
		getNoteImage(note.image_id).then((data) => {
			if (!data) {
				return
			}
			setNoteImage(data.signedUrl)
			console.log(`data.singedUrl: ${data.signedUrl}`)
		}
		)

	}, [counterStore.getNotes])

	return (
		<View style={
			{
				padding: 10, borderWidth: 1,
				borderColor: 'black', alignItems: "center",
				flex: 1,

			}
		}>
			<View>
				<Text style={
					{ fontSize: 20, }
				}>
					{note.title}
				</Text>

			</View>

			{noteImage && <View style={{ flex: 1, height: '100%', width: '100%' }}>
				<Image style={{ flex: 1, width: '100%', height: 200 }}
					contentFit="contain"
					onError={(e) => console.error(`Image error: ${e}`)}
					source={noteImage} />
			</View>}
			<View style={{ flexDirection: "row", gap: 40, paddingTop: 20 }}>
				<Button title="Detaljer" onPress={() => setNoteDetailsVisible(true)}></Button>
				<Button title="Rediger" onPress={goToeditNote}></Button>
				<Button title="Slett" onPress={() => { setDeleteModalVisible(true) }}></Button>
				<Modal visible={deleteModalVisible} >
					<SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
						<View style={{ flex: 1, justifyContent: "center", width: "80%" }}>
							<Text style={{ fontSize: 25, textAlign: "center" }}>Are you sure you want to delete note: </Text>
							<Text style={{ fontSize: 20, textAlign: "center" }}>{note.title}</Text>
							<View style={{ paddingTop: 40, justifyContent: "center", gap: 50, flexDirection: "row" }}>
								<Button title="close" onPress={() => { setDeleteModalVisible(false) }} />
								<Button title="delete" onPress={() => { setDeleteModalVisible(false); deleteNote(note.id); }} />
							</View>
						</View>
					</SafeAreaView>
				</Modal >
				<Modal visible={noteDetailsVisible}>
					<SafeAreaView style={{ flex: 1 }}>
						<ScrollView style={{ flex: 1 }}
							contentContainerStyle={{ flexGrow: 1 }}
						>
							<Text style={{ fontSize: 30 }}>{note.title}</Text>
							<Text style={{ fontSize: 20 }}>{note.body}</Text>
							{noteImage && <View style={{ flex: 1, width: '100%' }}>
								<Image style={{ flex: 1, width: '100%' }}
									contentFit="contain"
									onError={(e) => console.error(`Image error: ${e}`)}
									source={noteImage} />
							</View>
							}
						</ScrollView>

						<Button title="lukk" onPress={() => setNoteDetailsVisible(false)} />
					</SafeAreaView>



				</Modal>
			</View>
		</View >
	)
}
