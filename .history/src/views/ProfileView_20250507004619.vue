<template>
  <div class="profile-view">
    <!-- 1) Page title and instruction -->
    <h2 class="profile-title">Profile Information</h2>
    <p class="profile-instruction">
      {{ incomplete
         ? 'Please complete your registration below.'
         : 'Click “Edit Info” to make changes to your profile.' }}
    </p>

    <!-- 2) Banner always shown -->
    <img class="banner" :src="haulerBannerRef" alt="Welcome Banner" />

    <!-- 3) Complete vs. Edit button -->
    <div class="action-bar">
      <button class="primary-btn" @click="editing = true">
        {{ incomplete ? 'Complete Registration' : 'Edit Info' }}
      </button>
    </div>

    <!-- 4) Loading overlay -->
    <div v-if="isLoading" class="loading">Loading…</div>

    <!-- 5) Form -->
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

      <!-- only show Save when you’re actually editing -->
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

// reactive model
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

// which fields must be non-blank?
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

// onMounted: always run through all steps, then hide loader
onMounted(async () => {
  isLoading.value = true

  // 1) get the persisted session
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()
  if (sessionError) {
    console.error('Session fetch error:', sessionError)
  }

  // 2) fetch user_profile if we have a signed‑in user
  if (session?.user?.id) {
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

    // 3) seed email if blank
    if (!profile.email_address && session.user.email) {
      profile.email_address = session.user.email
    }
  } else {
    console.warn('No signed‑in user; showing blank form')
  }

  // 4) done loading
  isLoading.value = false
})

async function saveProfile() {
  isLoading.value = true
  try {
    // re‑get session to identify user
    const {
      data: { session },
      error: sessErr
    } = await supabase.auth.getSession()
    if (sessErr || !session?.user) {
      throw sessErr || new Error('Not signed in')
    }

    // upsert profile
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
.profile-view {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Karla', sans-serif;
}
.profile-title {
  font-family: 'Sora', sans-serif;
  color: #0c2442;
  margin-bottom: 0.25rem;
}
.profile-instruction {
  color: #555;
  margin-bottom: 1rem;
}
.banner {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
.primary-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  background: #0c2442;
  color: #fff;
}
.primary-btn:hover {
  background: #092038;
}
.loading {
  text-align: center;
  padding: 2rem 0;
  color: #666;
}
.field {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.save-btn {
  margin-top: 1rem;
}
</style>
