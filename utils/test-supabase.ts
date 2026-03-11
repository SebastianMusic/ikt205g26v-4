import { createClient } from '@supabase/supabase-js'
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



export const supabase = createClient(
	supabaseUrl,
	supabaseKey,

)


