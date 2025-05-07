<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'

const router       = useRouter()
const email        = ref('')
const password     = ref('')
const errorMessage = ref('')
const loading      = ref(false)
const emit         = defineEmits(['close'])

// Log the shape of your supabase.auth object at startup
console.log('supabase.auth methods:', Object.keys(supabase.auth))

async function onSubmit() {
  console.log('🚀 onSubmit clicked – email=', email.value)
  loading.value = true
  errorMessage.value = ''

  try {
    console.log('▶️ calling signInWithPassword…')
    // invoke Supabase auth
    const promise = supabase.auth.signInWithPassword({
      email:    email.value,
      password: password.value,
    })
    console.log('🎁 promise returned:', promise, 'has .then?', typeof promise.then)
    
    // wait for it
    const { data, error } = await promise
    console.log('🔐 signInWithPassword resolved:', { data, error })

    if (error) {
      console.error('❌ Supabase error:', error)
      errorMessage.value = error.message
    } else if (data.session) {
      console.log('✅ got session:', data.session)
      emit('close')
      await router.push({ name: 'profile' })
    } else {
      console.warn('⚠️ no session in data:', data)
      errorMessage.value = 'Unable to sign in (no session returned).'
    }
  } catch (err) {
    console.error('💥 exception in signIn:', err)
    errorMessage.value = err.message || 'Unexpected error during sign‑in.'
  } finally {
    console.log('⏹ finishing signIn flow')
    loading.value = false
  }
}
</script>
