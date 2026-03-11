import { z } from 'zod';

export const NoteDTOSchema = z.object({
	title: z.string(),
	body: z.string(),
	image_id: z.string().nullable()
})
export type NoteDTOType = z.infer<typeof NoteDTOSchema>
export const NoteSchema = NoteDTOSchema.extend({
	created_at: z.string(),
	id: z.string(),
	user_id: z.string()
})
export type NoteType = z.infer<typeof NoteSchema>


