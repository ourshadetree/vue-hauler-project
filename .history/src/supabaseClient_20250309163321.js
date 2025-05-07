
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseKey = process.env.VUE_APP_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

console.log("Supabase URL:", process.env.VUE_APP_SUPABASE_URL);
console.log("Supabase Key:", process.env.VUE_APP_ANON_KEY);
