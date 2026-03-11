import { supabase } from '@/utils/test-supabase';
import { createNote } from '@/utils/queries'
import { NoteDTOType, NoteType } from '@/utils/interface'
import { faker } from '@faker-js/faker'

function createMockNote(): NoteDTOType {
	const note: NoteDTOType = {
		title: faker.word.noun(),
		body: faker.lorem.sentence(),
		image_id: null,
	}
	return note
}

test('create note', () => {
	const noteDto = createMockNote()
	console.log(noteDto)
	expect(createNote(noteDto)).toBe(true)
})


