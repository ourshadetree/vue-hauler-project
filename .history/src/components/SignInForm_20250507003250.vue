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


<style scoped>
#authContainer {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  font-family: 'Karla', sans-serif;
}
h1 {
  font-family: 'Sora', sans-serif;
  color: #0C2442;
  font-weight: 900;
  font-size: 2.5rem;
  margin-bottom: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
form input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #E5E5E5;
  font-size: 1rem;
  font-family: 'Karla', sans-serif;
  color: #0C2442;
}
form button {
  padding: 12px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background-color: #B11818;
  color: #fff;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  transition: background-color 0.3s;
}
form button:hover:not([disabled]) {
  background-color: #8F1212;
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #B11818;
  margin-top: 10px;
  font-size: 0.9rem;
}
</style>
