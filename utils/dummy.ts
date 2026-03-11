import { supabase } from '@/utils/supabase'
import { NoteType } from '@/utils/interface'
import { faker } from '@faker-js/faker'

export async function generateNotes(count: number) {
	let i = 0
	let notes: NoteType[] = []
	const { data: userData, error: userError } = await supabase.auth.getUser()
	if (userError || userData == null) {
		return
	}
	if (!userData.user.id) {
		console.error('user id is null')
		return
	}
	const userId = userData.user.id

	
	for (i; i < count; i++) {
		const note = {
			title: faker.word.noun(),
			body: faker.lorem.sentence(),
			image_id: null,
			created_at: faker.date.past().toISOString(),
			user_id: userId,

		} as NoteType
		notes.push(note)
	}
	const { data, error } = await supabase.from("note").insert(notes)
	if (error) {
		console.error(`could note upload generated notes with error: ${error.message}`)
		return
	}
	alert('generated notes uploaded successfully ')
}
