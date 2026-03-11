import { supabase } from '@/utils/supabase';
import { NoteSchema, NoteDTOSchema, NoteType, NoteDTOType } from '@/utils/interface';
import { useCounterStore, usePictureStore } from '@/utils/store';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from "uuid"
import base64 from 'react-native-base64';
import * as FileSystem from 'expo-file-system'
import { useNoteStore } from '@/utils/store';

async function uploadImageToSupabase(uuid: string) {
	const pictureStore = usePictureStore.getState()
	console.log(`attempting to upload picture: ${pictureStore.pictureRef?.uri}`)
	if (pictureStore.pictureRef == null) {
		console.error("can not upload picture to supabase, pictureStore.pictureRef is null")
		return
	}
	const fileinfo = new FileSystem.File(pictureStore.pictureRef.uri).info()
	const filesize = fileinfo.size
	const response = await fetch(pictureStore.pictureRef.uri)
	// validate file size
	if (!filesize) {
		console.error('could not get filesize')
		alert('ERROR: kunne ikke få tak i filstørrelse')
		return false
	}
	if (filesize > (1024 * 1024 * 15)) {
		console.error("File attempted to upload is too large")
		alert(`Bildets størrelse var ${filesize}. Dette er for stort. maks størrelse 15mb`)
		return false
	}
	// validate mimetype
	const allowedMimeTypes = ["image/webp", "image/png", "image/jpeg"];
	if (!pictureStore.pictureRef.mimeType) {
		console.error(`mimetype is null`)
		alert("bilde dy prøver å laste opp er i feil format. Gyldige formater er image/webp, image/png, image/jpeg")
		return false

	}
	const picMimeType = pictureStore.pictureRef.mimeType
	if (!allowedMimeTypes.includes(picMimeType)) {
		console.error(`picture is an unallowed mimetype: ${picMimeType}`)
		alert(`Bildet er en ikke tillatt mimetype: ${picMimeType}`)
	}

	const arrayBuffer = await response.arrayBuffer()
	const { data: userData, error: userError } = await supabase.auth.getUser()
	if (userError) {
		console.error(userError.message)
		alert(userError.message)
		return false
	}

	const { data, error } = await supabase.storage
		.from("image")
		.upload(`${userData.user.id}/${uuid}`, arrayBuffer, { contentType: pictureStore.pictureRef.mimeType })
	if (error) {
		console.error(error.message)
		alert(`app feilet med error ${error.message}`)
		return false
	}
	console.log(data)
}

export async function getNotes(start: number, end: number): Promise<NoteType[] | string> {
	console.log("entered get notes")
	const { data, error } = await supabase.from("note")
		.select().order("created_at", { ascending: false })
		.range(start, end);
	if (error) {
		console.log("data:", data)
		console.error(error.message)
		return error.message
	}
	return data
}

export async function createNote(noteDTO: NoteDTOType) {
	const pictureStore = usePictureStore.getState()
	if (pictureStore.pictureRef != null) {
		const uuid = uuidv4()
		const result = await uploadImageToSupabase(uuid)
		if (result == false) {
			console.error("error in uploading image")
			alert("Feil ved å laste opp bilde når det ble forsøkt å opprette notat ")
			return false
		}
		noteDTO.image_id = uuid;
		pictureStore.pictureRef = null;
	}

	if (noteDTO.title.length == 0) {
		alert("Et notat må ha en tittel. Prøv igjen")
		return false
	}
	if (noteDTO.body.length == 0) {
		alert("Et notat må ha innhold. Prøv igjen")
		return false
	}
	const { data, error } = await supabase.from("note").insert(noteDTO);
	if (error != null) {
		console.log(error.message);
		return false
	}

	console.log("added note successfully")
	return true
}

export async function editNote(note: NoteType) {
	const currentTime = new Date()
	note.created_at = currentTime.toISOString()
	const { data, error } = await supabase.from("note").update(note).eq("id", note.id);
	if (error != null) {
		console.log(error.message);
		alert(`Klarte ikke å endre notat ${error.message}`)
		return false
	}
	console.log("edited note successfully")
	return true
}

export async function deleteNote(noteId: string) {
	const countState = useCounterStore.getState()
	const { data, error } = await supabase.from("note").delete().eq("id", noteId);
	if (error != null) {
		console.log(error.message);
		alert(`Klarte ikke å slette notat: ${error.message}`)
		return false
	}
	const noteStore = useNoteStore.getState()
	noteStore.setNotes(noteStore.notes.filter((entry) => entry.id != noteId))
	console.log("edited note successfully")
	alert("Notat slettet!!")
	return true
}

export async function getNoteImage(image_id: string) {
	const { data: userData, error: userError } = await supabase.auth.getUser()
	if (userError) {
		console.error(userError.message)
		alert(`klarte ikke å finne brukerid ${userError.message}`)
		return null
	}

	const { data, error } = await supabase.storage.from("image").createSignedUrl(`${userData.user.id}/${image_id}`, 60)
	if (error) {
		console.log(error.message)
		alert(`Klarte ikke å hente bilde fra supabase storage. Error: ${error.message}`)
		return null
	}
	return data



}


