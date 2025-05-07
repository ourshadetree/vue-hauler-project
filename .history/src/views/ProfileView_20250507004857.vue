<template>
  <div class="profile-view">
    <h2 class="profile-title">Profile Information</h2>
    <p class="profile-instruction">
      {{ incomplete
         ? 'Please complete your registration below.'
         : 'Click “Edit Info” to make changes to your profile.' }}
    </p>

    <img class="banner" :src="haulerBannerRef" alt="Welcome Banner" />

    <div class="action-bar">
      <button class="primary-btn" @click="editing = true">
        {{ incomplete ? 'Complete Registration' : 'Edit Info' }}
      </button>
    </div>

    <div v-if="isLoading" class="loading">Loading…</div>

    <form v-else @submit.prevent="saveProfile">
      <div v-for="f in fields" :key="f.name" class="field">
        <label :for="f.name">{{ f.label }}</label>
        <input
          :id="f.name"
          v-model="profile[f.name]"
          :placeholder="profile[f.name] || f.label"
          :disabled="!editing"
          type="text"
        />
      </div>
      <button v-if="editing" type="submit" class="primary-btn save-btn">
        Save
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabaseClient'
import haulerBanner from '@/assets/haulerBanner.png'

const haulerBannerRef = haulerBanner
const isLoading = ref(true)
const editing   = ref(false)

const profile = reactive({
  first_name:       '',
  last_name:        '',
  email_address:    '',
  company_name:     '',
  dot_number:       '',
  mc_number:        '',
  business_phone:   '',
  duns_number:      '',
  fleet_type:       '',
  number_of_trucks: ''
})

const requiredFields = ['first_name', 'last_name']
const incomplete = computed(() =>
  requiredFields.some(key => !String(profile[key]||'').trim())
)

const fields = [
  { name: 'first_name',       label: 'First Name' },
  { name: 'last_name',        label: 'Last Name' },
  { name: 'email_address',    label: 'Email Address' },
  { name: 'company_name',     label: 'Company Name' },
  { name: 'dot_number',       label: 'DOT Number' },
  { name: 'mc_number',        label: 'MC Number' },
  { name: 'business_phone',   label: 'Business Phone' },
  { name: 'duns_number',      label: 'DUNS Number' },
  { name: 'fleet_type',       label: 'Fleet Type' },
  { name: 'number_of_trucks', label: 'Number of Trucks' }
]

onMounted(async () => {
  isLoading.value = true

  // 1) safe getSession()
  let session = null
  try {
    const result = await supabase.auth.getSession()
    session = result?.data?.session ?? null
    if (result.error) console.error('Session error:', result.error)
  } catch (err) {
    console.error('Exception fetching session:', err)
  }

  // 2) if we have a user, attempt to load their profile
  if (session?.user?.id) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError)
      } else if (profileData) {
        Object.assign(profile, profileData)
      }
    } catch (err) {
      console.error('Exception fetching profile row:', err)
    }

    // 3) seed email if blank
    if (!profile.email_address && session.user.email) {
      profile.email_address = session.user.email
    }
  } else {
    console.warn('No signed‑in user; showing blank form')
  }

  // 4) finally hide loader
  isLoading.value = false
})

async function saveProfile() {
  isLoading.value = true
  try {
    let session = null
    const res = await supabase.auth.getSession().catch(e => ({ error: e }))
    if (res.error) throw res.error
    session = res.data?.session
    if (!session?.user) throw new Error('Not signed in')

    const { error: upErr } = await supabase
      .from('user_profiles')
      .upsert({ user_id: session.user.id, ...profile })
    if (upErr) throw upErr

    alert('Profile saved!')
    editing.value = false
  } catch (err) {
    alert(`Save failed: ${err.message}`)
    console.error('saveProfile error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.profile-view { max-width: 600px; margin: 2rem auto; padding: 1rem; font-family: 'Karla', sans-serif; }
.profile-title { font-family: 'Sora', sans-serif; color: #0c2442; margin-bottom: .25rem; }
.profile-instruction { color: #555; margin-bottom: 1rem; }
.banner { width: 100%; border-radius: 8px; margin-bottom: 1rem; }
.action-bar { display: flex; justify-content: flex-end; margin-bottom: 1rem; }
.primary-btn { padding: .5rem 1rem; border-radius: 4px; border: none; cursor: pointer; font-family: 'Sora', sans-serif; background: #0c2442; color: #fff; }
.primary-btn:hover { background: #092038; }
.loading { text-align: center; padding: 2rem 0; color: #666; }
.field { margin-bottom: 1rem; }
label { display: block; margin-bottom: .25rem; font-weight: bold; }
input { width: 100%; padding: .5rem; border: 1px solid #ccc; border-radius: 4px; }
.save-btn { margin-top: 1rem; }
</style>
