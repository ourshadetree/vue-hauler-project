<template>
    <div class="invite-page">
      <div v-if="loading" class="loading">Loading invitation…</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <InviteForm
          :profile="profile"
          @submit="handleSubmit"
          @sign-in="goToSignIn"
        />
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'
import InviteForm from '@/components/InviteForm.vue'

const route      = useRoute()
const router     = useRouter()
const inviteId   = route.params.inviteId

const loading    = ref(true)
const error      = ref('')
const profile    = reactive({
  user_id:       null,
  first_name:    '',
  last_name:     '',
  email_address: '',
  company_name:  '',
  ein_number:    '',
  business_phone:'',
  dot_number:    '',
  number_of_trucks: 0,
  address_line1: '',
  address_line2: '',
  city:          '',
  state:         '',
  zip:           '',
  services:      [],
  tos_agree:     false,
  is_finished:   false,
  invite_url:    ''
})

async function fetchInvite() {
  const fullUrl = `${window.location.origin}/invite/${inviteId}`
  const { data, error: fetchErr } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('invite_token', inviteId)
    .single()

  if (fetchErr || !data) {
    error.value = 'Invalid or expired invitation link.'
  } else {
    Object.assign(profile, data)
  }
  loading.value = false
}

onMounted(fetchInvite)

async function handleSubmit() {
  loading.value = true
  error.value   = ''

  // Mark as finished if this is their first time
  profile.is_finished = true

  const { error: upsertErr } = await supabase
    .from('user_profiles')
    .upsert({ ...profile })

  if (upsertErr) {
    error.value = 'Save failed: ' + upsertErr.message
    loading.value = false
    return
  }

  // Redirect to your normal sign-in flow (or dashboard, if you prefer)
  router.push({ name: 'signin' })
}

function goToSignIn() {
  router.push({ name: 'signin' })
}
</script>

  